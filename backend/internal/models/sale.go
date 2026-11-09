// backend/internal/models/sale.go
package models

import (
	"time"

	"github.com/google/uuid"
)

// SaleRequest representa la petición que envía el frontend para registrar una venta
type SaleRequest struct {
	TerminalID string               `json:"terminal_id"`
	CashierID  string               `json:"-"`
	Items      []SaleItemRequest    `json:"items"`
	Payments   []SalePaymentRequest `json:"payments"`
}

// SaleItemRequest representa un producto dentro de la venta
type SaleItemRequest struct {
	ProductID       uuid.UUID `json:"product_id"`
	Quantity        int       `json:"quantity"`
	UnitPriceAtSale float64   `json:"unit_price_at_sale"`
}

// SalePaymentRequest representa un pago aplicado a la venta
type SalePaymentRequest struct {
	PaymentMethod string  `json:"payment_method"` // "EFECTIVO" o "TARJETA"
	Amount        float64 `json:"amount"`
}

// SaleResponse representa la respuesta exitosa tras crear la venta
type SaleResponse struct {
	ID         uuid.UUID `json:"id"`
	TotalBruto float64   `json:"total_bruto"`
	TotalNeto  float64   `json:"total_neto"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
}