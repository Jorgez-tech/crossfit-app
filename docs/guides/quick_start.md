# Guía de Inicio Rápido (Quick Start)

Sigue estos pasos para levantar el proyecto Crossfit App en tu entorno local en menos de 5 minutos.

## Requisitos Previos
- Node.js (v14+ recomendado)
- npm

## 1. Clonar y Preparar
```bash
git clone <url-del-repo>
cd crossfit-app
npm install
```

## 2. Iniciar el Backend (API)
El backend corre en el puerto `3000`. Utiliza SQLite, por lo que no necesitas instalar una base de datos externa.

```bash
# En una terminal nueva
cd api/crossfit-wod-api
npm install
npm run migrate # Crear tablas
npm run seed    # Cargar datos de prueba
npm start       # Iniciar servidor
```

## 3. Iniciar el Frontend (Vue.js)
El frontend corre típicamente en el puerto `8080`.

```bash
# En otra terminal
cd frontend/my-first-vue-app
npm install
npm run serve
```

## 4. Acceder a la Aplicación
Abre tu navegador en: `http://localhost:8080`

### Credenciales de Prueba
| Rol | Email | Contraseña |
|-----|-------|------------|
| Entrenador | carlos@box.com | 123456 |
| Atleta | ana@box.com | 123456 |

## 5. Ejecutar Pruebas (Opcional)
Para verificar que todo funciona correctamente:

```bash
cd frontend/my-first-vue-app
npm run cy:open # Abre Cypress para pruebas E2E
```

## Solución de Problemas Comunes
- **Error de conexión:** Asegúrate de que el backend esté corriendo en el puerto 3000.
- **Base de datos:** Si tienes errores de datos, puedes reiniciar la DB borrando el archivo `.sqlite` (o `ar360.db`) y ejecutando `npm run migrate` y `npm run seed` nuevamente.
