package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/pgonbo/tiendita-pos/backend/internal/config"
	"github.com/pgonbo/tiendita-pos/backend/internal/database"
	"github.com/pgonbo/tiendita-pos/backend/internal/handlers"
	"github.com/pgonbo/tiendita-pos/backend/internal/middleware" // ← Agregar esta línea
)

func main() {
	// 1. Cargar configuración
	cfg := config.Load()

	// 2. Inicializar base de datos
	if err := database.Init(cfg); err != nil {
		log.Fatalf("❌ Error al conectar con la base de datos: %v", err)
	}
	defer database.Close()

	// 3. Configurar router (Go 1.22+ routing)
	mux := http.NewServeMux()

	// Ruta de prueba
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "ok", "service": "tiendita-pos-api"}`))
	})
	
	// Ruta de productos (inyectamos el pool de la base de datos)
	mux.HandleFunc("GET /api/products", handlers.GetProducts(database.Pool))

	// 4. Aplicar middleware CORS y levantar servidor
	handler := middleware.CORS(mux) // ← Envolver el mux con CORS

	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	server := &http.Server{
		Addr:    addr,
		Handler: handler, // ← Usar el handler con CORS
	}

	// Goroutine para shutdown graceful
	go func() {
		log.Printf("🚀 Servidor corriendo en http://localhost%s", addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("❌ Error al levantar el servidor: %v", err)
		}
	}()

	// Esperar señal de interrupción (Ctrl+C)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("⏳ Apagando servidor...")

	// Timeout de 5 segundos para shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("❌ Error al apagar el servidor: %v", err)
	}

	log.Println("✅ Servidor detenido correctamente")
}