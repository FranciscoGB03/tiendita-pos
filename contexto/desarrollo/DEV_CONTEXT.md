## 📋 Contexto de Desarrollo (DEV_CONTEXT)

**Fecha de última actualización:** 08 de Noviembre de 2026
**Fase actual:** Desarrollo Activo - Sprint 5 EN PROGRESO.
**Sprints completados:** Sprint 1 ✅, Sprint 2 ✅, Sprint 3 ✅, Sprint 4.A ✅, Sprint 4.B ✅
**Fuente de verdad de negocio:**`21102026.md`

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
[x] Sprint 4.A: Lógica Real de Venta + Identificación de Caja ✅ CERRADO (01-Nov-2026)
✅ Tabla `terminals` y endpoint de validación (`GET /api/terminals/validate`).
✅ Hook `useTerminalId` + Modal de configuración con fallback offline.
✅ Endpoint `POST /api/sales` con transacción atómica (ventas, items, pagos, inventario) y lectura dinámica de comisiones.
✅ Integración frontend completa con blindaje de eventos y manejo de estados de carga/error.
[x] Sprint 4.B: Offline + persistencia ✅ CERRADO (07-Nov-2026)
✅ Dexie.js instalado y configurado (`db.ts`).
✅ Fallback de escritura en `saleService.ts`.
✅ Hook `useNetworkStatus` e indicador visual en `POSPage.tsx`.
✅ Hook `useSyncQueue` para sincronización automática al reconectar.
✅ Hotfix: Validación de expiración de JWT en `ProtectedRoute` (`useAuth.ts`) e interceptor 401 en `api.ts`.
[ ] Sprint 5: Cierre + reportes + Pruebas reales
[✅] Sonido de confirmación y RBAC granular frontend/backend base.
[✅] Migración SQL (Rol SUPERVISOR) y Endpoint Backend de Reporte Diario.
[ ] Frontend: Panel lateral de Reporte Diario (`DailyReportPanel.tsx`) y exportación CSV.
[ ] Lógica de corte de caja.
[ ] Instalación en Samsung Tab A11+ y pruebas con usuarios finales.

## 🛠️ 3. Stack Técnico (Decisiones de Implementación)

| Capa                  | Tecnología         | Versión / Detalle                                             |
| --------------------- | ------------------ | ------------------------------------------------------------- |
| Backend               | Go                 | 1.23+ (Router net/http nativo, sin frameworks)                |
| Frontend              | React + Vite       | React 19, TypeScript, Tailwind CSS v3                         |
| Estado/Offline        | Dexie.js           | Wrapper de IndexedDB para cola de sincronización              |
| Base de Datos         | PostgreSQL         | 16 (Alpine en Docker)                                         |
| Gestor Paquetes       | pnpm               | Frontend (por seguridad y velocidad)                          |
| Contenedores          | Docker Compose     | Para orquestar PostgreSQL localmente                          |
| Variables Entorno     | godotenv           | Backend lee desde infra/.env (sin hardcodeo)                  |
| Linter Frontend       | ESLint             | Elegido sobre Oxlint por madurez en stack React+TS            |
| Seguridad             | JWT + bcrypt + CSP | JSON Web Tokens, hashing, Content Security Policy estricto    |
| Librería JWT          | golang-jwt/jwt/v5  | Estándar de la comunidad Go                                   |
| Librería JWT Frontend | jwt-decode         | Para decodificar claims (exp) client-side sin verificar firma |
| Duración Token        | 24 horas           | Balance entre seguridad y UX para padres                      |

## 📝 4. Bitácora de Progreso (Changelog)

| Fecha       | Tarea Completada                          | Detalles / Archivos                                                                                                                                                         |
| ----------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 08-Nov-2026 | RBAC Granular Frontend ✅                 | `usePermission.ts`, `UnauthorizedPage.tsx`, `ProtectedRoute.tsx` (con `requiredPermission`), `CartTicket.tsx` (botón COBRAR condicional).                                   |
| 08-Nov-2026 | Logout y Sonido ✅                        | `useAuth.ts` (expone `logout`), botón de salir en `POSPage.tsx`. Hook `useSound.ts` + `/sounds/sale-success.mp3`.                                                           |
| 08-Nov-2026 | Migración SQL y Backend Reportes ✅       | Script ejecutado: Rol `SUPERVISOR`, permisos `cashier.daily_report`, `cashier.cut`. Backend: `report_repository.go` (query con CTEs), `report.go`, registro en `router.go`. |     |
| 07-Nov-2026 | Sprint 4.B Cerrado ✅                     | Dexie.js, `useSyncQueue`, `useNetworkStatus`, `useAuth`, hotfix JWT. Limpieza de logs para producción.                                                                      |
| 01-Nov-2026 | Sprint 4.A Cerrado ✅                     | Endpoint POST /api/sales (Backend atómico) + Integración Frontend ( saleService , PaymentModal blindado, api.ts con JWT).                                                   |
| 31-Oct-2026 | Identificación de Caja (Terminal ID) ✅   | Tabla terminals , handlers/terminal.go , hooks/useTerminalId.ts (con manejo robusto de 404 vs offline), components/TerminalConfigModal.tsx , integración en POSPage.tsx .   |
| 31-Oct-2026 | Frontend Login UI + Teclado Responsive ✅ | LoginPage.tsx , AlphanumericKeyboard.tsx , useIsTouchDevice.ts , ProtectedRoute.tsx . Layout 1 col desktop, 2 col tablet.                                                   |
| 31-Oct-2026 | Identidad Visual Tailwind ✅              | tailwind.config.js configurado con paleta "La Popular ".                                                                                                                    |
| 31-Oct-2026 | Seguridad CSP + Headers ✅                | index.html (meta CSP), internal/middleware/security.go . IP LAN: 192.168.10.101.                                                                                            |
| 30-Oct-2026 | Backend Auth Completo ✅                  | Model User , Repository GetUserByUsername , Service Login , Handler POST /api/login , Middleware Auth + RequirePermission , Router centralizado.                            |
| 30-Oct-2026 | SQL + Seed Auth ✅                        | 6 tablas creadas. Seed: 2 roles, 8 permisos, 4 empleados, 3 usuarios (mama, papa, dev).                                                                                     |
| 30-Oct-2026 | Diseño Auth/RBAC ✅                       | Arquitectura RBAC completa, tabla employees separada. JWT claims: user_id, username, role, permissions[], exp.                                                              |
| 28-Oct-2026 | Modal de Cobro a Pantalla Completa ✅     | PaymentModal.tsx . Flujo de 2 pasos, teclado numérico, cálculo de cambio, soporte teclado físico.                                                                           |
| 28-Oct-2026 | Botón Vaciar Carrito ✅                   | Agregado en header de CartTicket.tsx .                                                                                                                                      |
| 28-Oct-2026 | Botón COBRAR + Feedback de Éxito ✅       | Botón en footer de CartTicket.tsx . Pantalla verde "¡Venta Registrada! " en POSPage.tsx (3s).                                                                               |
| 27-Oct-2026 | Carrito Básico (Frontend) ✅              | CartItem.ts , useCart.ts , CartTicket.tsx .                                                                                                                                 |
| 26-Oct-2026 | Grid de Productos (UI) ✅                 | Product.ts , productService.ts , useProducts.ts , ProductCard.tsx , ProductGrid.tsx , POSPage.tsx .                                                                         |
| 26-Oct-2026 | Middleware CORS Backend ✅                | internal/middleware/cors.go . Origen permitido: http://localhost:5173 .                                                                                                     |
| 26-Oct-2026 | Helper de Respuestas ✅                   | internal/response/response.go . Helpers Success() y Error() .                                                                                                               |
| 25-Oct-2026 | API Backend (Productos) ✅                | Endpoint GET /api/products operativo.                                                                                                                                       |
| 25-Oct-2026 | Cliente HTTP Frontend ✅                  | Wrapper api.ts en frontend/src/lib/ .                                                                                                                                       |
| 25-Oct-2026 | Estructura carpetas Frontend ✅           | components/ , hooks/ , lib/ , pages/ , services/ , types/ .                                                                                                                 |
| 23-Oct-2026 | Sprint 1 Cerrado ✅                       | Commit inicial, estructura base, DB, Backend y Frontend operativos.                                                                                                         |

## 🗺️ 6. Mapa de Archivos del Proyecto

⚠️ NOTA: Este mapa refleja los archivos existentes al día de hoy (07-Nov-2026).

📂 FRONTEND ( `frontend/src/` )
| Archivo | Propósito / Claves |
|---|---|
| `assets/logo-la-popular.png` | Logo oficial de la miscelánea. |
| `lib/api.ts` | Cliente HTTP genérico. Exporta `api.get` , `api.post` , etc. y clase `ApiError` . Base URL desde `VITE_API_URL` . Incluye interceptor global para 401. |
| `lib/db.ts` | Configuración de Dexie.js (IndexedDB). Define schema `pendingSales` para cola offline. |
| `types/Product.ts` | Interfaz `Product` . |
| `types/CartItem.ts` | Interfaz `CartItem` (extiende `Product` + `quantity` ). |
| `services/productService.ts` | `productService.getAll()` : Llama a `api.get` , valida formato y retorna `Product[]` . |
| `services/saleService.ts` | Servicio para crear ventas. Incluye `createSaleWithFallback` (fallback a Dexie si falla la red). |
| `hooks/useProducts.ts` | Custom hook `useProducts()` . Retorna `{ products, isLoading, error, refetch }` . |
| `hooks/useCart.ts` | Custom hook `useCart()` . Maneja estado del carrito. |
| `hooks/useIsTouchDevice.ts` | Custom hook para detectar dispositivos táctiles (lazy initialization). |
| `hooks/useTerminalId.ts` | Custom hook para gestionar `terminal_id` . Valida contra backend, maneja caché local y fallback offline. |
| `hooks/useNetworkStatus.ts` | Custom hook para detectar estado de red (online/offline) en tiempo real. |
| `hooks/useSyncQueue.ts` | Custom hook para sincronizar ventas pendientes de Dexie al backend cuando hay conexión. |
| `hooks/useAuth.ts` | Custom hook para validar expiración de JWT client-side (usado en ProtectedRoute). |
| `hooks/useSound.ts` | Custom hook para reproducir sonidos precargados. Expone `play()`. Fallback silencioso ante errores de autoplay. |
| `hooks/usePermission.ts` | Custom hook que valida si el usuario tiene un permiso específico desde el JWT. |
| `pages/UnauthorizedPage.tsx` | Pantalla de fallback cuando el usuario no tiene el permiso `*.view` de la ruta. |
| `components/ProtectedRoute.tsx` | Actualizado para aceptar prop `requiredPermission` y redirigir a `/unauthorized` si falla. |
| `components/CartTicket.tsx` | Actualizado: valida `sales.create` para habilitar/deshabilitar el botón COBRAR. |
| `components/ProductCard.tsx` | Componente `ProductCard` . Imagen, nombre, precio, botón "AGREGAR ". |
| `components/ProductGrid.tsx` | Componente `ProductGrid` . Grid responsive y estados de carga/error. |
| `components/CartTicket.tsx` | Componente `CartTicket` . Panel lateral con header, lista de items, controles, total y botón COBRAR. |
| `components/PaymentModal.tsx` | Componente `PaymentModal` . Modal a pantalla completa, selección de método, teclado numérico, cálculo de cambio. |
| `components/ProtectedRoute.tsx` | Wrapper para proteger rutas. Usa `useAuth` para validar JWT y redirige a `/login` si expira. |
| `components/AlphanumericKeyboard.tsx` | Teclado virtual QWERTY + números. Solo visible en dispositivos táctiles, layout de 2 columnas. |
| `components/TerminalConfigModal.tsx` | Modal para configurar el `terminal_id` en primera ejecución o si la validación falla. |
| `pages/POSPage.tsx` | Componente `POSPage` . Layout principal con `ProductGrid` y `CartTicket` . Integra hooks de terminal, red y sync queue. |
| `pages/LoginPage.tsx` | Componente `LoginPage` . Formulario de auth, manejo de errores inline, integración con teclado virtual. |
| `App.tsx` | Root component. Envuelve la app en `BrowserRouter` y define rutas ( `/login` , `/` ). |

📂 BACKEND ( `backend/` )
| Archivo | Propósito / Claves |
|---|---|
| `cmd/api/main.go` | Entry point. Inicializa DB, configura router, aplica middlewares, graceful shutdown. |
| `internal/config/config.go` | Carga `infra/.env` vía `godotenv` . Exporta struct `Config` . |
| `internal/database/db.go` | Inicializa conexión PostgreSQL vía `pgxpool` . |
| `internal/middleware/cors.go` | Función `CORS(next http.Handler)` . Maneja headers CORS y preflight. |
| `internal/middleware/auth.go` | Middleware `Auth(jwtSecret)` y `RequirePermission(perm)` . Helper `GetClaimsFromContext()` . |
| `internal/middleware/security.go` | Función `SecurityHeaders(next http.Handler)` . Aplica CSP, X-Frame-Options, X-Content-Type-Options, etc. |
| `internal/response/response.go` | Helpers `Success(w, data, status)` y `Error(w, msg, code, status)` . |
| `internal/router/router.go` | Centraliza rutas. Inyecta dependencias. Registra `/health` , `/api/login` , `/api/products` , `/api/terminals/validate` , `/api/sales` . Envuelto en `SecurityHeaders` . |
| `internal/models/user.go` | Structs `User` , `LoginRequest` , `LoginResponse` . `credential_hash` con `json:"-"` . |
| `internal/repositories/user_repository.go` | `GetUserByUsername(ctx, username)` : Query con `ARRAY_AGG` para permisos. `UpdateLastLogin` . |
| `internal/services/auth_service.go` | `Login(ctx, req)` : Valida con bcrypt, genera JWT (24h) con claims. |
| `internal/handlers/auth.go` | Handler `POST /api/login` . Valida método, decodifica JSON, llama al service, retorna token o error 401. |
| `internal/handlers/products.go` | Handler `GetProducts(pool)` . Query a DB, mapeo a struct `Product` , respuesta estandarizada. |
| `internal/handlers/terminal.go` | Handler `ValidateTerminal(pool)` . Verifica existencia y estado activo de un `terminal_id` en la BD. |
| `internal/models/sale.go` | Structs `SaleRequest` , `SaleItemReq` , `SalePaymentReq` , `SaleResponse` . |
| `internal/repositories/sale_repository.go` | `CreateSale(ctx, req)` : Transacción atómica (inserta venta, items, pagos, actualiza stock y registra `inventory_movements` ). Lee `card_commission_rate` de `settings` . |
| `internal/services/sale_service.go` | `SaleService` : Capa de orquestación que delega la transacción al repositorio. |
| `internal/handlers/sale.go` | Handler `POST /api/sales` . Validación manual de payload (totales, cantidades, métodos de pago). |
| `internal/repositories/report_repository.go` | Query robusta con CTEs para calcular totales, costos y comisiones del día sin duplicar filas. |
| `internal/handlers/report.go` | Handler `GET /api/reports/daily-summary`. Valida claims y retorna `DailySummary`. |
| `internal/router/router.go` | Actualizado: Ruta de reportes protegida por `Auth` + `RequirePermission("cashier.daily_report")`. |

## 🏗️ 8. Notas de Arquitectura y Estructura de Carpetas (Fuente de Verdad)

⚠️ REGLA: Respetar esta estructura para evitar archivos desordenados. Siempre preguntar por la estructura actual del archivo a modificar.
(Frontend: `assets/` , `components/` , `hooks/` , `lib/` , `pages/` , `services/` , `types/` )
(Backend: `cmd/api/` , `internal/config/` , `internal/database/` , `internal/handlers/` , `internal/middleware/` , `internal/models/` , `internal/repositories/` , `internal/response/` , `internal/router/` , `internal/services/` )

## 🔐 9. Notas Generales (Durante el desarrollo)

Autenticación: RBAC completo. Login: `username` + `PIN`/`password`. `credential_hash` NUNCA viaja en API. JWT: 24 horas. `JWT_SECRET` en `infra/.env`. Validación de expiración client-side con `jwt-decode`.
Empleados vs Usuarios: Tabla `employees` (RH) independiente de `users` (Auth). `full_name` en `users` es nombre corto para UI.
`terminal_id`: Propiedad del dispositivo. Se gestiona vía `localStorage` + validación contra tabla `terminals` en backend. Si falla (404), se fuerza reconfiguración. Si hay error de red, se usa caché local (offline).
Base de Datos:`.env` en `infra/`. Extensión `pgcrypto` habilitada.
Frontend: Tailwind CSS v3. Imágenes de productos: URLs del servidor local (`http://localhost:8080` o `http://192.168.10.101:8080`). Puertos: Backend `8080`, Frontend dev `5173`, Postgres `5432`.
UX/UI: Modal de Pago a pantalla completa. Teclado numérico ≥80px. Carrito: Botón "Vaciar", pantalla de éxito 3s. Indicador visual de red (online/offline) y contador de sincronización.
Regla de negocio Beta: Un solo método de pago por venta. Comisión terminal: 4.1%.
