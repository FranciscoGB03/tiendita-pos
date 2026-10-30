package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"

	"github.com/pgonbo/tiendita-pos/backend/internal/response"
)

// contextKey es un tipo personalizado para las claves del contexto (evita colisiones)
type contextKey string

const userClaimsKey contextKey = "userClaims"

// Auth valida el token JWT y lo agrega al contexto de la petición.
// Debe ser el primer middleware en la cadena de protección.
func Auth(jwtSecret string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Obtener el header Authorization
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			response.Error(w, "Token de autorización no proporcionado", http.StatusUnauthorized, http.StatusUnauthorized)
			return
		}

		// 2. Validar el formato "Bearer <token>"
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Error(w, "Formato de token inválido. Use 'Bearer <token>'", http.StatusUnauthorized, http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		// 3. Parsear y validar el token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validar que el método de firma sea el esperado
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			response.Error(w, "Token inválido o expirado", http.StatusUnauthorized, http.StatusUnauthorized)
			return
		}

		// 4. Extraer claims y agregarlos al contexto
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			response.Error(w, "Error al leer los datos del token", http.StatusInternalServerError, http.StatusInternalServerError)
			return
		}

		// Inyectar claims en el contexto para que el siguiente middleware/handler los use
		ctx := context.WithValue(r.Context(), userClaimsKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// RequirePermission verifica que el usuario autenticado tenga un permiso específico.
// Debe usarse DESPUÉS del middleware Auth.
func RequirePermission(requiredPermission string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Obtener claims del contexto
		claims, ok := r.Context().Value(userClaimsKey).(jwt.MapClaims)
		if !ok {
			response.Error(w, "No autenticado. Use el middleware Auth primero", http.StatusUnauthorized, http.StatusUnauthorized)
			return
		}

		// 2. Extraer el array de permisos
		permissionsInterface, exists := claims["permissions"]
		if !exists {
			response.Error(w, "Acceso denegado: sin permisos asignados", http.StatusForbidden, http.StatusForbidden)
			return
		}

		// El parser de JWT a veces convierte arrays en []interface{}
		permissions, ok := permissionsInterface.([]interface{})
		if !ok {
			response.Error(w, "Error interno al leer permisos", http.StatusInternalServerError, http.StatusInternalServerError)
			return
		}

		// 3. Buscar el permiso requerido en la lista
		hasPermission := false
		for _, perm := range permissions {
			if permStr, ok := perm.(string); ok && permStr == requiredPermission {
				hasPermission = true
				break
			}
		}

		if !hasPermission {
			response.Error(w, "Acceso denegado: permiso insuficiente", http.StatusForbidden, http.StatusForbidden)
			return
		}

		// 4. Permiso concedido, continuar con el handler
		next.ServeHTTP(w, r)
	})
}

// GetClaimsFromContext es un helper para que los handlers extraigan datos del usuario
func GetClaimsFromContext(r *http.Request) jwt.MapClaims {
	claims, _ := r.Context().Value(userClaimsKey).(jwt.MapClaims)
	return claims
}