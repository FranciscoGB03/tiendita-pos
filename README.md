# Tiendita POS

Sistema de Punto de Venta (POS) offline-first para la tiendita familiar.

## Stack
- **Backend:** Go 1.23+
- **Frontend:** React 18 + Vite + TypeScript + Tailwind + Dexie.js
- **Base de Datos:** PostgreSQL 16 (Docker)

## Requisitos
- Docker & Docker Compose
- Go 1.23+
- Node.js 20+ & pnpm

## Inicio Rápido (Base de Datos)
1. Copia el archivo de entorno: `cp .env.example .env`
2. Edita `.env` con tus credenciales.
3. Levanta la base de datos: `docker compose -f infra/docker-compose.yml up -d`