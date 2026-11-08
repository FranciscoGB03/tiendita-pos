package repositories

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type DailySummary struct {
	Date               string  `json:"date"`
	TotalVentas        int     `json:"total_ventas"`
	TotalBruto         float64 `json:"total_bruto"`
	TotalNeto          float64 `json:"total_neto"`
	CostoTotal         float64 `json:"costo_total"`
	GananciaNeta       float64 `json:"ganancia_neta"`
	TotalEfectivo      float64 `json:"total_efectivo"`
	TotalTarjeta       float64 `json:"total_tarjeta"`
	ComisionesTerminal float64 `json:"comisiones_terminal"`
}

type ReportRepository struct {
	pool *pgxpool.Pool
}

func NewReportRepository(pool *pgxpool.Pool) *ReportRepository {
	return &ReportRepository{pool: pool}
}

func (r *ReportRepository) GetDailySummary(ctx context.Context, terminalID *string) (*DailySummary, error) {
	// Usamos CTEs para evitar duplicación de filas al hacer JOIN de items y pagos
	query := `
		WITH daily_sales AS (
			SELECT id, total_bruto, total_neto
			FROM sales
			WHERE DATE(created_at) = CURRENT_DATE 
			  AND status = 'COMPLETED'
			  AND ($1::text IS NULL OR terminal_id = $1)
		),
		sale_costs AS (
			SELECT si.sale_id, SUM(si.quantity * p.cost_price) as cost
			FROM sale_items si
			JOIN products p ON si.product_id = p.id
			GROUP BY si.sale_id
		),
		sale_payments_agg AS (
			SELECT sale_id,
				   COALESCE(SUM(amount) FILTER (WHERE payment_method = 'EFECTIVO'), 0) as total_efectivo,
				   COALESCE(SUM(amount) FILTER (WHERE payment_method = 'TARJETA'), 0) as total_tarjeta,
				   COALESCE(SUM(terminal_commission), 0) as comisiones
			FROM sale_payments
			GROUP BY sale_id
		)
		SELECT 
			COUNT(ds.id) as total_ventas,
			COALESCE(SUM(ds.total_bruto), 0) as total_bruto,
			COALESCE(SUM(ds.total_neto), 0) as total_neto,
			COALESCE(SUM(sc.cost), 0) as costo_total,
			COALESCE(SUM(spa.total_efectivo), 0) as total_efectivo,
			COALESCE(SUM(spa.total_tarjeta), 0) as total_tarjeta,
			COALESCE(SUM(spa.comisiones), 0) as comisiones_terminal
		FROM daily_sales ds
		LEFT JOIN sale_costs sc ON ds.id = sc.sale_id
		LEFT JOIN sale_payments_agg spa ON ds.id = spa.sale_id
	`

	var summary DailySummary
	err := r.pool.QueryRow(ctx, query, terminalID).Scan(
		&summary.TotalVentas,
		&summary.TotalBruto,
		&summary.TotalNeto,
		&summary.CostoTotal,
		&summary.TotalEfectivo,
		&summary.TotalTarjeta,
		&summary.ComisionesTerminal,
	)

	if err != nil {
		return nil, fmt.Errorf("error al obtener resumen diario: %w", err)
	}

	// Calcular ganancia neta en memoria: (Total Neto - Costo Total)
	summary.GananciaNeta = summary.TotalNeto - summary.CostoTotal
	summary.Date = time.Now().Format("2006-01-02")

	return &summary, nil
}