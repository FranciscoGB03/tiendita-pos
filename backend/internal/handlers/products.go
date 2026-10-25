package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Product struct {
	ID                string    `json:"id"`
	Name              string    `json:"name"`
	CostPrice         float64   `json:"cost_price"`
	SalePrice         float64   `json:"sale_price"`
	StockQuantity     int       `json:"stock_quantity"`
	LowStockThreshold int       `json:"low_stock_threshold"`
	ImageURL          string    `json:"image_url"`
	IsActive          bool      `json:"is_active"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

func GetProducts(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := `SELECT id, name, cost_price, sale_price, stock_quantity, 
		               low_stock_threshold, image_url, is_active, created_at, updated_at 
		           FROM products WHERE is_active = true ORDER BY name ASC`

		rows, err := pool.Query(r.Context(), query)
		if err != nil {
			http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var products []Product
		for rows.Next() {
			var p Product
			err := rows.Scan(
				&p.ID, &p.Name, &p.CostPrice, &p.SalePrice, 
				&p.StockQuantity, &p.LowStockThreshold, 
				&p.ImageURL, &p.IsActive, &p.CreatedAt, &p.UpdatedAt,
			)
			if err != nil {
				http.Error(w, "Error al procesar los productos", http.StatusInternalServerError)
				return
			}
			products = append(products, p)
		}

		if products == nil {
			products = []Product{}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(products)
	}
}