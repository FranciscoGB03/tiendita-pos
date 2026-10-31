package handlers

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pgonbo/tiendita-pos/backend/internal/response"
)

// ValidateTerminal verifica si un terminal_id existe y está activo en la base de datos.
func ValidateTerminal(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		terminalID := r.URL.Query().Get("terminal_id")
		
		if terminalID == "" {
			// 4 argumentos: w, message, code, statusCode
			response.Error(w, "terminal_id es requerido", http.StatusBadRequest, http.StatusBadRequest)
			return
		}

		var exists bool
		err := pool.QueryRow(r.Context(),
			"SELECT EXISTS(SELECT 1 FROM terminals WHERE terminal_id = $1 AND is_active = TRUE)",
			terminalID,
		).Scan(&exists)

		if err != nil {
			response.Error(w, "Error de base de datos", http.StatusInternalServerError, http.StatusInternalServerError)
			return
		}

		if !exists {
			response.Error(w, "Terminal no encontrado o inactivo", http.StatusNotFound, http.StatusNotFound)
			return
		}

		response.Success(w, map[string]bool{"valid": true}, http.StatusOK)
	}
}