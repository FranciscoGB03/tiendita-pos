# 📋 Contexto de Desarrollo (DEV_CONTEXT)

**Fecha de última actualización:** 31 de Octubre de 2026
**Fase actual:** Desarrollo Activo - Listo para Sprint 4 (Offline + persistencia)
**Sprints completados:** Sprint 1 (Fundación) ✅, Sprint 2 (UI Cobro) ✅, Sprint 3 (Auth + Seguridad) ✅
**Fuente de verdad de negocio:** `21102026.md`

## 📜 1. Reglas de Desarrollo

1. **Un tema a la vez:** No avanzar al siguiente archivo/módulo hasta que el actual compile/pase pruebas.
2. **Cero ruido:** No mostrar código ni tablas de temas que no se estén discutiendo activamente.
3. **Commits atómicos:** Un commit por funcionalidad o archivo lógico completado.
4. **El usuario marca el ritmo:** No asumir el siguiente paso ni autocompletar tareas no solicitadas.
5. **Formato de actualización:** Si el archivo crece, dividirlo en partes para evitar errores de copiado.
6. **Al crear o actualizar archivos:** Siempre preguntar por la estructura actual del archivo a modificar para no sobreescribir lo existente.

## 🏃 2. Sprints (Estado)

[x] Sprint 1: Fundación ✅ CERRADO (23-Oct-2026)
[x] Sprint 2: Pantalla de cobro responsive ✅ CERRADO (28-Oct-2026)
[x] Sprint 3: Autenticación y RBAC ✅ CERRADO (31-Oct-2026)

- SQL: 6 tablas + Seed inicial.
- Backend: Model, Repository, Service, Handler, Middleware JWT, Router, Security Headers.
- Frontend: Pantalla de Login, ProtectedRoute, Teclado universal responsive, Identidad Visual Tailwind.
- Seguridad: CSP estricto (localhost + 192.168.10.101).
  [ ] Sprint 4: Offline + persistencia
- Dexie.js como wrapper de IndexedDB
- Cola de sincronización automática (amortiguador temporal)
- Indicador de estado de red (online/offline)
- Reintento inteligente de sincronización
  [ ] Sprint 5: Cierre + reportes + Pruebas reales
- Sonido de confirmación y reporte diario
- Lógica de corte de caja
- Instalación en Samsung Tab A11+ y pruebas con usuarios finales

## 🛠️ 3. Stack Técnico (Decisiones de Implementación)

| Capa              | Tecnología         | Versión / Detalle                                          |
| ----------------- | ------------------ | ---------------------------------------------------------- |
| Backend           | Go                 | 1.23+ (Router net/http nativo, sin frameworks)             |
| Frontend          | React + Vite       | React 19, TypeScript, Tailwind CSS v3                      |
| Estado/Offline    | Dexie.js           | Wrapper de IndexedDB para cola de sincronización           |
| Base de Datos     | PostgreSQL         | 16 (Alpine en Docker)                                      |
| Gestor Paquetes   | pnpm               | Frontend (por seguridad y velocidad)                       |
| Contenedores      | Docker Compose     | Para orquestar PostgreSQL localmente                       |
| Variables Entorno | godotenv           | Backend lee desde infra/.env (sin hardcodeo)               |
| Linter Frontend   | ESLint             | Elegido sobre Oxlint por madurez en stack React+TS         |
| Seguridad         | JWT + bcrypt + CSP | JSON Web Tokens, hashing, Content Security Policy estricto |
| Librería JWT      | golang-jwt/jwt/v5  | Estándar de la comunidad Go                                |
| Duración Token    | 24 horas           | Balance entre seguridad y UX para padres                   |

## 📝 4. Bitácora de Progreso (Changelog)

| Fecha       | Tarea Completada                          | Detalles / Archivos                                                                                                                                     |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 31-Oct-2026 | Frontend Login UI + Teclado Responsive ✅ | `LoginPage.tsx`, `AlphanumericKeyboard.tsx`, `useIsTouchDevice.ts`, `ProtectedRoute.tsx`. Layout 1 col desktop, 2 col tablet.                           |
| 31-Oct-2026 | Identidad Visual Tailwind ✅              | `tailwind.config.js` configurado con paleta "La Popular" (primary, secondary, background, text, success, error, neutral).                               |
| 31-Oct-2026 | Seguridad CSP + Headers ✅                | `index.html` (meta CSP), `internal/middleware/security.go` (X-Frame-Options, X-Content-Type-Options, etc.). IP LAN: 192.168.10.101.                     |
| 30-Oct-2026 | Backend Auth Completo ✅                  | Model `User`, Repository `GetUserByUsername`, Service `Login`, Handler `POST /api/login`, Middleware `Auth` + `RequirePermission`, Router centralizado. |
| 30-Oct-2026 | SQL + Seed Auth ✅                        | 6 tablas creadas. Seed: 2 roles, 8 permisos, 4 empleados, 3 usuarios (mama, papa, dev).                                                                 |
| 30-Oct-2026 | Diseño Auth/RBAC ✅                       | Arquitectura RBAC completa, tabla employees separada. JWT claims: user_id, username, role, permissions[], exp.                                          |
| 28-Oct-2026 | Modal de Cobro a Pantalla Completa ✅     | `PaymentModal.tsx`. Flujo de 2 pasos, teclado numérico, cálculo de cambio, soporte teclado físico.                                                      |
| 28-Oct-2026 | Botón Vaciar Carrito ✅                   | Agregado en header de `CartTicket.tsx`.                                                                                                                 |
| 28-Oct-2026 | Botón COBRAR + Feedback de Éxito ✅       | Botón en footer de `CartTicket.tsx`. Pantalla verde "¡Venta Registrada!" en `POSPage.tsx` (3s).                                                         |
| 27-Oct-2026 | Carrito Básico (Frontend) ✅              | `CartItem.ts`, `useCart.ts`, `CartTicket.tsx`.                                                                                                          |
| 26-Oct-2026 | Grid de Productos (UI) ✅                 | `Product.ts`, `productService.ts`, `useProducts.ts`, `ProductCard.tsx`, `ProductGrid.tsx`, `POSPage.tsx`.                                               |
| 26-Oct-2026 | Middleware CORS Backend ✅                | `internal/middleware/cors.go`. Origen permitido: `http://localhost:5173`.                                                                               |
| 26-Oct-2026 | Helper de Respuestas ✅                   | `internal/response/response.go`. Helpers `Success()` y `Error()`.                                                                                       |
| 25-Oct-2026 | Definición Arquitectura Backend ✅        | Patrón Handler → Service → Repository → Model.                                                                                                          |
| 25-Oct-2026 | API Backend (Productos) ✅                | Endpoint `GET /api/products` operativo.                                                                                                                 |
| 25-Oct-2026 | Cliente HTTP Frontend ✅                  | Wrapper `api.ts` en `frontend/src/lib/`.                                                                                                                |
| 25-Oct-2026 | Estructura carpetas Frontend ✅           | `components/`, `hooks/`, `lib/`, `pages/`, `services/`, `types/`.                                                                                       |
| 23-Oct-2026 | Sprint 1 Cerrado ✅                       | Commit inicial, estructura base, DB, Backend y Frontend operativos.                                                                                     |

## 🎯 5. Temas Pendientes / Bloqueantes (Sprint 4)

[ ] Instalación y configuración de Dexie.js.
[ ] Definir esquema de IndexedDB para `products` y `pending_sales`.
[ ] Hook `useNetworkStatus` para indicador online/offline.
[ ] Lógica de sincronización en segundo plano al recuperar conexión.

## 🗺️ 6. Mapa de Archivos del Proyecto

⚠️ NOTA: Este mapa refleja los archivos existentes al día de hoy (31-Oct-2026).

📂 FRONTEND (`frontend/src/`)
| Archivo | Propósito / Claves |
|---|---|
| `assets/logo-la-popular.png` | Logo oficial de la miscelánea. |
| `lib/api.ts` | Cliente HTTP genérico. Exporta `api.get`, `api.post`, etc. Base URL desde `VITE_API_URL`. |
| `types/Product.ts` | Interfaz `Product`. |
| `types/CartItem.ts` | Interfaz `CartItem` (extiende `Product` + `quantity`). |
| `services/productService.ts` | `productService.getAll()`: Llama a `api.get`, valida formato y retorna `Product[]`. |
| `hooks/useProducts.ts` | Custom hook `useProducts()`. Retorna `{ products, isLoading, error, refetch }`. |
| `hooks/useCart.ts` | Custom hook `useCart()`. Maneja estado del carrito. |
| `hooks/useIsTouchDevice.ts` | Custom hook para detectar dispositivos táctiles (lazy initialization). |
| `components/ProductCard.tsx` | Componente `ProductCard`. Imagen, nombre, precio, botón "AGREGAR". |
| `components/ProductGrid.tsx` | Componente `ProductGrid`. Grid responsive y estados de carga/error. |
| `components/CartTicket.tsx` | Componente `CartTicket`. Panel lateral con header, lista de items, controles, total y botón COBRAR. |
| `components/PaymentModal.tsx` | Componente `PaymentModal`. Modal a pantalla completa, selección de método, teclado numérico, cálculo de cambio. |
| `components/ProtectedRoute.tsx` | Wrapper para proteger rutas. Redirige a `/login` si no hay token en localStorage. |
| `components/AlphanumericKeyboard.tsx` | Teclado virtual QWERTY + números. Solo visible en dispositivos táctiles, layout de 2 columnas. |
| `pages/POSPage.tsx` | Componente `POSPage`. Layout principal con `ProductGrid` y `CartTicket`. Pantalla de éxito. |
| `pages/LoginPage.tsx` | Componente `LoginPage`. Formulario de auth, manejo de errores inline, integración con teclado virtual. |
| `App.tsx` | Root component. Envuelve la app en `BrowserRouter` y define rutas (`/login`, `/`). |

📂 BACKEND (`backend/`)
| Archivo | Propósito / Claves |
|---|---|
| `cmd/api/main.go` | Entry point. Inicializa DB, configura router, aplica middlewares, graceful shutdown. |
| `internal/config/config.go` | Carga `infra/.env` vía `godotenv`. Exporta struct `Config`. |
| `internal/database/db.go` | Inicializa conexión PostgreSQL vía `pgxpool`. |
| `internal/middleware/cors.go` | Función `CORS(next http.Handler)`. Maneja headers CORS y preflight. |
| `internal/middleware/auth.go` | Middleware `Auth(jwtSecret)` y `RequirePermission(perm)`. Helper `GetClaimsFromContext()`. |
| `internal/middleware/security.go` | Función `SecurityHeaders(next http.Handler)`. Aplica CSP, X-Frame-Options, X-Content-Type-Options, etc. |
| `internal/response/response.go` | Helpers `Success(w, data, status)` y `Error(w, msg, code, status)`. |
| `internal/router/router.go` | Centraliza rutas. Inyecta dependencias. Registra `/health`, `/api/login`, `/api/products`. Envuelto en `SecurityHeaders`. |
| `internal/models/user.go` | Structs `User`, `LoginRequest`, `LoginResponse`. `credential_hash` con `json:"-"`. |
| `internal/repositories/user_repository.go` | `GetUserByUsername(ctx, username)`: Query con `ARRAY_AGG` para permisos. `UpdateLastLogin`. |
| `internal/services/auth_service.go` | `Login(ctx, req)`: Valida con bcrypt, genera JWT (24h) con claims. |
| `internal/handlers/auth.go` | Handler `POST /api/login`. Valida método, decodifica JSON, llama al service, retorna token o error 401. |
| `internal/handlers/products.go` | Handler `GetProducts(pool)`. Query a DB, mapeo a struct `Product`, respuesta estandarizada. |

🏗️ 8. Notas de Arquitectura y Estructura de Carpetas (Fuente de Verdad)
⚠️ **REGLA:** Respetar esta estructura para evitar archivos desordenados. Siempre preguntar por la estructura actual del archivo a modificar.
(Frontend: `assets/`, `components/`, `hooks/`, `lib/`, `pages/`, `services/`, `types/`)
(Backend: `cmd/api/`, `internal/config/`, `internal/database/`, `internal/handlers/`, `internal/middleware/`, `internal/models/`, `internal/repositories/`, `internal/response/`, `internal/router/`, `internal/services/`)

## 🔐 9. Notas Generales (Durante el desarrollo)

- **Autenticación:** RBAC completo. Login: `username` + `PIN`/`password`. `credential_hash` NUNCA viaja en API. JWT: 24 horas. `JWT_SECRET` en `infra/.env`.
- **Empleados vs Usuarios:** Tabla `employees` (RH) independiente de `users` (Auth). `full_name` en `users` es nombre corto para UI.
- `terminal_id`: Propiedad del dispositivo (`VITE_TERMINAL_ID`).
- **Base de Datos:** `.env` en `infra/`. Extensión `pgcrypto` habilitada.
- Frontend: Tailwind CSS v3. Imágenes de productos: URLs del servidor local (`http://localhost:8080` o `http://192.168.10.101:8080`). Puertos: Backend `8080`, Frontend dev `5173`, Postgres `5432`.
- **UX/UI:** Modal de Pago a pantalla completa. Teclado numérico ≥80px. Carrito: Botón "Vaciar", pantalla de éxito 3s.
- **Regla de negocio Beta**:
- Un solo método de pago por venta.
- Cálculo de cambio en tiempo real solo para efectivo.
- Comisión terminal: 4.1%.
