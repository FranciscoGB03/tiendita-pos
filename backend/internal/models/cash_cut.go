// backend/internal/models/cash_cut.go
package models

import (
	"time"

	"github.com/google/uuid"
)

// CashCutRequest representa la petición que envía el frontend para registrar un corte de caja.
// Nota: created_by se inyecta desde el JWT en el handler (no confiamos en el frontend).
type CashCutRequest struct {
	CashierID  string  `json:"cashier_id"`  // Dueño del turno (mamá/papá)
	TerminalID string  `json:"terminal_id"` // Caja donde trabajó
	ActualCash float64 `json:"actual_cash"` // Efectivo contado físicamente
	Notes      string  `json:"notes"`       // Observaciones opcionales
}

// CashCutResponse representa la respuesta exitosa tras crear un corte
type CashCutResponse struct {
	ID                uuid.UUID `json:"id"`
	CashierID         uuid.UUID `json:"cashier_id"`
	TerminalID        string    `json:"terminal_id"`
	CutDatetime       time.Time `json:"cut_datetime"`
	InitialFund       float64   `json:"initial_fund"`
	TotalCashExpected float64   `json:"total_cash_expected"`
	TotalCardNeto     float64   `json:"total_card_neto"`
	TotalSales        float64   `json:"total_sales"`
	ActualCash        float64   `json:"actual_cash"`
	CashDifference    float64   `json:"cash_difference"`
	Status            string    `json:"status"`
	CreatedAt         time.Time `json:"created_at"`
	CreatedBy         uuid.UUID `json:"created_by"`
}

// TurnSummary representa el resumen calculado del turno ANTES de hacer el corte.
// Se usa para mostrar al supervisor cuánto debería haber en caja antes de contar.
type TurnSummary struct {
	CashierID         uuid.UUID `json:"cashier_id"`
	TerminalID        string    `json:"terminal_id"`
	InitialFund       float64   `json:"initial_fund"`
	TotalCashExpected float64   `json:"total_cash_expected"` // Ventas en efectivo del cajero desde último corte
	TotalCardNeto     float64   `json:"total_card_neto"`     // Ventas en tarjeta del cajero (informativo)
	TotalSales        float64   `json:"total_sales"`         // Total de ventas del cajero
	ExpectedTotal     float64   `json:"expected_total"`      // initial_fund + total_cash_expected
	LastCutDatetime   *time.Time `json:"last_cut_datetime"`  // nil si es el primer corte del día
}