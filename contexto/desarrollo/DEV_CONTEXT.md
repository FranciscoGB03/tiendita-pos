️ Contexto de Desarrollo (DEV_CONTEXT)
Fecha de última actualización: 25 de Octubre de 2026
Fase actual: Desarrollo Activo - Sprint 2
Sprint completado: Sprint 1 - Fundación
Fuente de verdad de negocio: `21102026.md`

 0. Reglas de Desarrollo
- Un tema a la vez: No avanzar al siguiente archivo/módulo hasta que el actual compile/pase pruebas.
- Cero ruido: No mostrar código ni tablas de temas que no se estén discutiendo activamente.
- Commits atómicos: Un commit por funcionalidad o archivo lógico completado.
- El usuario marca el ritmo: No asumir el siguiente paso ni autocompletar tareas no solicitadas.
- Formato de actualización: Si el archivo crece, dividirlo en partes para evitar errores de copiado.

1. Sprints (Estado)
[x] Sprint 1: Fundación (Repo, DB, Backend Go, Frontend React/Vite). ✅ CERRADO
[ ] Sprint 2: Pantalla de cobro responsive (Grid, Carrito, API Productos).

️ 2. Stack Técnico (Decisiones de Implementación)
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

3. Bitácora de Progreso (Changelog)
| Fecha       | Tarea Completada                | Detalles / Archivos                                   |
| ----------- | ------------------------------- | ----------------------------------------------------- |
| 25-Oct-2026 | Definición Arquitectura Backend | Establecido patrón Handler → Service → Repository → Model + middleware, router, response. |
| 25-Oct-2026 | API Backend (Productos)         | Endpoint `GET /api/products` operativo y probado con `curl`. |
| 25-Oct-2026 | Cliente HTTP Frontend           | Wrapper `api.ts` en `frontend/src/lib/` con genéricos `<T>`. |
| 25-Oct-2026 | Estructura carpetas Frontend    | Creadas `components/`, `hooks/`, `lib/`, `pages/`, `services/`, `types/`. |
| 23-Oct-2026 | Sprint 1 Cerrado                | Commit inicial, estructura base, DB, Backend y Frontend operativos. |

️ 4. Temas Pendientes / Bloqueantes (Sprint 2)
[x] Estructura de carpetas Frontend. ✅
[x] Cliente HTTP Frontend. ✅
[x] API Backend (Productos): Endpoint `GET /api/products`. ✅
[ ] Grid de Productos: Pintar los 20 productos del seed con imágenes en la UI.
[ ] Carrito Básico: Lógica para agregar, quitar y cambiar cantidades.
[ ] Autenticación: Endpoint de Login, tabla de usuarios y middleware JWT.

5. Notas de Arquitectura y Estructura de Carpetas (Fuente de Verdad)
⚠️ REGLA: Respetar esta estructura para evitar archivos desordenados o lógica mezclada.

📂 FRONTEND (`frontend/src/`)
├── assets/       # Imágenes estáticas, iconos, fuentes.
├── components/   # Componentes UI reutilizables (ej. `ProductCard.tsx`, `CartButton.tsx`).
├── hooks/        # Custom hooks de React (ej. `useCart.ts`, `useProducts.ts`).
├── lib/          # Utilidades y configuraciones (ej. `api.ts` para el cliente HTTP).
├── pages/        # Vistas principales (ej. `POSPage.tsx`, `AdminPage.tsx`).
├── services/     # Llamadas específicas a la API (ej. `productService.ts` que usa `lib/api.ts`).
└── types/        # Definiciones de TypeScript (ej. `Product.ts`, `User.ts`).

📂 BACKEND (`backend/`)
├── cmd/
│   ── api/
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

6. Notas Generales (Durante el desarrollo)
- Seguridad: Auth vía JWT. Login con `username` corto + `pin`/`password`. `email` es solo informativo.
- `.env` vive en `infra/` y es referenciado por `docker-compose.yml` y el backend.
- Tabla `products` incluye `barcode` (único, indexado) para soporte de escáner.
- Tailwind CSS v3 forzado en frontend (la v4 cambió la configuración).
- Imágenes de productos en Beta: URLs del servidor local (`http://localhost:8080/images/...`).
- Puertos: Backend `8080`, Frontend dev `5173`, Postgres `5432`.