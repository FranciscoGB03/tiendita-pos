# 📋 Contexto de Desarrollo (DEV_CONTEXT)
**Fecha de última actualización:** 26 de Octubre de 2026
**Fase actual:** Desarrollo Activo - Sprint 2
**Sprint completado:** Sprint 1 - Fundación
**Fuente de verdad de negocio:** `21102026.md`

## 📜 1. Reglas de Desarrollo
1. **Un tema a la vez:** No avanzar al siguiente archivo/módulo hasta que el actual compile/pase pruebas.
2. **Cero ruido:** No mostrar código ni tablas de temas que no se estén discutiendo activamente.
3. **Commits atómicos:** Un commit por funcionalidad o archivo lógico completado.
4. **El usuario marca el ritmo:** No asumir el siguiente paso ni autocompletar tareas no solicitadas.
5. **Formato de actualización:** Si el archivo crece, dividirlo en partes para evitar errores de copiado.

## 🏃 2. Sprints (Estado)
- [x] Sprint 1: Fundación (Repo, DB, Backend Go, Frontend React/Vite). ✅ CERRADO
- [ ] Sprint 2: Pantalla de cobro responsive (Grid, Carrito, API Productos).

## 🛠️ 3. Stack Técnico (Decisiones de Implementación)
| Capa             | Tecnología         | Versión / Detalle                                     |
| ---------------- | ------------------ | ----------------------------------------------------- |
| Backend          | Go                 | 1.23+ (Router `net/http` nativo, sin frameworks)      |
| Frontend         | React + Vite       | React 18, TypeScript, Tailwind CSS v3                 |
| Estado/Offline   | Dexie.js           | Wrapper de IndexedDB para cola de sincronización      |
| Base de Datos    | PostgreSQL         | 16 (Alpine en Docker)                                 |
| Gestor Paquetes  | pnpm               | Frontend (por seguridad y velocidad)                  |
| Contenedores     | Docker Compose     | Para orquestar PostgreSQL localmente                  |
| Variables Entorno| godotenv           | Backend lee desde `infra/.env` (sin hardcodeo)        |
| Linter Frontend  | ESLint             | Elegido sobre Oxlint por madurez en stack React+TS    |
| Seguridad        | JWT                | JSON Web Tokens para autenticación multi-caja         |

## 📝 4. Bitácora de Progreso (Changelog)
| Fecha       | Tarea Completada                | Detalles / Archivos                                                                                   |
| ----------- | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 26-Oct-2026 | Grid de Productos (UI) ✅       | Frontend: `Product.ts`, `productService.ts`, `useProducts.ts`, `ProductCard.tsx`, `ProductGrid.tsx`, `POSPage.tsx`, `App.tsx`. Backend: `cors.go`, `response.go`, `products.go` estandarizado. |
| 26-Oct-2026 | Middleware CORS Backend         | `internal/middleware/cors.go` — Maneja headers y petición OPTIONS (preflight) entre puertos 5173↔8080.|
| 26-Oct-2026 | Helper de Respuestas            | `internal/response/response.go` — Helpers `Success()` y `Error()` con estructura `{success, data, error}`. |
| 25-Oct-2026 | Definición Arquitectura Backend | Establecido patrón Handler → Service → Repository → Model + middleware, router, response.             |
| 25-Oct-2026 | API Backend (Productos)         | Endpoint `GET /api/products` operativo y probado con `curl`.                                          |
| 25-Oct-2026 | Cliente HTTP Frontend           | Wrapper `api.ts` en `frontend/src/lib/` con genéricos `<T>`.                                          |
| 25-Oct-2026 | Estructura carpetas Frontend    | Creadas `components/`, `hooks/`, `lib/`, `pages/`, `services/`, `types/`.                             |
| 23-Oct-2026 | Sprint 1 Cerrado                | Commit inicial, estructura base, DB, Backend y Frontend operativos.                                   |

## 🎯 5. Temas Pendientes / Bloqueantes (Sprint 2)
- [x] Estructura de carpetas Frontend. ✅
- [x] Cliente HTTP Frontend. ✅
- [x] API Backend (Productos): Endpoint `GET /api/products`. ✅
- [x] Grid de Productos: Pintar los 20 productos del seed con imágenes en la UI. ✅ **CERRADO**
- [ ] **Carrito Básico**: Lógica para agregar, quitar y cambiar cantidades (botones grandes, feedback claro).
- [ ] Autenticación: Endpoint de Login, tabla de usuarios y middleware JWT.

## 🗺️ 6. Mapa de Archivos del Proyecto (Referencia Rápida)
*Guía para retomar el desarrollo sin copiar/pegar contenido actual.*

### 📂 BACKEND (`backend/`)
| Archivo | Propósito / Claves |
| :--- | :--- |
| `cmd/api/main.go` | Entry point. Inicializa DB, configura `http.ServeMux`, aplica `middleware.CORS` y arranca el servidor. |
| `internal/middleware/cors.go` | Función `CORS(next http.Handler)`. Maneja headers CORS y petición `OPTIONS` (preflight). Origen permitido: `http://localhost:5173`. |
| `internal/response/response.go` | Helpers `Success(w, data, status)` y `Error(w, msg, code, status)`. Estructura `APIResponse{success, data, error}`. |
| `internal/handlers/products.go` | Handler `GetProducts(pool)`. Query a DB, mapeo a struct `Product`, respuesta estandarizada vía `response.Success`. |

### 📂 FRONTEND (`frontend/src/`)
| Archivo | Propósito / Claves |
| :--- | :--- |
| `lib/api.ts` | Cliente HTTP genérico. Exporta `api.get`, `api.post`, `api.put`, `api.delete` y clase `ApiError`. Base URL desde `VITE_API_URL`. |
| `types/Product.ts` | Interfaz `Product` (id, name, barcode, cost_price, sale_price, stock_quantity, low_stock_threshold, image_url, is_active, created_at, updated_at). |
| `services/productService.ts` | `productService.getAll()`: Llama a `api.get`, valida formato `{success, data, error}` y retorna `Product[]`. |
| `hooks/useProducts.ts` | Custom hook `useProducts()`. Retorna `{ products, isLoading, error, refetch }`. Maneja estado de la petición. |
| `components/ProductCard.tsx` | Componente `ProductCard`. Muestra imagen (con fallback), nombre, precio y botón "AGREGAR" (`min-h-[60px]`, fuente ≥18px). |
| `components/ProductGrid.tsx` | Componente `ProductGrid`. Usa `useProducts`. Grid responsive (`grid-cols-2 lg:grid-cols-3`) y estados de carga/error/vacío. |
| `pages/POSPage.tsx` | Componente `POSPage`. Layout principal: `<main>` con `ProductGrid` y `<aside>` placeholder para el carrito (w-[400px], `hidden md:flex`). |
| `App.tsx` | Root component. Renderiza `<POSPage />`. |

## 🗺️ 7. Mapa de Archivos del Proyecto (Referencia Rápida)
*Guía para retomar el desarrollo sin copiar/pegar contenido actual.*

### 📂 BACKEND (`backend/`)
| Archivo | Propósito / Claves |
| :--- | :--- |
| `cmd/api/main.go` | Entry point. Inicializa DB, configura `http.ServeMux`, aplica `middleware.CORS` y arranca el servidor. |
| `internal/middleware/cors.go` | Función `CORS(next http.Handler)`. Maneja headers CORS y petición `OPTIONS` (preflight). Origen permitido: `http://localhost:5173`. |
| `internal/response/response.go` | Helpers `Success(w, data, status)` y `Error(w, msg, code, status)`. Estructura `APIResponse{success, data, error}`. |
| `internal/handlers/products.go` | Handler `GetProducts(pool)`. Query a DB, mapeo a struct `Product`, respuesta estandarizada vía `response.Success`. |

### 📂 FRONTEND (`frontend/src/`)
| Archivo | Propósito / Claves |
| :--- | :--- |
| `lib/api.ts` | Cliente HTTP genérico. Exporta `api.get`, `api.post`, `api.put`, `api.delete` y clase `ApiError`. Base URL desde `VITE_API_URL`. |
| `types/Product.ts` | Interfaz `Product` (id, name, barcode, cost_price, sale_price, stock_quantity, low_stock_threshold, image_url, is_active, created_at, updated_at). |
| `services/productService.ts` | `productService.getAll()`: Llama a `api.get`, valida formato `{success, data, error}` y retorna `Product[]`. |
| `hooks/useProducts.ts` | Custom hook `useProducts()`. Retorna `{ products, isLoading, error, refetch }`. Maneja estado de la petición. |
| `components/ProductCard.tsx` | Componente `ProductCard`. Muestra imagen (con fallback), nombre, precio y botón "AGREGAR" (`min-h-[60px]`, fuente ≥18px). |
| `components/ProductGrid.tsx` | Componente `ProductGrid`. Usa `useProducts`. Grid responsive (`grid-cols-2 lg:grid-cols-3`) y estados de carga/error/vacío. |
| `pages/POSPage.tsx` | Componente `POSPage`. Layout principal: `<main>` con `ProductGrid` y `<aside>` placeholder para el carrito (w-[400px], `hidden md:flex`). |
| `App.tsx` | Root component. Renderiza `<POSPage />`. |

## 🏗️ 8. Notas de Arquitectura y Estructura de Carpetas (Fuente de Verdad)
⚠️ **REGLA:** Respetar esta estructura para evitar archivos desordenados o lógica mezclada.

### 📂 FRONTEND (`frontend/src/`)
├── assets/       # Imágenes estáticas, iconos, fuentes.
├── components/   # Componentes UI reutilizables (ej. `ProductCard.tsx`, `CartButton.tsx`).
├── hooks/        # Custom hooks de React (ej. `useCart.ts`, `useProducts.ts`).
├── lib/          # Utilidades y configuraciones (ej. `api.ts` para el cliente HTTP).
── pages/        # Vistas principales (ej. `POSPage.tsx`, `AdminPage.tsx`).
├── services/     # Llamadas específicas a la API (ej. `productService.ts` que usa `lib/api.ts`).
└── types/        # Definiciones de TypeScript (ej. `Product.ts`, `User.ts`).

### 📂 BACKEND (backend/)
├── cmd/
│   └── api/
│       └── main.go          # Punto de entrada: carga config, init DB, init router, inicia servidor.
└── internal/
    ├── config/              # Carga de variables de entorno (`godotenv`).
    ├── database/            # Inicialización y pool de conexiones (`pgxpool`).
    ├── middleware/          # Auth JWT, Logging, CORS, Panic Recovery.
    ├── models/              # (Entities) Estructuras de datos (DTOs, DB models).
    ├── repositories/        # (DAO) Acceso puro a datos: queries SQL, `pgxpool.Query`.
    ├── response/            # Manejo centralizado de respuestas JSON (éxito/error).
    ├── router/              # Configuración del `http.ServeMux` y registro de rutas.
    ├── services/            # (Business Logic) Reglas de negocio, cálculos, validaciones.
    └── handlers/            # (Controllers) Capa HTTP: parsea request, llama al service, devuelve JSON.

Flujo de una petición Backend: 
`HTTP Request` → `router` (enruta) → `middleware` (valida JWT/Logs) → `handler` (extrae datos) → `service` (lógica de negocio) → `repository` (ejecuta SQL) → `DB` → Respuesta en sentido inverso.

Formato de Respuesta JSON Estandarizado:
{
  "success": true/false,
  "data": { ... } | null,
  "error": { "code": 400, "message": "..." } | null
}

##  9. Notas Generales (Durante el desarrollo)
- Seguridad: Auth vía JWT. Login con `username` corto + `pin`/`password`. `email` es solo informativo.
- `.env` vive en `infra/` y es referenciado por `docker-compose.yml` y el backend.
- Tabla `products` incluye `barcode` (único, indexado) para soporte de escáner.
- Tailwind CSS v3 forzado en frontend (la v4 cambió la configuración).
- Imágenes de productos en Beta: URLs del servidor local (`http://localhost:8080/images/...`).
- Puertos: Backend `8080`, Frontend dev `5173`, Postgres `5432`.