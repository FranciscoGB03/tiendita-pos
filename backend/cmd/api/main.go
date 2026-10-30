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
	"github.com/pgonbo/tiendita-pos/backend/internal/middleware"
	"github.com/pgonbo/tiendita-pos/backend/internal/router"
)

func main() {
	// 1. Cargar configuración (incluye JWT_SECRET)
	cfg := config.Load()

	// 2. Inicializar base de datos
	if err := database.Init(cfg); err != nil {
		log.Fatalf("❌ Error al conectar con la base de datos: %v", err)
	}
	defer database.Close()

	// 3. Configurar rutas (centralizado en el paquete router)
	appRouter := router.Setup(database.Pool, cfg.JWTSecret)

	// 4. Aplicar middleware CORS global
	handler := middleware.CORS(appRouter)

	// 5. Levantar servidor
	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	server := &http.Server{
		Addr:    addr,
		Handler: handler,
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