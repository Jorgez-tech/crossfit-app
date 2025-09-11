# Informe y Guía de Desarrollo
 
---
## 📋 Resumen Ejecutivo

**Estado actual:**
- Plataforma full-stack para gestión de entrenamientos, miembros y records en un box de CrossFit
- Backend Express + base de datos relacional (Knex/SQLite)
- Frontend Vue.js con autenticación JWT y roles
- Infraestructura de testing E2E con Cypress
- Documentación y scripts compartidos

**Avance general:** ~75% completado

**Próximos pasos:**
1. Refinamiento final de pruebas E2E
2. Documentación API con Swagger
3. Despliegue y CI/CD

---
## 🗺️ Roadmap Visual

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Prototipado y validación | ✔️ |
| 2 | Integración y mejora estructural | ✔️ |
| 3 | Testing E2E y data-cy | ⏳ (90%) |
| 4 | Documentación API (Swagger) | ❌ |
| 5 | Despliegue y CI/CD | ❌ |

---


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

### Fase 3: Testing E2E y Atributos data-cy ✅ PRÁCTICAMENTE COMPLETADO (90%)
- **✅ COMPLETADO:** Configuración de Cypress 15.0.0 para pruebas E2E
- **✅ COMPLETADO:** Agregados atributos data-cy a componentes principales:
  - TrainerDashboard: `data-cy="trainer-dashboard"`, `data-cy="welcome-message"`, `data-cy="create-wod-button"`, `data-cy="manage-members-link"`, `data-cy="trainer-stats"`
  - AthleteDashboard: `data-cy="athlete-dashboard"`, `data-cy="welcome-message"`, `data-cy="record-button"`, `data-cy="athlete-stats"`
  - App.vue: Navegación condicional por autenticación, `data-cy="user-menu"`, `data-cy="logout-button"`
  - LoginComponent: Formularios con atributos data-cy completos
- **✅ COMPLETADO:** Comandos personalizados de Cypress (loginAsTrainer, loginAsAthlete, mockBackend)
- **✅ COMPLETADO:** Optimización de interceptors de Cypress y navegación condicional
- **✅ COMPLETADO:** Suite completa de 5 archivos de pruebas E2E
- **✅ COMPLETADO:** Commit comprensivo (043281d) con 97 archivos, 5295 insertions
- **🔄 REQUIERE AJUSTES MENORES:** Algunas pruebas básicas necesitan refinamiento final

**Estado:** La infraestructura de testing E2E está completamente operativa. Los tests de autenticación funcionan correctamente, todos los componentes críticos tienen atributos testables, y el sistema está preparado para pruebas comprehensivas.

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
- [x] Testing E2E (90% completado - infraestructura completa, refinamiento pendiente)
- [ ] Documentación API con Swagger
- [ ] Despliegue conjunto

### 📊 Avance General del Proyecto: ~75% completado

**Próximos pasos prioritarios:**
1. **Refinamiento final de testing E2E** - Ajustar pruebas básicas restantes
2. **Implementación de Swagger** - Documentación automática de API
3. **Optimización y despliegue** - Preparación para producción

## 5. Decisiones Técnicas y Justificación

- Uso de monorepo para facilitar desarrollo y CI/CD
- Proxy y CORS para desarrollo ágil
- Base de datos al final para validar primero la lógica

## 6. Checklist de Funcionalidades y Pruebas

---
## ✅ Checklist de Funcionalidades y Pruebas

### Backend (API)
- [x] CRUD completo de WODs
- [x] CRUD completo de Members
- [x] CRUD completo de Records
- [x] Autenticación JWT
- [x] Autorización por roles
- [x] Validación de datos y manejo de errores
- [x] Migración a base de datos relacional (Knex/SQLite)
- [ ] Documentación Swagger
- [ ] Tests unitarios (Jest/Supertest)

### Frontend (Vue.js)
- [x] Login y registro de usuarios
- [x] Panel de entrenador (gestión de WODs y miembros)
- [x] Panel de atleta (consulta y registro de records)
- [x] Navegación protegida por roles
- [x] UI responsive y validación de formularios
- [x] Integración completa con API
- [ ] Mejoras de UX/UI
- [ ] Documentación de componentes

### Testing
- [x] Infraestructura Cypress E2E
- [x] Pruebas de autenticación y navegación
- [x] Pruebas de control de acceso por roles
- [x] Pruebas CRUD y flujos de integración
- [x] Comandos personalizados y mocks
- [ ] Refinamiento de pruebas básicas
- [ ] Integración de tests unitarios

---



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
- **🔄 EN PROGRESO:** Tests unitarios y E2E (90% completado - infraestructura lista)
  - ✅ Cypress configurado y operativo
  - ✅ Tests de autenticación funcionando
  - 🔧 Refinamiento de pruebas básicas pendiente
- **📋 PENDIENTE:** CI configurado

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

## Guía de Uso y Pruebas

### Guía de Uso

1. **Requisitos Previos:**
   - Asegúrate de tener Node.js y npm instalados en tu sistema.
   - Configura las variables de entorno necesarias para la conexión a la base de datos y otros servicios.

2. **Instalación:**
   - Navega al directorio raíz del proyecto.
   - Ejecuta el comando `npm install` para instalar las dependencias necesarias.

3. **Ejecución del Backend:**
   - Ve al directorio `api/crossfit-wod-api`.
   - Ejecuta `node index.js` para iniciar el servidor.

4. **Ejecución del Frontend:**
   - Ve al directorio `frontend/my-first-vue-app`.
   - Ejecuta `npm run serve` para iniciar la aplicación Vue.

5. **Acceso a la Aplicación:**
   - Abre un navegador y accede a `http://localhost:8080` para interactuar con la aplicación.

### Guía de Pruebas

1. **Pruebas Unitarias y de Integración (Backend):**
   - Ve al directorio `api/crossfit-wod-api`.
   - Ejecuta `npm test` para correr las pruebas.

2. **Pruebas End-to-End (Frontend):**
   - Ve al directorio `frontend/my-first-vue-app/cypress`.
   - Ejecuta `npm run cypress:open` para abrir la interfaz de Cypress.
   - Selecciona y ejecuta los casos de prueba disponibles.

3. **Verificación de Base de Datos:**
   - Usa el script `scripts/check_db.js` para verificar la integridad de la base de datos.

4. **Cobertura de Pruebas:**
   - Genera un reporte de cobertura ejecutando `npm run coverage` en el backend.

5. **Resolución de Problemas:**
   - Consulta los archivos `SOLUCION_PROBLEMAS.md` en los directorios correspondientes para guías de solución de errores comunes.

---

---
## 🟢 Estado de Limpieza y Avance Global (2025-09-01)

**Limpieza y validación profesional completada:**
- Se eliminaron archivos y carpetas obsoletos (db.json, seeds, migrations vacías, utils.js).
- `.gitignore` actualizado para excluir artefactos de build, archivos sensibles y carpetas de configuración.
- Validación completa de backend, frontend y suite de pruebas E2E (Cypress).
- Documentación y scripts revisados y actualizados.
- Proyecto sincronizado y mergeado en la rama principal `main`.
- Rama de limpieza global eliminada en local y remoto.

**Estado actual del proyecto:**
- Estructura profesional y limpia, sin archivos ni carpetas innecesarias.
- Todos los cambios reflejados en la rama principal y en el repositorio remoto.
- Listo para avanzar a las siguientes fases: refinamiento de pruebas, documentación Swagger y despliegue.

---

## 📝 Notas de trabajo pendiente y próxima sesión (2025-09-10)

**Actualizaciones recientes:**
- **PR #2 Implementado:** Diseño profesional y mejoras de accesibilidad completadas
  - Implementado glass-morphism con fondo semi-transparente
  - Mejoras de accesibilidad: ARIA labels, navegación por teclado, contraste
  - CSS moderno con variables personalizadas y diseño responsive
  - Archivos modificados: App.vue, HelloWorld.vue, CrossfitWods.vue
- **Problema de autenticación detectado:** Usuario admin no puede iniciar sesión
  - Error: "Error de conexión. Inténtalo de nuevo" en el frontend
  - Se agregó usuario admin al seed pero persiste el problema de conectividad

**Puntos clave para retomar:**
- Consulta el archivo `cypress-e2e-diagnosis.md` para el estado detallado de los tests E2E
- Investigar y resolver el problema de autenticación/conectividad frontend-backend
- Validar el flujo de login y comunicación entre servicios
- Continuar con refinamiento de pruebas tras resolver conectividad

> Actualiza esta sección al finalizar cada sesión para mantener el seguimiento y facilitar la colaboración.
