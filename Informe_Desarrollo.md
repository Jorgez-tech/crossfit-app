# Informe y Guía de Desarrollo


## 1. Objetivo y Alcance


### 1.1 Propósito del Proyecto
El propósito de Crossfit-app es ofrecer una plataforma integral para la gestión y consulta de entrenamientos (WODs), miembros y records de un box de CrossFit. Busca digitalizar y centralizar la información clave para entrenadores y atletas, facilitando el acceso, la organización y el seguimiento del progreso.


### 1.2 Problemas que Resuelve
- Dificultad para registrar y consultar WODs históricos y actuales.
- Falta de seguimiento centralizado de records y progresos de los miembros.
- Necesidad de una interfaz sencilla para que entrenadores y atletas accedan a la información relevante.
- Ausencia de integración entre frontend y backend en soluciones tradicionales.


### 1.3 Usuarios Objetivo
- Entrenadores de CrossFit que gestionan rutinas, miembros y resultados.
- Atletas que desean consultar WODs, registrar sus marcas y ver su progreso.
- Administradores de box que buscan digitalizar la operación y mejorar la experiencia de sus usuarios.


## 2. Estructura y Arquitectura

La solución está organizada como un monorepo para facilitar el desarrollo, la integración y el despliegue conjunto de backend y frontend.

### 2.1 Monorepo
- Carpeta raíz: `crossfit-app/`
- Subcarpetas principales:
  - `api/`: Contiene el backend Express (Node.js), responsable de la lógica de negocio, gestión de datos y exposición de la API REST.
  - `frontend/`: Contiene la aplicación Vue.js, encargada de la interfaz de usuario y la interacción con la API.

### 2.2 Scripts Compartidos
- En la raíz se definen scripts globales (por ejemplo, `npm run dev`) usando herramientas como `concurrently` para levantar backend y frontend en paralelo.
- Los scripts permiten iniciar ambos servicios fácilmente y centralizan tareas comunes.

### 2.3 Configuración de CORS y Proxy
- El backend Express está configurado con CORS para aceptar peticiones del frontend en desarrollo (`http://localhost:8080`).
- El frontend puede usar un proxy (configurable en `vue.config.js`) para redirigir peticiones API durante el desarrollo, evitando problemas de CORS y facilitando la integración local.

Esta arquitectura permite un flujo de trabajo ágil, escalable y fácilmente integrable con herramientas de CI/CD y despliegue moderno.

## 2.4 Testing E2E con Cypress

### Configuración de Cypress
- **Framework:** Cypress 15.0.0 configurado para pruebas E2E
- **Configuración:** `cypress.config.js` con baseUrl configurable
- **Scripts NPM:** 
  - `cy:open` - Modo interactivo
  - `cy:run:auth` - Ejecutar solo pruebas de autenticación
  - `test:e2e` - Ejecutar todas las pruebas E2E

### Estructura de Pruebas
- `00-basic-functionality.cy.js` - Pruebas básicas de funcionamiento
- `01-authentication.cy.js` - Pruebas de autenticación y navegación
- `02-access-control.cy.js` - Control de acceso por roles
- `03-crud-operations.cy.js` - Operaciones CRUD
- `04-integration-flows.cy.js` - Flujos de integración completos

### Comandos Personalizados
- `loginAsTrainer()` - Login automático como entrenador
- `loginAsAthlete()` - Login automático como atleta
- `mockBackend()` - Configuración de interceptors para mocks
- `checkTrainerUI()` / `checkAthleteUI()` - Validación de elementos UI por rol

### Elementos data-cy Implementados
Todos los componentes principales cuentan con atributos `data-cy` para facilitar las pruebas automatizadas y garantizar la estabilidad de los tests.

## 3. Fases de Desarrollo

## 3. Fases de Desarrollo

### Fase 1: Prototipado y validación ✅ COMPLETADO
- Implementación base de API y frontend
- Pruebas de endpoints y navegación
- Demo funcional

### Fase 2: Unificación y mejora estructural ✅ COMPLETADO
- Integración completa frontend-backend
- Mejoras en la arquitectura y navegación
- Sistema de autenticación JWT implementado

### Fase 3: Testing E2E y Atributos data-cy 🔄 EN PROGRESO
- **✅ COMPLETADO:** Configuración de Cypress para pruebas E2E
- **✅ COMPLETADO:** Agregados atributos data-cy a componentes principales:
  - TrainerDashboard: `data-cy="trainer-dashboard"`, `data-cy="welcome-message"`, `data-cy="create-wod-button"`, `data-cy="manage-members-link"`, `data-cy="trainer-stats"`
  - AthleteDashboard: `data-cy="athlete-dashboard"`, `data-cy="welcome-message"`, `data-cy="record-button"`, `data-cy="athlete-stats"`
  - App.vue: Navegación condicional por autenticación, `data-cy="user-menu"`, `data-cy="logout-button"`
  - LoginComponent: Formularios con atributos data-cy completos
- **✅ COMPLETADO:** Optimización de interceptors de Cypress
- **🔄 PARCIAL:** Algunos tests básicos aún requieren ajustes adicionales

### Fase 4: Documentación API con Swagger 📋 PENDIENTE
- Migración a monorepo
- Configuración de scripts y documentación
- Integración de CI/CD

### Fase 3: Autenticación y seguridad
- Registro/login con JWT
- Validación y roles

### Fase 4: Integración de base de datos
- Migración de db.json a SQL
- Implementación de ORM

### Fase 5: Despliegue y hosting
- Separado (Netlify/Vercel, Railway/Render)
- Conjunto (Docker, Nginx, VPS)

### Fase 6: Escalabilidad y persistencia
- Filtrado, paginación, búsqueda
- Documentación con Swagger
- Monitoreo/logging


## 4. Estado Actual y Próximos Pasos

- [x] Prototipo funcional
- [x] Navegación y consumo de API
- [x] Estructura de componentes
- [x] Migración a monorepo
- [x] Documentación y scripts compartidos
  - Se consolidaron los README: uno global en la raíz, uno para frontend y uno para backend, cada uno con instrucciones específicas.
  - Se eliminaron archivos y componentes innecesarios para mantener el repositorio limpio.
- [x] Autenticación
- [x] Base de datos relacional
- [ ] Despliegue conjunto

## 5. Decisiones Técnicas y Justificación

- Uso de monorepo para facilitar desarrollo y CI/CD
- Proxy y CORS para desarrollo ágil
- Base de datos al final para validar primero la lógica

## 6. Checklist de Funcionalidades y Pruebas



> Actualiza este informe en cada fase para mantener el seguimiento y facilitar la colaboración.

## 7. Roadmap de Implementación y Próximos Pasos

### Objetivos generales

- Plataforma web para gestión de entrenamientos, miembros y progreso en un box de CrossFit.
- Acceso diferenciado para entrenadores (gestión) y atletas (consulta y registro de avances).
- Seguridad, escalabilidad y facilidad de uso desde el MVP.

### Fases y tareas clave

**Fase 1: Diseño de Datos y Modelos**
- Definir modelos de datos: Usuario (entrenador/atleta), WOD, Progreso/Record.
- Diagramar relaciones (ERD).
- Elegir base de datos (SQLite para desarrollo, PostgreSQL para producción).

**Fase 2: Backend (API RESTful con Node.js/Express)**
- Registro y login con JWT.
- Middleware de autenticación y autorización por rol.
- Endpoints: registro, login, CRUD de WODs, registro de avances.
- Validación de datos y manejo de errores.
- Documentar API.

**Fase 3: Frontend (Vue.js 3 + Pinia)**
- Servicios para consumir la API (authService, wodService, progressService).
- Componentes: login/registro, panel de entrenador, panel de atleta.
- Guards de rutas según rol.
- Manejo de estado global.

**Fase 4: Pruebas e Integración Continua**
- Pruebas unitarias y de integración.
- Pruebas E2E de flujos críticos.
- Configuración de CI.

**Fase 5: Despliegue**
- Configuración de entornos.
- Despliegue backend y frontend.
- Documentación de despliegue.

### Checklist de entregables y hitos

**Fase 1:**
- [x] Modelos de datos y ERD
- [x] Esquema de base de datos y datos de prueba
### Avance reciente

✔️ Se completó la definición de modelos, el ERD, la migración a base de datos relacional y la carga de datos de prueba mediante seeds y migraciones automatizadas.

**Cambios recientes (registro):**
- refactor: `Member`, `Record` y `Workout` migrados de `db.json` a consultas con `knex` (commits 784b0da, c0eb447, f9a6cdc)
- feat: implementación completa de autenticación JWT con roles (commit 35f79d6)
- seguridad: se eliminaron credenciales/valores por defecto del código (JWT y contraseñas); usar `.env` local para variables sensibles (commits cb1a7d1, 44defbd)
- limpieza: se eliminó `src/database/utils.js` y las referencias a `db.json`; el proyecto usa Knex/SQLite en desarrollo (commit fcb7795)
- chore: configuración de .gitignore para artefactos de build, archivos .env y bases de datos (commit 2cb77ba)

**Pruebas / Smoke test (registro):**
- Fecha: 2025-08-19
- Prueba: seed reproducible -> login como `carlos@box.com` -> creación de WOD protegido por rol `entrenador`.
- Resultado: OK. Login devolvió token y la creación del WOD respondió 201 con el registro creado (ej. id: 3).
- Scripts usados: `scripts/run_seed_and_check.js`, `scripts/smoke_test.js` (ubicados en `api/crossfit-wod-api/scripts`).

**Avance Completado (2025-08-22):**
✔️ **Migración completa a base de datos relacional**: Todos los modelos (Member, Record, Workout) ahora usan Knex.js con SQLite en desarrollo.
✔️ **Sistema de autenticación JWT completo**: Registro, login, middleware de autenticación y autorización por roles implementados.
✔️ **Seguridad mejorada**: Eliminación de credenciales hardcodeadas, uso obligatorio de variables de entorno.
✔️ **Limpieza de código**: Eliminación de archivos obsoletos (db.json, utils.js) y actualización de documentación.
✔️ **Configuración de proyecto**: .gitignore actualizado para excluir artefactos de build y archivos sensibles.

**Avance de Integración Frontend Completado (2025-08-22):**
✔️ **Integración completa con autenticación JWT**: Frontend Vue.js completamente integrado con el backend autenticado.
✔️ **Servicios de autenticación**: `authService.js` implementado con localStorage, registro, login y logout.
✔️ **Cliente API con interceptors**: `api.js` configurado con interceptors automáticos para JWT tokens.
✔️ **Sistema de estado global**: Stores de Pinia para auth, wods, members y records con actions completas.
✔️ **Guards de navegación**: Router configurado con protección de rutas por autenticación y roles.
✔️ **Componentes completos implementados**:
  - `LoginComponent.vue`: Formularios de login/registro con validación y roles
  - `Dashboard.vue`: Panel principal con estadísticas y navegación contextual
  - `WodsList.vue`: CRUD completo de WODs con autenticación y gestión por roles
  - `MembersList.vue`: Gestión completa de miembros para entrenadores con filtros y búsqueda
  - `RecordsList.vue`: Sistema completo de records con filtros avanzados y CRUD
✔️ **UI responsive**: Diseño adaptativo para dispositivos móviles con validación de formularios.
✔️ **Roles diferenciados**: Funcionalidades específicas para entrenadores (gestión completa) y atletas (acceso limitado).

**Estado actual**: La rama `feature/auth-jwt` contiene una aplicación full-stack completamente funcional con autenticación JWT, base de datos relacional, frontend integrado y roles diferenciados. Lista para pruebas E2E y posible merge a main.





**Fase 2:**
- [x] Endpoints de autenticación (registro y login con JWT)
- [x] CRUD WODs con autenticación y roles
- [x] Middleware de roles y seguridad
- [ ] Documentación de API

✔️ Se implementaron los endpoints de autenticación (registro y login) usando JWT y bcrypt, integrados con la base de datos relacional.
✔️ Se aplicaron middlewares de autenticación y autorización por roles a todas las rutas protegidas.
✔️ Migración completa de la capa de datos de JSON a base de datos relacional con Knex.js.

**Fase 3:**
- [x] Servicios frontend y componentes clave
- [x] Rutas protegidas y paneles por rol
- [x] Integración completa

✔️ Se implementaron todos los servicios frontend (authService, api service con interceptors).
✔️ Se crearon todos los componentes principales con autenticación y CRUD completo.
✔️ Se configuraron rutas protegidas con guards de navegación y roles diferenciados.
✔️ Integración full-stack completamente funcional con autenticación JWT.

**Fase 4:**
- [ ] Tests unitarios y E2E
- [ ] CI configurado

**Fase 5:**
- [ ] App desplegada
- [ ] Documentación de despliegue

### Recomendaciones y buenas prácticas

- Mantener el MVP simple: primero autenticación, roles y flujo básico de WODs y progreso.
- Usar JWT para autenticación y roles, y bcrypt para passwords.
- Documentar modelos y endpoints desde el inicio.
- Priorizar la experiencia de usuario: navegación clara, feedback visual, formularios validados.
- Revisar y ajustar el roadmap según feedback real.

---
Actualiza este roadmap y checklist en cada fase para mantener el seguimiento y facilitar la colaboración.
