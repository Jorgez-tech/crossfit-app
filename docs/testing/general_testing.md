# Guía General de Pruebas

Este proyecto utiliza una estrategia de pruebas integral que cubre tanto el backend como el frontend, con un fuerte enfoque en las pruebas End-to-End (E2E) para garantizar la calidad del flujo de usuario.

## Estrategia de Pruebas

### 1. Pruebas E2E (Frontend + Integración)
**Herramienta:** Cypress
**Ubicación:** `frontend/my-first-vue-app/cypress`

Las pruebas E2E son la red de seguridad principal. Simulan interacciones reales de usuarios (Entrenadores y Atletas) con la aplicación completa.

- **Cobertura:**
    - Autenticación y control de acceso (RBAC).
    - Flujos CRUD completos (WODs, Miembros, Records).
    - Validación de contratos de API.

### 2. Pruebas de Backend (API)
**Herramienta:** Jest + Supertest
**Ubicación:** `api/crossfit-wod-api/tests` (si aplica)

Verifican la lógica de negocio, la validación de datos y las respuestas de la API de forma aislada.

### 3. Verificación de Base de Datos
**Herramienta:** Scripts personalizados
**Ubicación:** `api/crossfit-wod-api/scripts`

Scripts como `check_db.js` aseguran que la integridad de los datos y la estructura de la base de datos (migraciones/seeds) sean correctas antes de ejecutar pruebas.

## Ejecución de Pruebas

### Frontend (Cypress)

**Modo Interactivo (Recomendado para desarrollo):**
```bash
cd frontend/my-first-vue-app
npm run cy:open
```

**Modo Headless (CI/CD):**
```bash
cd frontend/my-first-vue-app
npm run cy:run
```

### Backend

**Tests Unitarios/Integración:**
```bash
cd api/crossfit-wod-api
npm test
```

## Buenas Prácticas

- **Atributos de Prueba:** Utilizamos `data-cy="nombre-elemento"` en el frontend para seleccionar elementos de forma robusta en los tests, desacoplándolos de los estilos CSS.
- **Entornos Limpios:** Antes de ejecutar suites de pruebas completas, se recomienda reiniciar la base de datos (`npm run migrate` y `npm run seed` en el backend) para garantizar un estado determinista.
- **Mocking:** Cypress se utiliza tanto con backend real como con mocks (`cy.intercept`) para probar escenarios difíciles de reproducir (errores de servidor, latencia).
