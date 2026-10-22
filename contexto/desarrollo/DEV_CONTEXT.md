# 🛠️ Contexto de Desarrollo (DEV_CONTEXT)
**Fecha de creación:** 23 de Octubre de 2026
**Fase actual:** Desarrollo Activo
**Sprint en curso:** Sprint 1 - Fundación
**Fuente de verdad de negocio:** `21102026.md` (No modificar desde aquí)

## 🧭 0. Reglas de Desarrollo
1. **Un tema a la vez:** No avanzar al siguiente archivo/módulo hasta que el actual compile/pase pruebas.
2. **Cero ruido:** No mostrar código ni tablas de temas que no se estén discutiendo activamente.
3. **Commits atómicos:** Un commit por funcionalidad o archivo lógico completado.
4. **El usuario marca el ritmo:** No asumir el siguiente paso ni autocompletar tareas no solicitadas.
5. **Formato de actualización:** Si el archivo crece, dividirlo en partes para evitar errores de copiado.

## 🚀 1. Sprint 1: Fundación (Objetivos)
- [ ] **1.1** Inicialización de repositorio y estructura base (Backend Go + Frontend React/Vite).
- [ ] **1.2** Configuración de infraestructura local (Docker + PostgreSQL 16).
- [ ] **1.3** Despliegue del esquema completo de PostgreSQL (Tablas ya definidas en `21102026.md`).
- [ ] **1.4** Seed inicial de 20 productos con fotos y stock para pruebas.

## ️ 2. Stack Técnico (Decisiones de Implementación)
| Capa | Tecnología | Versión / Detalle |
|---|---|---|
| **Backend** | Go | 1.23+ (Router `net/http` nativo, sin frameworks) |
| **Frontend** | React + Vite | React 18, TypeScript, Tailwind CSS |
| **Estado/Offline** | Dexie.js | Wrapper de IndexedDB para cola de sincronización |
| **Base de Datos** | PostgreSQL | 16 (Alpine en Docker) |
| **Gestor Paquetes** | pnpm | Frontend (por seguridad y velocidad) |
| **Contenedores** | Docker Compose | Para orquestar PostgreSQL localmente |

## 📝 3. Bitácora de Progreso (Changelog)
| Fecha | Tarea Completada | Detalles / Archivos |
|---|---|---|
| 23-Oct-2026 | Estructura de Repo e Infraestructura DB | Creadas carpetas `backend/`, `frontend/`, `infra/`, `contexto/`. Configurado `docker-compose.yml` (Postgres 16), `.env.example`, `.gitignore` y `README.md`. |

## ️ 4. Temas Pendientes / Bloqueantes
- [ ] **Schema SQL:** Crear el archivo `infra/sql/001_schema.sql` con las 7 tablas definidas en la fase de planeación.
- [ ] **Seed Data:** Crear script `infra/sql/002_seed.sql` con 20 productos de prueba.
- [ ] **Scaffolding Backend:** Inicializar módulo de Go (`go mod init`) y estructura de carpetas (cmd, internal, etc.).
- [ ] **Scaffolding Frontend:** Inicializar proyecto Vite con React + TS y configurar Tailwind.

## 📌 5. Notas de Arquitectura (Durante el desarrollo)
- *Nota:* Las imágenes de los productos en la Beta se manejarán como URLs que apuntan al servidor local de Go. El seed inicial usará placeholders o URLs de imágenes públicas para no complicar el setup inicial.
- *Nota:* El puerto de Postgres se expone en el `5432` por defecto. Si hay conflicto, se cambiará en el `.env`.