# Historia del Desarrollo del Proyecto

Este documento consolida los hitos, desafíos y decisiones técnicas tomadas durante el desarrollo de Crossfit App.

## Resumen Ejecutivo

**Estado Final (Octubre 2025):**
- Plataforma full-stack para gestión de entrenamientos, miembros y records.
- Backend Express + Knex/SQLite.
- Frontend Vue.js 3 + Pinia.
- Testing E2E completo con Cypress.
- UI/UX profesional y responsive.

## Fases de Desarrollo

### Fase 1: Prototipado y Validación
- Implementación base de API y frontend.
- Definición de modelos de datos y ERD.
- Elección de SQLite para desarrollo.

### Fase 2: Backend y Autenticación
- Implementación de JWT y bcrypt.
- Middleware de roles (Entrenador/Atleta).
- Migración de `db.json` a base de datos relacional con Knex.
- Seguridad mejorada (variables de entorno, eliminación de credenciales hardcodeadas).

### Fase 3: Frontend e Integración
- Integración completa con API autenticada.
- Desarrollo de componentes clave: Dashboard, WodsList, RecordsList.
- Implementación de guards de navegación y gestión de estado con Pinia.

### Fase 4: Testing y Calidad
- Configuración de Cypress 15.0.0.
- Creación de comandos personalizados (`cy.loginAsTrainer`, `cy.mockBackend`).
- Implementación de atributos `data-cy` para testabilidad.
- Solución de problemas de "flakiness" en tests E2E mediante scripts de seed reproducibles.

### Fase 5: Mejoras de UI y Limpieza (Sept-Oct 2025)
- **UI Improvements:** Rediseño completo con sistema de cards, hero images responsive y mejoras de accesibilidad (ver `docs/guides/ui_standards.md`).
- **Limpieza:** Eliminación de emojis decorativos para una apariencia más profesional.
- **Consolidación:** Unificación de documentación dispersa en esta estructura organizada.

## Desafíos Superados

1.  **Convergencia Frontend-Backend:** Se alinearon los contratos de API para estandarizar respuestas (`{ status: "OK", data: ... }`), resolviendo problemas de integración en el login.
2.  **Estabilidad E2E:** Se automatizó la preparación del entorno de pruebas con scripts (`run_seed_and_check.js`) para garantizar un estado inicial consistente, eliminando falsos negativos.
3.  **Gestión de Roles:** La separación de lógica y UI para entrenadores y atletas requirió un diseño cuidadoso de los stores y guards de rutas.

## Decisiones Técnicas Clave

- **Monorepo:** Para facilitar el desarrollo full-stack y la integración continua.
- **SQLite en Desarrollo:** Para simplificar la configuración local sin dependencias externas pesadas.
- **Vue 3 + Composition API:** Para un código frontend más modular y reutilizable.
- **Cypress para E2E:** Priorizando pruebas de flujo de usuario real sobre pruebas unitarias aisladas en esta etapa.

---
*Este documento reemplaza a los antiguos `Informe_Desarrollo.md` y `FINALIZACION_PROYECTO.md`.*
