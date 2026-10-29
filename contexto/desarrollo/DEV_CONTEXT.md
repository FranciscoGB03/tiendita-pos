# 📋 Contexto de Desarrollo (DEV_CONTEXT)

**Fecha de última actualización:** 28 de Octubre de 2026
**Fase actual:** Desarrollo Activo - Sprint 2
**Sprint completado:** Sprint 1 - Fundación
**Fuente de verdad de negocio:** `21102026.md`

## 📜 1. Reglas de Desarrollo

1. **Un tema a la vez:** No avanzar al siguiente archivo/módulo hasta que el actual compile/pase pruebas.
2. **Cero ruido:** No mostrar código ni tablas de temas que no se estén discutiendo activamente.
3. **Commits atómicos:** Un commit por funcionalidad o archivo lógico completado.
4. **El usuario marca el ritmo:** No asumir el siguiente paso ni autocompletar tareas no solicitadas.
5. **Formato de actualización:** Si el archivo crece, dividirlo en partes para evitar errores de copiado.
6. **Al crear o actualizar archivos:** Siempre preguntar por la estructura actual del archivo a modificar para no sobreescribir lo existente.

## 🏃 2. Sprints (Estado)

- [x] Sprint 1: Fundación (Repo, DB, Backend Go, Frontend React/Vite). ✅ CERRADO
- [ ] Sprint 2: Pantalla de cobro responsive (Grid, Carrito, API Productos, Flujo de Cobro completo). 🟡 EN PROGRESO (UI cerrada, falta Auth/Offline/Reportes)

## 🛠️ 3. Stack Técnico (Decisiones de Implementación)

| Capa              | Tecnología     | Versión / Detalle                                  |
| ----------------- | -------------- | -------------------------------------------------- |
| Backend           | Go             | 1.23+ (Router net/http nativo, sin frameworks)     |
| Frontend          | React + Vite   | React 18, TypeScript, Tailwind CSS v3              |
| Estado/Offline    | Dexie.js       | Wrapper de IndexedDB para cola de sincronización   |
| Base de Datos     | PostgreSQL     | 16 (Alpine en Docker)                              |
| Gestor Paquetes   | pnpm           | Frontend (por seguridad y velocidad)               |
| Contenedores      | Docker Compose | Para orquestar PostgreSQL localmente               |
| Variables Entorno | godotenv       | Backend lee desde infra/.env (sin hardcodeo)       |
| Linter Frontend   | ESLint         | Elegido sobre Oxlint por madurez en stack React+TS |
| Seguridad         | JWT            | JSON Web Tokens para autenticación multi-caja      |

## 📝 4. Bitácora de Progreso (Changelog)

| Fecha       | Tarea Completada                      | Detalles / Archivos                                                                                                                                                                                                                                       |
| ----------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 28-Oct-2026 | Modal de Cobro a Pantalla Completa ✅ | Componente `PaymentModal.tsx` extraído de `CartTicket.tsx`. Flujo de 2 pasos: selección de método → ingreso de monto con teclado numérico. Cálculo de cambio en tiempo real. Soporte teclado físico (Enter/Escape/Backspace). Botones ≥80px, texto ≥32px. |
| 28-Oct-2026 | Botón Vaciar Carrito ✅               | Agregado en header de `CartTicket.tsx`. Llama a `clearCart()` del hook `useCart`. Botón ≥60px con ícono de basura.                                                                                                                                        |
| 28-Oct-2026 | Botón COBRAR + Feedback de Éxito ✅   | Botón en footer de `CartTicket.tsx` (≥70px, deshabilitado si vacío). Pantalla verde de "¡Venta Registrada!" en `POSPage.tsx` con auto-cierre a 3s.                                                                                                        |
| 27-Oct-2026 | Carrito Básico (Frontend) ✅          | Tipos `CartItem.ts`, hook `useCart.ts`, componente `CartTicket.tsx`. Integración en `POSPage.tsx` con layout optimizado (header fijo, scroll independiente).                                                                                              |
| 26-Oct-2026 | Grid de Productos (UI) ✅             | Frontend: `Product.ts`, `productService.ts`, `useProducts.ts`, `ProductCard.tsx`, `ProductGrid.tsx`, `POSPage.tsx`, `App.tsx`. Backend: `cors.go`, `response.go`, `products.go` estandarizado.                                                            |
| 26-Oct-2026 | Middleware CORS Backend               | `internal/middleware/cors.go` — Maneja headers y petición OPTIONS (preflight) entre puertos 5173↔8080.                                                                                                                                                    |
| 26-Oct-2026 | Helper de Respuestas                  | `internal/response/response.go` — Helpers `Success()` y `Error()` con estructura `{success, data, error}`.                                                                                                                                                |
| 25-Oct-2026 | Definición Arquitectura Backend       | Establecido patrón Handler → Service → Repository → Model + middleware, router, response.                                                                                                                                                                 |
| 25-Oct-2026 | API Backend (Productos)               | Endpoint `GET /api/products` operativo y probado con `curl`.                                                                                                                                                                                              |
| 25-Oct-2026 | Cliente HTTP Frontend                 | Wrapper `api.ts` en `frontend/src/lib/` con genéricos `<T>`.                                                                                                                                                                                              |
| 25-Oct-2026 | Estructura carpetas Frontend          | Creadas `components/`, `hooks/`, `lib/`, `pages/`, `services/`, `types/`.                                                                                                                                                                                 |
| 23-Oct-2026 | Sprint 1 Cerrado                      | Commit inicial, estructura base, DB, Backend y Frontend operativos.                                                                                                                                                                                       |

## 🎯 5. Temas Pendientes / Bloqueantes (Sprint 2)

[x] Estructura de carpetas Frontend. ✅
[x] Cliente HTTP Frontend. ✅
[x] API Backend (Productos): Endpoint `GET /api/products`. ✅
[x] Grid de Productos: Pintar los 20 productos del seed con imágenes en la UI. ✅
[x] Carrito Básico: Lógica para agregar, quitar y cambiar cantidades (botones grandes ≥60px, feedback claro, scroll independiente). ✅
[x] Botón COBRAR + Modal de Método de Pago (pantalla completa, teclado numérico, cálculo de cambio, soporte teclado físico). ✅
[x] Botón Vaciar Carrito. ✅
[ ] Autenticación: Endpoint de Login, tabla de usuarios y middleware JWT.
[ ] Offline + persistencia: Dexie.js, cola de sincronización, indicador de red.
[ ] Cierre + reportes: Sonido de confirmación, reporte diario, corte de caja.

## 🗺️ 6. Mapa de Archivos del Proyecto

📂 FRONTEND (`frontend/src/`)
| Archivo | Propósito / Claves |
|------------------------------|------------------------------------------------------------------------------------|
| `lib/api.ts` | Cliente HTTP genérico. Exporta `api.get`, `api.post`, `api.put`, `api.delete` y clase `ApiError`. Base URL desde `VITE_API_URL`. |
| `types/Product.ts` | Interfaz `Product` (id, name, barcode, cost_price, sale_price, stock_quantity, low_stock_threshold, image_url, is_active, created_at, updated_at). |
| `types/CartItem.ts` | Interfaz `CartItem` que extiende `Product` agregando la propiedad `quantity: number`. |
| `services/productService.ts` | `productService.getAll()`: Llama a `api.get`, valida formato `{success, data, error}` y retorna `Product[]`. |
| `hooks/useProducts.ts` | Custom hook `useProducts()`. Retorna `{ products, isLoading, error, refetch }`. |
| `hooks/useCart.ts` | Custom hook `useCart()`. Maneja estado del carrito: `items`, `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `total`, `itemCount`. |
| `components/ProductCard.tsx` | Componente `ProductCard`. Muestra imagen (con fallback), nombre, precio y botón "AGREGAR" (`min-h-[60px]`, fuente ≥18px). |
| `components/ProductGrid.tsx` | Componente `ProductGrid`. Usa `useProducts`. Grid responsive (`grid-cols-2 lg:grid-cols-3`) y estados de carga/error/vacío. |
| `components/CartTicket.tsx` | Componente `CartTicket`. Panel lateral con header (título + botón Vaciar), lista de items, controles de cantidad (+/- ≥60px), botón eliminar por item, total destacado y botón COBRAR (≥70px). |
| `components/PaymentModal.tsx` | Componente `PaymentModal`. Modal a pantalla completa con flujo de 2 pasos: selección de método (EFECTIVO/TARJETA) e ingreso de monto con teclado numérico (botones ≥80px). Cálculo de cambio en tiempo real. Soporte teclado físico (0-9, Backspace, Enter, Escape). |
| `pages/POSPage.tsx` | Componente `POSPage`. Layout principal: `<main>` con header fijo y `ProductGrid` con scroll, y `<aside>` (w-[400px]) con `CartTicket`. Incluye pantalla verde de "¡Venta Registrada!" con auto-cierre a 3s. |
| `App.tsx` | Root component. Renderiza `<POSPage />`. |

📂 BACKEND (`backend/`)
| Archivo | Propósito / Claves |
|--------------------------------|------------------------------------------------------------------------------------|
| `cmd/api/main.go` | Entry point. Inicializa DB, configura `http.ServeMux`, aplica `middleware.CORS` y arranca el servidor. |
| `internal/middleware/cors.go` | Función `CORS(next http.Handler)`. Maneja headers CORS y petición `OPTIONS` (preflight). Origen permitido: `http://localhost:5173`. |
| `internal/response/response.go` | Helpers `Success(w, data, status)` y `Error(w, msg, code, status)`. Estructura `APIResponse{success, data, error}`. |
| `internal/handlers/products.go` | Handler `GetProducts(pool)`. Query a DB, mapeo a struct `Product`, respuesta estandarizada vía `response.Success`. |

## 🏗️ 8. Notas de Arquitectura y Estructura de Carpetas (Fuente de Verdad)

⚠️ **REGLA:** Respetar esta estructura para evitar archivos desordenados o lógica mezclada. Siempre preguntar por la estructura actual del archivo a modificar para no sobreescribir lo existente.

📂 FRONTEND (`frontend/src/`)

- `assets/`: Recursos estáticos (imágenes, iconos).
- `components/`: Componentes UI reutilizables (`ProductCard.tsx`, `ProductGrid.tsx`, `CartTicket.tsx`, `PaymentModal.tsx`).
- `hooks/`: Custom hooks de React (`useProducts.ts`, `useCart.ts`).
- `lib/`: Utilidades y configuraciones base (`api.ts`).
- `pages/`: Componentes de página/ruta (`POSPage.tsx`).
- `services/`: Lógica de negocio y llamadas a API (`productService.ts`).
- `types/`: Interfaces y tipos de TypeScript (`Product.ts`, `CartItem.ts`).

📂 BACKEND (`backend/`)

- `cmd/api/`: Entry point (`main.go`).
- `internal/`: Código privado de la aplicación.
  - `config/`: Configuración.
  - `database/`: Conexión y queries a PostgreSQL.
  - `handlers/`: Lógica HTTP (`products.go`).
  - `middleware/`: Middlewares (`cors.go`).
  - `models/`: Structs de base de datos.
  - `repositories/`: Acceso a datos.
  - `response/`: Helpers de respuesta API (`response.go`).
  - `router/`: Definición de rutas.
  - `services/`: Lógica de negocio.

## 9. Notas Generales (Durante el desarrollo)

- Seguridad: Auth vía JWT. Login con `username` corto + `pin`/`password`. `email` es solo informativo.
- `.env` vive en `infra/` y es referenciado por `docker-compose.yml` y el backend.
- Tabla `products` incluye `barcode` (único, indexado) para soporte de escáner.
- Tailwind CSS v3 forzado en frontend (la v4 cambió la configuración).
- Imágenes de productos en Beta: URLs del servidor local (`http://localhost:8080/images/...`).
- Puertos: Backend `8080`, Frontend dev `5173`, Postgres `5432`.
- UX/UI Modal de Pago: Componente `PaymentModal.tsx` a pantalla completa. Flujo de 2 pasos (selección de método -> ingreso de monto).
- UX/UI Teclado: Teclado numérico en pantalla (botones ≥80px) + soporte nativo para teclado físico (0-9, Backspace, Enter, Escape).
- UX/UI Carrito: Botón "Vaciar Carrito" en el header de `CartTicket.tsx`. Pantalla de éxito "¡Venta Registrada!" con auto-cierre a 3s en `POSPage.tsx`.
- Regla de negocio Beta: Un solo método de pago por venta (EFECTIVO o TARJETA). Cálculo de cambio en tiempo real solo para efectivo.
