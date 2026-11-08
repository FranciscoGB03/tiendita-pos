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

	// Ruta protegida: requiere JWT válido y permiso 'sales.create'
	mux.Handle("POST /api/sales", middleware.Auth(jwtSecret, middleware.RequirePermission("sales.create", http.HandlerFunc(saleHandler.CreateSale))))

	// ==========================================
	// 5. Reportes (Protegidos)
	// ==========================================
	
	// Requiere JWT válido Y permiso 'cashier.daily_report'
	mux.Handle("GET /api/reports/daily-summary", 
		middleware.Auth(jwtSecret, 
			middleware.RequirePermission("cashier.daily_report", 
				http.HandlerFunc(reportHandler.GetDailySummary),
			),
		),
	)

	return middleware.SecurityHeaders(mux)
}