# Arquitectura de Pruebas Cypress

## Estructura de Pruebas

```
cypress/
├── e2e/
│   ├── 01-authentication.cy.js      # Pruebas de login/logout
│   ├── 02-access-control.cy.js      # Pruebas de permisos y roles
│   ├── 03-crud-operations.cy.js     # Pruebas CRUD de WODs/Records/Members
│   └── 04-integration-flows.cy.js   # Flujos completos de integración
├── fixtures/
│   ├── user.json                    # Datos de prueba para usuarios
│   └── wods.json                    # Datos de prueba para WODs
├── support/
│   ├── commands.js                  # Comandos personalizados
│   └── e2e.js                      # Configuración global
└── cypress.config.js               # Configuración principal
```

## Pruebas Implementadas

### 1. Autenticación (01-authentication.cy.js)
- Página de login funcional
- Validación de campos requeridos
- Login exitoso para entrenador
- Login exitoso para atleta
- Logout funcional
- Redirección a rutas protegidas
- Registro de nuevos usuarios

### 2. Control de Acceso (02-access-control.cy.js)
- Protección de rutas sin autenticación
- Permisos específicos por rol de entrenador
- Permisos específicos por rol de atleta
- Página de acceso denegado
- Navegación con query parameters
- Guards de navegación en tiempo real

### 3. Operaciones CRUD (03-crud-operations.cy.js)
- CRUD completo de WODs (solo entrenadores)
- CRUD de Records (ambos roles con diferentes permisos)
- CRUD de Members (solo entrenadores)
- Validaciones de formularios
- Manejo de errores

### 4. Flujos de Integración (04-integration-flows.cy.js)
- Flujo completo del entrenador
- Flujo completo del atleta
- Colaboración entre roles
- Recuperación de errores
- Navegación y estado de la aplicación

## Comandos Personalizados

```javascript
// Login como entrenador
cy.loginAsTrainer()

// Login como atleta
cy.loginAsAthlete()

// Crear WOD
cy.createWod({ name, type, description })

// Crear Record
cy.createRecord({ wodName, result, notes })

// Verificar acceso denegado
cy.shouldShowAccessDenied()

// Mock del backend
cy.mockBackend()
```

## Configuración del Entorno

### Variables de Entorno
- `baseUrl`: http://localhost:8080 (Frontend)
- `apiUrl`: http://localhost:3000 (Backend API)
- `testUser.trainer`: carlos@box.com / password123
- `testUser.athlete`: ana@correo.com / password123

### Configuración de Viewports
- Desktop: 1280x720
- Mobile: 375x667
- Tablet: 768x1024

## Estrategia de Mocking

Las pruebas utilizan `cy.intercept()` para simular respuestas del backend:

- **Autenticación**: Mock de login/logout/verificación de token
- **Datos**: Mock de WODs, Records, Members
- **Errores**: Simulación de errores de red y validación
- **Estados**: Mock de diferentes estados de la aplicación

## Integración con CI/CD

Las pruebas están preparadas para ejecutarse en:
- GitHub Actions
- GitLab CI
- Jenkins
- Azure DevOps

Ejemplo para GitHub Actions:
```yaml
- name: E2E Tests
  run: |
    npm run serve &
    npx wait-on http://localhost:8080
    npx cypress run
```
