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
// @Tags reports
// @Accept json
// @Produce json
// @Param terminal_id query string false "ID de la caja (opcional, para filtrar)"
// @Success 200 {object} repositories.DailySummary
// @Router /api/reports/daily-summary [get]
func (h *ReportHandler) GetDailySummary(w http.ResponseWriter, r *http.Request) {
	// CORRECCIÓN: Pasar 'r' en lugar de 'r.Context()'
	claims := middleware.GetClaimsFromContext(r)
	if claims == nil {
		response.Error(w, "No autorizado", http.StatusUnauthorized, http.StatusUnauthorized)
		return
	}

	// Obtener terminal_id de los query params (opcional)
	terminalID := r.URL.Query().Get("terminal_id")
	var termPtr *string
	if terminalID != "" {
		termPtr = &terminalID
	}

	summary, err := h.reportRepo.GetDailySummary(r.Context(), termPtr)
	if err != nil {
		response.Error(w, "Error interno al generar el reporte", http.StatusInternalServerError, http.StatusInternalServerError)
		return
	}

	response.Success(w, summary, http.StatusOK)
}