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
	// 2. Autenticación
	// ==========================================
	userRepo := repositories.NewUserRepository(pool)
	authService := services.NewAuthService(userRepo, jwtSecret)
	authHandler := handlers.NewAuthHandler(authService)
	
	mux.HandleFunc("POST /api/login", authHandler.Login)

	// ==========================================
	// 3. Productos (y futuras rutas)
	// ==========================================
	// Asumiendo que GetProducts devuelve un http.HandlerFunc o se adapta a la firma de Go 1.22+
	mux.HandleFunc("GET /api/products", func(w http.ResponseWriter, r *http.Request) {
		handlers.GetProducts(pool)(w, r)
	})

	// NOTA: Cuando agreguemos ventas, reportes, etc., se registran aquí.
	// Ejemplo futuro: 
	// salesHandler := handlers.NewSalesHandler(services.NewSalesService(repositories.NewSalesRepository(pool)))
	// mux.Handle("POST /api/sales", middleware.Auth(jwtSecret, middleware.RequirePermission("sales.create", salesHandler.Create)))

	return middleware.SecurityHeaders(mux)
}