# my-first-vue-app

Frontend Vue.js para la gestión y visualización de WODs, miembros y records, integrado con la API CrossFit WOD y autenticación JWT.

---
## 📋 Resumen Ejecutivo

- Visualización y gestión de WODs
- Paneles diferenciados para entrenador y atleta
- Autenticación JWT y roles
- Testing E2E con Cypress
- UI responsive y validación de formularios

---
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

---
## Estructura principal

- `src/App.vue`: Componente principal
- `src/components/`: Componentes reutilizables
- `src/services/`: Servicios para consumir la API y autenticación
- `src/stores/`: Estado global con Pinia
- `src/router.js`: Rutas protegidas por roles

---
## Testing

- Pruebas E2E con Cypress:
  ```sh
  npm run cypress:open
  ```
- Archivos de pruebas en `cypress/e2e/`
- Comandos personalizados y mocks implementados

---
## Mejoras Futuras

- [ ] Mejoras de UX/UI
- [ ] Documentación de componentes
- [ ] Despliegue en Netlify/Vercel

---
## Contribución

1. Fork y rama para tu mejora
2. Commit y push
3. Pull Request

---
Consulta la [Guía de Desarrollo](../../Informe_Desarrollo.md) y el README global para más detalles y buenas prácticas.
