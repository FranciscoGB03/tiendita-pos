package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	ServerPort string
}

func Load() *Config {
	// Cargar .env desde infra (relative a backend/)
	envPath := filepath.Join("..", "infra", ".env")
	if err := godotenv.Load(envPath); err != nil {
		log.Printf("⚠️ No se pudo cargar el archivo .env en %s. Asegúrate de que exista.", envPath)
	}

	cfg := &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("POSTGRES_PORT", "5432"),
		DBUser:     getEnv("POSTGRES_USER", ""),
		DBPassword: getEnv("POSTGRES_PASSWORD", ""),
		DBName:     getEnv("POSTGRES_DB", "tiendita_db"),
		ServerPort: getEnv("SERVER_PORT", "8080"),
	}

	// Validación de seguridad
	if cfg.DBUser == "" || cfg.DBPassword == "" {
		log.Fatal("❌ ERROR DE SEGURIDAD: POSTGRES_USER y POSTGRES_PASSWORD son obligatorios en infra/.env")
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}