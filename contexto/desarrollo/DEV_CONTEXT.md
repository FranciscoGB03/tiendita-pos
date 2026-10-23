# 🛠️ Contexto de Desarrollo (DEV_CONTEXT)
**Fecha de última actualización:** 23 de Octubre de 2026
**Fase actual:** Desarrollo Activo - Sprint 1
**Sprint en curso:** Sprint 1 - Fundación
**Fuente de verdad de negocio:** `21102026.md`

##  0. Reglas de Desarrollo
1. **Un tema a la vez:** No avanzar al siguiente archivo/módulo hasta que el actual compile/pase pruebas.
2. **Cero ruido:** No mostrar código ni tablas de temas que no se estén discutiendo activamente.
3. **Commits atómicos:** Un commit por funcionalidad o archivo lógico completado.
4. **El usuario marca el ritmo:** No asumir el siguiente paso ni autocompletar tareas no solicitadas.
5. **Formato de actualización:** Si el archivo crece, dividirlo en partes para evitar errores de copiado.

## 🚀 1. Sprint 1: Fundación (Objetivos)
- [x] **1.1** Inicialización de repositorio y estructura base (Backend Go + Frontend React/Vite).
- [x] **1.2** Configuración de infraestructura local (Docker + PostgreSQL 16).
- [x] **1.3** Despliegue del esquema completo de PostgreSQL (Tablas + índice de barcode).
- [x] **1.4** Seed inicial de 20 productos con fotos, stock y códigos de barras.
- [x] **1.5** Scaffolding del Backend Go (módulo, config segura, conexión DB, servidor HTTP).
- [x] **1.6** Scaffolding Frontend (Vite + React + TS + Tailwind CSS).

## ️ 2. Stack Técnico (Decisiones de Implementación)
| Capa | Tecnología | Versión / Detalle |
|---|---|---|
| **Backend** | Go | 1.23+ (Router `net/http` nativo, sin frameworks) |
| **Frontend** | React + Vite | React 18, TypeScript, Tailwind CSS |
| **Estado/Offline** | Dexie.js | Wrapper de IndexedDB para cola de sincronización |
| **Base de Datos** | PostgreSQL | 16 (Alpine en Docker) |
| **Gestor Paquetes** | pnpm | Frontend (por seguridad y velocidad) |
| **Contenedores** | Docker Compose | Para orquestar PostgreSQL localmente |
| **Variables de Entorno** | godotenv | Backend lee desde `infra/.env` (sin hardcodeo) |
| **Linter Frontend** | ESLint | Elegido sobre Oxlint por madurez en stack React+TS |

## 📝 3. Bitácora de Progreso (Changelog)
| Fecha | Tarea Completada | Detalles / Archivos |
|---|---|---|
| 23-Oct-2026 | Estructura de Repo e Infraestructura DB | Creadas carpetas `backend/`, `frontend/`, `infra/`, `contexto/`. Configurado `docker-compose.yml` (Postgres 16). |
| 23-Oct-2026 | Schema SQL y Seed Inicial | Creados `001_schema.sql` (7 tablas + índices) y `002_seed.sql` (20 productos + config). Agregada columna `barcode`. |
| 23-Oct-2026 | Ajuste: Ubicación `.env` | Se movió `.env` a `infra/` y se actualizó `docker-compose.yml` para resolver error de variables no leídas. |
| 23-Oct-2026 | Scaffolding Backend Go | Inicializado `go.mod`, instaladas dependencias (`pgx/v5`, `godotenv`), creados `config.go`, `db.go`, `main.go`. Conexión DB verificada. |
| 23-Oct-2026 | Corrección: Variables de entorno | Unificadas variables `POSTGRES_*` entre Docker y Go. Eliminados hardcodeos de credenciales. |
| 23-Oct-2026 | Scaffolding Frontend | Proyecto Vite+React+TS inicializado con `pnpm`. Tailwind CSS v3 instalado (v4 rompió `init`). Verificado render con estilos en `localhost:5173`. |

## ️ 4. Temas Pendientes / Bloqueantes
- [ ] **Estructura de carpetas Frontend:** Crear `components/`, `pages/`, `services/`, `hooks/`, `types/`, `lib/` dentro de `frontend/src/`.
- [ ] **PWA Setup:** Instalar y configurar `vite-plugin-pwa` para modo offline e instalación en tablet.
- [ ] **Dexie.js:** Instalar y configurar la base de datos local IndexedDB para la cola de sincronización.
- [ ] **Cliente HTTP:** Crear wrapper de `fetch` hacia el backend (`localhost:8080`).
- [ ] **Primer commit global:** Commit inicial del repo para cerrar oficialmente el Sprint 1.

##  5. Notas de Arquitectura (Durante el desarrollo)
- *Nota:* El archivo `.env` vive en `infra/` y es referenciado por `docker-compose.yml` y el backend (vía `godotenv`).
- *Nota:* La tabla `products` incluye `barcode` (único, indexado) para soporte de escáner.
- *Nota:* Backend usa `pgx/v5` (pool de conexiones) y `godotenv` (carga segura de variables).
- *Nota:* Se forzó Tailwind CSS **v3** en el frontend porque la v4 eliminó el comando `init` y cambió la configuración.
- *Nota:* Las imágenes de productos en la Beta se manejarán como URLs del servidor local.
- *Nota:* Puerto backend: `8080`. Puerto frontend dev: `5173`. Puerto Postgres: `5432`.