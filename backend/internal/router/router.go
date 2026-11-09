// backend/internal/router/router.go
package router

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pgonbo/tiendita-pos/backend/internal/handlers"
	"github.com/pgonbo/tiendita-pos/backend/internal/middleware"
	"github.com/pgonbo/tiendita-pos/backend/internal/repositories"
	"github.com/pgonbo/tiendita-pos/backend/internal/services"
)

// Setup configura todas las rutas de la aplicación e inyecta las dependencias necesarias.
func Setup(pool *pgxpool.Pool, jwtSecret string) http.Handler {
	mux := http.NewServeMux()

	// ==========================================
	// 1. Rutas Públicas / Salud
	// ==========================================
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "ok", "service": "tiendita-pos-api"}`))
	})

	// ==========================================
	// Repositorios y Handlers
	// ==========================================
	userRepo := repositories.NewUserRepository(pool)
	authService := services.NewAuthService(userRepo, jwtSecret)
	authHandler := handlers.NewAuthHandler(authService)

	reportRepo := repositories.NewReportRepository(pool)
	reportHandler := handlers.NewReportHandler(reportRepo)

	// ==========================================
	// 2. Autenticación
	// ==========================================
	mux.HandleFunc("POST /api/login", authHandler.Login)

	// ==========================================
	// 3. Productos y Terminales
	// ==========================================
	mux.HandleFunc("GET /api/products", func(w http.ResponseWriter, r *http.Request) {
		handlers.GetProducts(pool)(w, r)
	})
	mux.HandleFunc("GET /api/terminals/validate", handlers.ValidateTerminal(pool))

	// ==========================================
	// 4. Ventas (Protegidas)
	// ==========================================
	saleRepo := repositories.NewSaleRepository(pool)
	saleService := services.NewSaleService(saleRepo)
	saleHandler := handlers.NewSaleHandler(saleService)

	mux.Handle("POST /api/sales",
		middleware.Auth(jwtSecret,
			middleware.RequirePermission("sales.create",
				http.HandlerFunc(saleHandler.CreateSale),
			),
		),
	)

	// ==========================================
	// 5. Reportes (Protegidos)
	// ==========================================
	mux.Handle("GET /api/reports/daily-summary",
		middleware.Auth(jwtSecret,
			middleware.RequirePermission("cashier.daily_report",
				http.HandlerFunc(reportHandler.GetDailySummary),
			),
		),
	)

	// ==========================================
	// 6. 🆕 Lista de Cajeros (Protegido)
	// ==========================================
	// Solo usuarios con permiso 'users.view' pueden ver la lista de cajeros
	// (SUPERVISOR y ADMIN tienen este permiso por defecto)
	mux.Handle("GET /api/users/cashiers",
		middleware.Auth(jwtSecret,
			middleware.RequirePermission("users.view",
				http.HandlerFunc(handlers.GetActiveCashiers(pool)),
			),
		),
	)

	return middleware.SecurityHeaders(mux)
}