// backend/internal/handlers/cash_cut.go
package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/pgonbo/tiendita-pos/backend/internal/middleware"
	"github.com/pgonbo/tiendita-pos/backend/internal/models"
	"github.com/pgonbo/tiendita-pos/backend/internal/repositories"
	"github.com/pgonbo/tiendita-pos/backend/internal/response"
)

type CashCutHandler struct {
	cashCutRepo *repositories.CashCutRepository
}

func NewCashCutHandler(cashCutRepo *repositories.CashCutRepository) *CashCutHandler {
	return &CashCutHandler{cashCutRepo: cashCutRepo}
}

// GetTurnSummary retorna el resumen del turno de un cajero en una caja específica.
// GET /api/cash-cuts/summary?cashier_id=X&terminal_id=Y
func (h *CashCutHandler) GetTurnSummary(w http.ResponseWriter, r *http.Request) {
	// 1. Validar método HTTP
	if r.Method != http.MethodGet {
		response.Error(w, "Método no permitido", http.StatusMethodNotAllowed, http.StatusMethodNotAllowed)
		return
	}

	// 2. Extraer query params
	cashierIDStr := r.URL.Query().Get("cashier_id")
	terminalID := r.URL.Query().Get("terminal_id")

	// 3. Validar campos obligatorios
	if cashierIDStr == "" {
		response.Error(w, "cashier_id es obligatorio", http.StatusBadRequest, http.StatusBadRequest)
		return
	}
	if terminalID == "" {
		response.Error(w, "terminal_id es obligatorio", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 4. Validar que cashier_id sea un UUID válido
	cashierID, err := uuid.Parse(cashierIDStr)
	if err != nil {
		response.Error(w, "cashier_id inválido (debe ser UUID)", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 5. Calcular resumen del turno
	summary, err := h.cashCutRepo.GetTurnSummary(r.Context(), cashierID, terminalID)
	if err != nil {
		response.Error(w, "Error al calcular resumen del turno: "+err.Error(), http.StatusInternalServerError, http.StatusInternalServerError)
		return
	}

	response.Success(w, summary, http.StatusOK)
}

// CreateCashCut registra un nuevo corte de caja.
// POST /api/cash-cuts
func (h *CashCutHandler) CreateCashCut(w http.ResponseWriter, r *http.Request) {
	// 1. Validar método HTTP
	if r.Method != http.MethodPost {
		response.Error(w, "Método no permitido", http.StatusMethodNotAllowed, http.StatusMethodNotAllowed)
		return
	}

	// 2. Extraer created_by del JWT (el supervisor que está contando)
	claims := middleware.GetClaimsFromContext(r)
	if claims == nil {
		response.Error(w, "No autorizado", http.StatusUnauthorized, http.StatusUnauthorized)
		return
	}
	createdByStr, ok := claims["user_id"].(string)
	if !ok || createdByStr == "" {
		response.Error(w, "No se pudo identificar al usuario", http.StatusInternalServerError, http.StatusInternalServerError)
		return
	}
	createdBy, err := uuid.Parse(createdByStr)
	if err != nil {
		response.Error(w, "Error interno: user_id inválido en JWT", http.StatusInternalServerError, http.StatusInternalServerError)
		return
	}

	// 3. Decodificar el cuerpo de la petición
	var req models.CashCutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, "Cuerpo de la petición inválido", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 4. Validar campos obligatorios
	if req.CashierID == "" {
		response.Error(w, "cashier_id es obligatorio", http.StatusBadRequest, http.StatusBadRequest)
		return
	}
	if req.TerminalID == "" {
		response.Error(w, "terminal_id es obligatorio", http.StatusBadRequest, http.StatusBadRequest)
		return
	}
	if req.ActualCash < 0 {
		response.Error(w, "actual_cash no puede ser negativo", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 5. Validar que cashier_id sea un UUID válido
	cashierID, err := uuid.Parse(req.CashierID)
	if err != nil {
		response.Error(w, "cashier_id inválido (debe ser UUID)", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 6. Calcular resumen del turno (para obtener el esperado)
	summary, err := h.cashCutRepo.GetTurnSummary(r.Context(), cashierID, req.TerminalID)
	if err != nil {
		response.Error(w, "Error al calcular resumen del turno: "+err.Error(), http.StatusInternalServerError, http.StatusInternalServerError)
		return
	}

	// 7. Crear el corte
	cut, err := h.cashCutRepo.CreateCashCut(r.Context(), &req, summary, createdBy)
	if err != nil {
		response.Error(w, "Error al registrar corte de caja: "+err.Error(), http.StatusInternalServerError, http.StatusInternalServerError)
		return
	}

	response.Success(w, cut, http.StatusCreated)
}