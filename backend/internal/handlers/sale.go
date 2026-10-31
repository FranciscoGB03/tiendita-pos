package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/pgonbo/tiendita-pos/backend/internal/models"
	"github.com/pgonbo/tiendita-pos/backend/internal/response"
	"github.com/pgonbo/tiendita-pos/backend/internal/services"
)

type SaleHandler struct {
	saleService *services.SaleService
}

// NewSaleHandler crea una nueva instancia del handler de ventas
func NewSaleHandler(saleService *services.SaleService) *SaleHandler {
	return &SaleHandler{saleService: saleService}
}

// CreateSale maneja la petición POST /api/sales
func (h *SaleHandler) CreateSale(w http.ResponseWriter, r *http.Request) {
	// 1. Validar método HTTP
	if r.Method != http.MethodPost {
		response.Error(w, "Método no permitido", http.StatusMethodNotAllowed, http.StatusMethodNotAllowed)
		return
	}

	// 2. Decodificar el cuerpo de la petición
	var req models.SaleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, "Cuerpo de la petición inválido", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 3. Validación manual de campos obligatorios
	if req.TerminalID == "" {
		response.Error(w, "El terminal_id es obligatorio", http.StatusBadRequest, http.StatusBadRequest)
		return
	}
	if len(req.Items) == 0 {
		response.Error(w, "La venta debe tener al menos un producto", http.StatusBadRequest, http.StatusBadRequest)
		return
	}
	if len(req.Payments) == 0 {
		response.Error(w, "La venta debe tener al menos un pago", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 4. Validar items y calcular total de productos
	var totalItems float64
	for i, item := range req.Items {
		if item.Quantity <= 0 {
			response.Error(w, fmt.Sprintf("La cantidad del producto %d debe ser mayor a 0", i+1), http.StatusBadRequest, http.StatusBadRequest)
			return
		}
		if item.UnitPriceAtSale < 0 {
			response.Error(w, fmt.Sprintf("El precio del producto %d no puede ser negativo", i+1), http.StatusBadRequest, http.StatusBadRequest)
			return
		}
		totalItems += float64(item.Quantity) * item.UnitPriceAtSale
	}

	// 5. Validar pagos y calcular total pagado
	var totalPayments float64
	for i, payment := range req.Payments {
		if payment.Amount <= 0 {
			response.Error(w, fmt.Sprintf("El monto del pago %d debe ser mayor a 0", i+1), http.StatusBadRequest, http.StatusBadRequest)
			return
		}
		if payment.PaymentMethod != "EFECTIVO" && payment.PaymentMethod != "TARJETA" {
			response.Error(w, fmt.Sprintf("Método de pago %d inválido (debe ser EFECTIVO o TARJETA)", i+1), http.StatusBadRequest, http.StatusBadRequest)
			return
		}
		totalPayments += payment.Amount
	}

	// 6. Validar que los pagos cubran exactamente el total de los items (con tolerancia mínima por floats)
	if totalPayments < totalItems-0.01 || totalPayments > totalItems+0.01 {
		response.Error(w, "El total de los pagos no coincide con el total de los productos", http.StatusBadRequest, http.StatusBadRequest)
		return
	}

	// 7. Ejecutar la lógica atómica a través del Service
	res, err := h.saleService.CreateSale(r.Context(), &req)
	if err != nil {
		response.Error(w, "Error al procesar la venta: "+err.Error(), http.StatusInternalServerError, http.StatusInternalServerError)
		return
	}

	// 8. Retornar éxito (201 Created)
	response.Success(w, res, http.StatusCreated)
}