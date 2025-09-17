# crossfit-app

Monorepo para la aplicación Crossfit: API (Express) y Frontend (Vue).

---
## 📋 Resumen Ejecutivo

Plataforma full-stack para la gestión de entrenamientos, miembros y records en un box de CrossFit. Incluye backend Express con base de datos relacional (Knex/SQLite), frontend Vue.js con autenticación JWT y roles, y testing E2E con Cypress.

**✅ Estado: MVP Funcional** - Revisión técnica completada (Sept 2025)

---
## Estado de Limpieza y Avance Global (2025-09-01)

**Limpieza y validación profesional completada:**
- Eliminación de archivos y carpetas obsoletos (db.json, seeds, migrations vacías, utils.js).
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
## Estructura del proyecto

- `api/`: Backend Express (Node.js)
- `frontend/`: Aplicación Vue.js

Cada subcarpeta contiene su propio README con detalles específicos.

---
## Requisitos

- Node.js >= 18.x
- npm >= 9.x

---
## Instalación y Ejecución

1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   cd crossfit-app
   ```
2. Instala las dependencias en la raíz y en cada subproyecto:
   ```sh
   npm install
   cd api && npm install
   cd ../frontend && npm install
   cd ..
   ```
3. Levanta API y Frontend en modo desarrollo:
   ```sh
   npm run dev
   ```
4. Accede a la aplicación en `http://localhost:8080`

---
## Scripts globales

- `npm run dev`: Levanta API y Frontend en modo desarrollo (paralelo)
- `npm run start:api`: Solo API
- `npm run start:frontend`: Solo frontend

---
## Guía de Pruebas

- **Backend:**
  - Ejecuta `npm test` en `api/crossfit-wod-api` para pruebas unitarias/integración.
- **Frontend:**
  - Ejecuta `npm run cypress:open` en `frontend/my-first-vue-app/cypress` para pruebas E2E.
- **Base de datos:**
  - Usa `scripts/check_db.js` para verificar la integridad.
- **Cobertura:**
  - Ejecuta `npm run coverage` en el backend para reporte de cobertura.

---
## Estado actual y Roadmap

- [x] Migración completa a monorepo
- [x] Persistencia en base de datos relacional
- [x] Autenticación JWT y roles
- [x] Testing E2E con Cypress
- [x] **Revisión técnica completa (MVP funcional)**
- [x] **Fix integración frontend-backend**
- [ ] Documentación API con Swagger
- [ ] Despliegue conjunto (Docker, VPS, etc.)

**Próximos pasos:**
1. Documentación API con Swagger
2. Optimizaciones de performance
3. Despliegue y CI/CD

---
## Decisiones técnicas

- Uso de monorepo para facilitar el desarrollo y CI/CD.
- Proxy y CORS configurados para desarrollo ágil entre frontend y backend.
- Base de datos relacional para mayor robustez y escalabilidad.

---
¿Dudas? Abre un issue, revisa la documentación de cada subproyecto o consulta la [Guía de Desarrollo](./Informe_Desarrollo.md).

> Mantén este README y los informes de desarrollo actualizados para facilitar la colaboración.