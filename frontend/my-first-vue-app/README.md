# my-first-vue-app

Frontend Vue.js para la gestión y visualización de WODs, miembros y records, integrado con la API CrossFit WOD y autenticación JWT.

## Resumen Ejecutivo

- Visualización y gestión completa de WODs
- Paneles diferenciados para entrenador y atleta
- Autenticación JWT + roles, interceptores y guardas de ruta
- Testing E2E con Cypress (flujos CRUD, control de acceso y contratos API)
- Dockerfile listo para despliegues con Nginx

## Instalación y Ejecución

1. Instala las dependencias:

   ```sh
   npm install
   ```

2. Inicia la aplicación en modo desarrollo:

   ```sh
   npm run serve
   ```

3. Accede a `http://localhost:8080`

## Estructura principal

- `src/App.vue`: Shell principal y navegación
- `src/components/`: Componentes reutilizables (formularios, tablas, dashboards)
- `src/services/`: Cliente Axios, authService y servicios de dominio
- `src/stores/`: Stores Pinia para auth, WODs, members y records
- `src/router.js`: Rutas protegidas con guardas por rol

## Testing

- Pruebas E2E con Cypress:

  ```sh
  npm run cypress:open
  ```

- Ejecución headless:

  ```sh
  npm run cy:run
  ```

- Nuevo spec `05-api-validation.cy.js` valida contratos y errores del backend (requiere API levantada en `http://localhost:3000`).
- Comandos personalizados (`loginAsTrainer`, `mockBackend`, etc.) y fixtures reutilizables

## Docker

1. Construye la imagen de producción:

   ```cmd
   docker build -t crossfit-frontend .
   ```

2. Variables disponibles en tiempo de build:
   - `VUE_APP_API_URL` (por defecto `http://localhost:3000/api/v1`)

La imagen final sirve la SPA con Nginx y está lista para conectarse al backend publicado.

## Mejoras Futuras

- [ ] Refinar UX/UI y accesibilidad
- [ ] Documentar componentes clave (Storybook o similar)
- [ ] Automatizar despliegue en Netlify/Vercel

## Contribución

1. Fork y rama para tu mejora
2. Commit y push
3. Pull Request

Consulta la [Guía de Desarrollo](../../Informe_Desarrollo.md) y el README global para más detalles y buenas prácticas.
