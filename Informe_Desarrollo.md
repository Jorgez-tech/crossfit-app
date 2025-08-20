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

## 3. Fases de Desarrollo

### Fase 1: Prototipado y validación
- Implementación base de API y frontend
- Pruebas de endpoints y navegación
- Demo funcional

### Fase 2: Unificación y mejora estructural
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
- [ ] Autenticación
- [ ] Base de datos relacional
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
- refactor: `Member` migrado de `db.json` a consultas con `knex` (commit 784b0da)
 - seguridad: se eliminaron credenciales/valores por defecto del código (JWT y contraseñas); usar `.env` local para variables sensibles

**Pruebas / Smoke test (registro):**
- Fecha: 2025-08-19
- Prueba: seed reproducible -> login como `carlos@box.com` -> creación de WOD protegido por rol `entrenador`.
- Resultado: OK. Login devolvió token y la creación del WOD respondió 201 con el registro creado (ej. id: 3).
- Scripts usados: `scripts/run_seed_and_check.js`, `scripts/smoke_test.js` (ubicados en `api/crossfit-wod-api/scripts`).





**Fase 2:**
- [x] Endpoints de autenticación (registro y login con JWT)
✔️ Se implementaron los endpoints de autenticación (registro y login) usando JWT y bcrypt, integrados con la base de datos relacional.
- [ ] CRUD WODs
El siguiente objetivo es proteger y mejorar el CRUD de WODs y miembros usando autenticación y roles.
- [ ] Middleware de roles y seguridad
- [ ] Documentación de API

**Fase 3:**
- [ ] Servicios frontend y componentes clave
- [ ] Rutas protegidas y paneles por rol
- [ ] Integración completa

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
