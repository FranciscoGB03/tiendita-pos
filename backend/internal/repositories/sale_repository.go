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

type SaleRepository struct {
	pool *pgxpool.Pool
}

// NewSaleRepository crea una nueva instancia del repositorio de ventas
func NewSaleRepository(pool *pgxpool.Pool) *SaleRepository {
	return &SaleRepository{pool: pool}
}

// CreateSale registra una venta completa de manera atómica (venta, items, pagos e inventario)
func (r *SaleRepository) CreateSale(ctx context.Context, req *models.SaleRequest) (*models.SaleResponse, error) {
	// 1. Iniciar transacción
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("error al iniciar transacción: %w", err)
	}
	defer tx.Rollback(ctx)

	// 2. Obtener la tasa de comisión de tarjeta desde la tabla settings
	var cardCommissionRate float64
	querySettings := `SELECT value::numeric FROM settings WHERE key = 'card_commission_rate'`
	err = tx.QueryRow(ctx, querySettings).Scan(&cardCommissionRate)
	if err != nil {
		if err == pgx.ErrNoRows {
			// Fallback seguro si no existe el setting (evita romper la venta)
			cardCommissionRate = 0.041
		} else {
			return nil, fmt.Errorf("error al leer configuración de comisión: %w", err)
		}
	}

	// 3. Calcular totales
	var totalBruto float64
	var totalComision float64

	for _, item := range req.Items {
		totalBruto += float64(item.Quantity) * item.UnitPriceAtSale
	}

	for _, payment := range req.Payments {
		if payment.PaymentMethod == "TARJETA" {
			totalComision += payment.Amount * cardCommissionRate
		}
	}
	totalNeto := totalBruto - totalComision

	// 4. Insertar registro en `sales`
	saleID := uuid.New()
	querySale := `
		INSERT INTO sales (id, terminal_id, total_bruto, total_neto, status) 
		VALUES ($1, $2, $3, $4, 'COMPLETED') 
		RETURNING id, created_at`
	
	var createdAt time.Time
	err = tx.QueryRow(ctx, querySale, saleID, req.TerminalID, totalBruto, totalNeto).Scan(&saleID, &createdAt)
	if err != nil {
		return nil, fmt.Errorf("error al insertar venta: %w", err)
	}

	// 5. Insertar items, actualizar inventario y registrar movimiento
	queryItem := `
		INSERT INTO sale_items (id, sale_id, product_id, quantity, unit_price_at_sale) 
		VALUES ($1, $2, $3, $4, $5)`
	
	queryUpdateStock := `
		UPDATE products 
		SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP 
		WHERE id = $2`
	
	queryInventoryMov := `
		INSERT INTO inventory_movements (id, product_id, movement_type, quantity, reference_id, notes) 
		VALUES ($1, $2, 'SALE', $3, $4, 'Venta registrada en caja')`

	for _, item := range req.Items {
		itemID := uuid.New()
		
		_, err = tx.Exec(ctx, queryItem, itemID, saleID, item.ProductID, item.Quantity, item.UnitPriceAtSale)
		if err != nil {
			return nil, fmt.Errorf("error al insertar item de venta: %w", err)
		}

		_, err = tx.Exec(ctx, queryUpdateStock, item.Quantity, item.ProductID)
		if err != nil {
			return nil, fmt.Errorf("error al actualizar stock del producto %s: %w", item.ProductID, err)
		}

		movID := uuid.New()
		_, err = tx.Exec(ctx, queryInventoryMov, movID, item.ProductID, -item.Quantity, saleID)
		if err != nil {
			return nil, fmt.Errorf("error al registrar movimiento de inventario: %w", err)
		}
	}

	// 6. Insertar pagos
	queryPayment := `
		INSERT INTO sale_payments (id, sale_id, payment_method, amount, terminal_commission) 
		VALUES ($1, $2, $3, $4, $5)`

	for _, payment := range req.Payments {
		paymentID := uuid.New()
		commission := 0.0
		if payment.PaymentMethod == "TARJETA" {
			commission = payment.Amount * cardCommissionRate
		}

		_, err = tx.Exec(ctx, queryPayment, paymentID, saleID, payment.PaymentMethod, payment.Amount, commission)
		if err != nil {
			return nil, fmt.Errorf("error al insertar pago: %w", err)
		}
	}

	// 7. Confirmar transacción
	err = tx.Commit(ctx)
	if err != nil {
		return nil, fmt.Errorf("error al confirmar transacción: %w", err)
	}

	return &models.SaleResponse{
		ID:         saleID,
		TotalBruto: totalBruto,
		TotalNeto:  totalNeto,
		Status:     "COMPLETED",
		CreatedAt:  createdAt,
	}, nil
}