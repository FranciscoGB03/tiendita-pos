package services

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/pgonbo/tiendita-pos/backend/internal/models"
	"github.com/pgonbo/tiendita-pos/backend/internal/repositories"
)

type AuthService struct {
	userRepo  *repositories.UserRepository
	jwtSecret string
}

// NewAuthService crea una nueva instancia del servicio de autenticación
func NewAuthService(userRepo *repositories.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

// Login valida las credenciales y genera un token JWT
func (s *AuthService) Login(ctx context.Context, req models.LoginRequest) (*models.LoginResponse, error) {
	// 1. Buscar usuario por username
	user, err := s.userRepo.GetUserByUsername(ctx, req.Username)
	if err != nil {
		return nil, errors.New("error interno del servidor")
	}
	
	// Si no existe, retornamos error genérico (no revelamos si el usuario existe o no)
	if user == nil {
		return nil, errors.New("credenciales inválidas")
	}

	// 2. Validar la credencial (PIN o Password) contra el hash bcrypt
	err = bcrypt.CompareHashAndPassword([]byte(user.CredentialHash), []byte(req.Credential))
	if err != nil {
		return nil, errors.New("credenciales inválidas")
	}

	// 3. Actualizar último login (no bloqueante, si falla no invalidamos el login)
	_ = s.userRepo.UpdateLastLogin(ctx, user.ID)

	// 4. Generar JWT (Duración: 24 horas, según decisión cerrada)
	expiresAt := time.Now().Add(24 * time.Hour)
	
	claims := jwt.MapClaims{
		"user_id":     user.ID.String(),
		"username":    user.Username,
		"full_name":   user.FullName,
		"role":        user.RoleName,
		"permissions": user.Permissions,
		"exp":         expiresAt.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return nil, errors.New("error al generar el token")
	}

	// 5. Retornar respuesta limpia (sin el hash ni datos sensibles)
	return &models.LoginResponse{
		Token:     tokenString,
		UserID:    user.ID.String(),
		Username:  user.Username,
		FullName:  user.FullName,
		Role:      user.RoleName,
		ExpiresAt: expiresAt.Unix(),
	}, nil
}