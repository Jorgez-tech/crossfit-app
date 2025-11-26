# CrossFit WOD API

API RESTful para la gestión de Workouts (WODs), Members y Records de CrossFit. Backend Express con base de datos relacional (Knex/SQLite), autenticación JWT y roles, y testing con Jest/Supertest.

---
## Resumen Ejecutivo

- CRUD completo para Workouts, Members y Records
- Autenticación y autorización por roles (JWT)
- Validación robusta y manejo de errores
- Testing unitario y de integración
- Documentación Swagger y scripts compartidos

---
## Instalación y Ejecución

1. Clona el repositorio:
   ```sh
   git clone <url-del-repositorio>
   cd crossfit-wod-api
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Inicia el servidor en modo desarrollo:
   ```sh
   npm run dev
   ```
4. Para producción:
   ```sh
   npm start
   ```

El servidor escucha en `http://localhost:3000`.

---
## Endpoints principales

- `/api/v1/workouts` - CRUD de WODs
- `/api/v1/members` - CRUD de miembros
- `/api/v1/records` - CRUD de records
- Autenticación y roles protegidos por JWT

Documentación interactiva disponible en `http://localhost:3000/docs` (Swagger UI). Revisa el informe de desarrollo para más contexto.

---
## Testing

- Ejecuta los tests unitarios:
  ```sh
  npm test
  ```
- Cobertura:
  ```sh
  npm run test:coverage
  ```
- Pruebas E2E: Ver carpeta Cypress en el frontend

---
## Migraciones y Seeds

- Migraciones en `migrations/`
- Seeds en `seeds/`
- Scripts para verificación en `scripts/`

---
## Mejoras Futuras

- [x] Documentación Swagger
- [ ] Paginación y filtros avanzados
- [x] Despliegue con Docker
- [x] Logging estructurado con Winston

---
## Contribución

1. Fork y rama para tu feature
2. Commit y push
3. Pull Request

---
Consulta la [Guía de Desarrollo](../../Informe_Desarrollo.md) para más detalles y buenas prácticas.