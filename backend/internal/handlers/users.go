// backend/internal/handlers/users.go
package handlers

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pgonbo/tiendita-pos/backend/internal/response"
)

// Cashier representa la información mínima de un cajero para el selector
type Cashier struct {
	ID       string `json:"id"`
	FullName string `json:"full_name"`
	Role     string `json:"role"`
}

// GetActiveCashiers retorna la lista de usuarios activos con rol CAJERO o SUPERVISOR
// Solo se usa para poblar el selector del panel de reportes
func GetActiveCashiers(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := `
			SELECT u.id, u.full_name, r.name AS role
			FROM users u
			JOIN roles r ON u.role_id = r.id
			WHERE u.is_active = TRUE
			AND r.name IN ('CAJERO', 'SUPERVISOR')
			ORDER BY u.full_name ASC
		`

		rows, err := pool.Query(r.Context(), query)
		if err != nil {
			response.Error(w, "Error al consultar cajeros", http.StatusInternalServerError, http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var cashiers []Cashier
		for rows.Next() {
			var c Cashier
			if err := rows.Scan(&c.ID, &c.FullName, &c.Role); err != nil {
				response.Error(w, "Error al procesar cajeros", http.StatusInternalServerError, http.StatusInternalServerError)
				return
			}
			cashiers = append(cashiers, c)
		}

		// Si no hay cajeros, retornamos array vacío (no null)
		if cashiers == nil {
			cashiers = []Cashier{}
		}

		response.Success(w, cashiers, http.StatusOK)
	}
}