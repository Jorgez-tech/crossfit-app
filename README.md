# crossfit-app

Monorepo para la aplicación Crossfit: API (Express) y Frontend (Vue).

## Estructura del proyecto

- `api/`: Backend Express (Node.js)
- `frontend/`: Aplicación Vue.js

Cada subcarpeta contiene su propio README con detalles específicos.

## Requisitos

- Node.js >= 18.x
- npm >= 9.x

## Instalación

1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   cd crossfit-app
   ```
2. Instala las dependencias en la raíz, y luego en cada subproyecto:
   ```sh
   npm install
   cd api && npm install
   cd ../frontend && npm install
   cd ..
   ```

## Scripts globales

- `npm run dev`: Levanta API y Frontend en modo desarrollo (paralelo)
- `npm run start:api`: Solo API
- `npm run start:frontend`: Solo frontend

## Desarrollo

- Para desarrollo local, usa `npm run dev` desde la raíz.
- Para detalles sobre endpoints, variables de entorno y configuración, revisa los README de [`api/`](./api/README.md) y [`frontend/`](./frontend/README.md).

## Despliegue

Consulta los README de cada subproyecto para instrucciones de despliegue específicas.

## Estado actual y Roadmap

- [x] Prototipo funcional (API y frontend)
- [x] Navegación y consumo de API
- [x] Estructura de componentes Vue
- [ ] Migración completa a monorepo
- [ ] Documentación y scripts compartidos
- [ ] Autenticación (registro/login con JWT)
- [ ] Persistencia en base de datos relacional
- [ ] Despliegue conjunto (Docker, VPS, etc.)

## Decisiones técnicas

- Uso de monorepo para facilitar el desarrollo y CI/CD.
- Proxy y CORS configurados para desarrollo ágil entre frontend y backend.
- La integración de base de datos se realiza al final para validar primero la lógica de negocio.

---
¿Dudas? Abre un issue o revisa la documentación de cada subproyecto.

> Mantén este README y los informes de desarrollo actualizados para facilitar la colaboración.