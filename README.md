# Crossfit App

Plataforma full-stack para la gestión de entrenamientos, miembros y records en un box de CrossFit.

## Documentación

La documentación detallada del proyecto se encuentra en la carpeta `docs/`:

- **[Guía de Inicio Rápido](docs/guides/quick_start.md)**: Instrucciones para levantar el proyecto en 5 minutos.
- **[Historia del Desarrollo](docs/history/development_history.md)**: Hitos, decisiones técnicas y evolución del proyecto.
- **[Estándares de UI](docs/guides/ui_standards.md)**: Sistema de diseño y componentes visuales.
- **[Testing](docs/testing/general_testing.md)**: Guías para pruebas E2E con Cypress.

## Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd crossfit-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   cd api/crossfit-wod-api && npm install
   cd ../../frontend/my-first-vue-app && npm install
   ```

3. **Iniciar desarrollo:**
   Desde la raíz del proyecto:
   ```bash
   npm run dev
   ```
   - API: `http://localhost:3000`
   - Frontend: `http://localhost:8080`

Para más detalles, consulta la [Guía de Inicio Rápido](docs/guides/quick_start.md).

## Estructura del Proyecto

- `api/`: Backend Express (Node.js) + SQLite
- `frontend/`: Frontend Vue.js 3 + Pinia
- `docs/`: Documentación del proyecto

## Estado del Proyecto

**MVP Funcional Completado**
- Autenticación JWT y Roles (Entrenador/Atleta)
- Gestión completa de WODs, Miembros y Records
- Testing E2E con Cypress
- UI/UX Profesional y Responsive

---
> Desarrollado para la comunidad de CrossFit.