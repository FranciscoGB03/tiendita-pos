// backend/internal/handlers/report.go
package handlers

import (
	"net/http"

	"github.com/pgonbo/tiendita-pos/backend/internal/middleware"
	"github.com/pgonbo/tiendita-pos/backend/internal/repositories"
	"github.com/pgonbo/tiendita-pos/backend/internal/response"
)

type ReportHandler struct {
	reportRepo *repositories.ReportRepository
}

func NewReportHandler(reportRepo *repositories.ReportRepository) *ReportHandler {
	return &ReportHandler{reportRepo: reportRepo}
}

// GetDailySummary godoc
// @Summary Obtiene el resumen diario de ventas
// @Description Retorna totales, comisiones y ganancia neta del día actual.
// Soporta filtros opcionales por terminal_id y cashier_id.
// @Tags reports
// @Accept json
// @Produce json
// @Param terminal_id query string false "ID de la caja (opcional)"
// @Param cashier_id query string false "ID del cajero (opcional)"
// @Success 200 {object} repositories.DailySummary
// @Router /api/reports/daily-summary [get]
func (h *ReportHandler) GetDailySummary(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetClaimsFromContext(r)
	if claims == nil {
		response.Error(w, "No autorizado", http.StatusUnauthorized, http.StatusUnauthorized)
		return
	}

	// 1. Extraer el user_id del JWT (el cajero autenticado)
	authUserID, _ := claims["user_id"].(string)
	if authUserID == "" {
		response.Error(w, "No se pudo identificar al usuario", http.StatusUnauthorized, http.StatusUnauthorized)
		return
	}

	// 2. Extraer el rol del usuario autenticado
	userRole, _ := claims["role"].(string)

	// 3. Leer query params opcionales
	terminalID := r.URL.Query().Get("terminal_id")
	cashierID := r.URL.Query().Get("cashier_id") // 🆕

	// 4. 🔒 Seguridad RBAC: Un cajero SOLO puede ver SU propio reporte
	// Si el rol es CAJERO y pidió cashier_id diferente al suyo, rechazamos
	if userRole == "CAJERO" {
		if cashierID != "" && cashierID != authUserID {
			response.Error(w, "No tienes permiso para ver reportes de otros cajeros", http.StatusForbidden, http.StatusForbidden)
			return
		}
		// Forzamos el filtro a su propio user_id (aunque no lo haya enviado)
		cashierID = authUserID
	}

	// 5. Convertir strings vacíos a nil (para el patrón $X IS NULL)
	var termPtr *string
	if terminalID != "" {
		termPtr = &terminalID
	}
	var cashierPtr *string // 🆕
	if cashierID != "" {
		cashierPtr = &cashierID
	}

	// 6. Ejecutar la consulta con ambos filtros
	summary, err := h.reportRepo.GetDailySummary(r.Context(), termPtr, cashierPtr)
	if err != nil {
		response.Error(w, "Error interno al generar el reporte", http.StatusInternalServerError, http.StatusInternalServerError)
		return
	}

	response.Success(w, summary, http.StatusOK)
}