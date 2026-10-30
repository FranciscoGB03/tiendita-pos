package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/pgonbo/tiendita-pos/backend/internal/models"
	"github.com/pgonbo/tiendita-pos/backend/internal/response"
	"github.com/pgonbo/tiendita-pos/backend/internal/services"
)

type AuthHandler struct {
	authService *services.AuthService
}

// NewAuthHandler crea una nueva instancia del handler de autenticación
func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Login maneja la petición POST /api/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	// 1. Validar método HTTP
	if r.Method != http.MethodPost {
		response.Error(w, "Método no permitido", http.StatusMethodNotAllowed, http.StatusMethodNotAllowed)
		return
	}

	// 2. Decodificar el cuerpo de la petición
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, "Cuerpo de la petición inválido", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 3. Validar campos obligatorios
	if req.Username == "" || req.Credential == "" {
		response.Error(w, "Username y credential son obligatorios", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 4. Ejecutar la lógica de autenticación
	res, err := h.authService.Login(r.Context(), req)
	if err != nil {
		// El servicio ya devuelve "credenciales inválidas" o "error interno"
		response.Error(w, err.Error(), http.StatusUnauthorized, http.StatusUnauthorized)
		return
	}

	// 5. Retornar éxito con el token y datos del usuario
	response.Success(w, res, http.StatusOK)
}