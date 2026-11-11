// backend/internal/repositories/cash_cut_repository.go
package repositories

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pgonbo/tiendita-pos/backend/internal/models"
)

type CashCutRepository struct {
	pool *pgxpool.Pool
}

func NewCashCutRepository(pool *pgxpool.Pool) *CashCutRepository {
	return &CashCutRepository{pool: pool}
}

// GetTurnSummary calcula el resumen del turno de un cajero en una caja específica.
// Cuenta las ventas desde el último corte de ese cajero en esa caja (o desde las 00:00 si no hay cortes previos).
func (r *CashCutRepository) GetTurnSummary(ctx context.Context, cashierID uuid.UUID, terminalID string) (*models.TurnSummary, error) {
	// 1. Leer fondo fijo desde settings
	var initialFund float64
	err := r.pool.QueryRow(ctx,
		"SELECT value::numeric FROM settings WHERE key = 'initial_cash_fund'",
	).Scan(&initialFund)
	if err != nil {
		if err == pgx.ErrNoRows {
			initialFund = 500.0 // Fallback seguro si no existe el setting
		} else {
			return nil, fmt.Errorf("error al leer fondo fijo: %w", err)
		}
	}

	// 2. Buscar último corte de ese cajero en esa caja
	var lastCutDatetime *time.Time
	err = r.pool.QueryRow(ctx,
		"SELECT MAX(cut_datetime) FROM cash_cuts WHERE cashier_id = $1 AND terminal_id = $2",
		cashierID, terminalID,
	).Scan(&lastCutDatetime)
	if err != nil {
		return nil, fmt.Errorf("error al buscar último corte: %w", err)
	}

	// 3. Determinar desde cuándo contar las ventas
	var sinceTime time.Time
	if lastCutDatetime != nil {
		sinceTime = *lastCutDatetime
	} else {
		// Si no hay cortes previos, contar desde las 00:00 de hoy
		sinceTime = time.Now().Truncate(24 * time.Hour)
	}

	// 4. Calcular ventas del turno
	var totalCashExpected, totalCardNeto, totalSales float64
	query := `
		SELECT 
			COALESCE(SUM(sp.amount) FILTER (WHERE sp.payment_method = 'EFECTIVO'), 0),
			COALESCE(SUM(sp.amount) FILTER (WHERE sp.payment_method = 'TARJETA'), 0),
			COALESCE(SUM(sp.amount), 0)
		FROM sales s
		JOIN sale_payments sp ON s.id = sp.sale_id
		WHERE s.cashier_id = $1
		  AND s.terminal_id = $2
		  AND s.status = 'COMPLETED'
		  AND s.created_at > $3
	`
	err = r.pool.QueryRow(ctx, query, cashierID, terminalID, sinceTime).Scan(
		&totalCashExpected, &totalCardNeto, &totalSales,
	)
	if err != nil {
		return nil, fmt.Errorf("error al calcular ventas del turno: %w", err)
	}

	return &models.TurnSummary{
		CashierID:         cashierID,
		TerminalID:        terminalID,
		InitialFund:       initialFund,
		TotalCashExpected: totalCashExpected,
		TotalCardNeto:     totalCardNeto,
		TotalSales:        totalSales,
		ExpectedTotal:     initialFund + totalCashExpected,
		LastCutDatetime:   lastCutDatetime,
	}, nil
}

// CreateCashCut registra un nuevo corte de caja en la base de datos.
func (r *CashCutRepository) CreateCashCut(ctx context.Context, req *models.CashCutRequest, summary *models.TurnSummary, createdBy uuid.UUID) (*models.CashCutResponse, error) {
	// 1. Calcular diferencia
	cashDifference := req.ActualCash - summary.ExpectedTotal

	// 2. Insertar corte
	cutID := uuid.New()
	query := `
		INSERT INTO cash_cuts (
			id, cashier_id, terminal_id, cut_datetime, initial_fund,
			total_cash_expected, total_card_neto, total_sales,
			actual_cash, cash_difference, status, notes, created_by
		) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7, $8, $9, 'COMPLETED', $10, $11)
		RETURNING id, cut_datetime, created_at
	`
	var cutDatetime, createdAt time.Time
	err := r.pool.QueryRow(ctx, query,
		cutID, req.CashierID, req.TerminalID,
		summary.InitialFund, summary.TotalCashExpected, summary.TotalCardNeto, summary.TotalSales,
		req.ActualCash, cashDifference, req.Notes, createdBy,
	).Scan(&cutID, &cutDatetime, &createdAt)
	if err != nil {
		return nil, fmt.Errorf("error al registrar corte de caja: %w", err)
	}

	return &models.CashCutResponse{
		ID:                cutID,
		CashierID:         uuid.MustParse(req.CashierID),
		TerminalID:        req.TerminalID,
		CutDatetime:       cutDatetime,
		InitialFund:       summary.InitialFund,
		TotalCashExpected: summary.TotalCashExpected,
		TotalCardNeto:     summary.TotalCardNeto,
		TotalSales:        summary.TotalSales,
		ActualCash:        req.ActualCash,
		CashDifference:    cashDifference,
		Status:            "COMPLETED",
		CreatedAt:         createdAt,
		CreatedBy:         createdBy,
	}, nil
}