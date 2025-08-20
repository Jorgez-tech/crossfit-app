# CrossFit WOD API

Una API RESTful completa para gestionar Workouts (WODs), Members y Records de CrossFit, desarrollada con Node.js y Express. Los datos ahora se almacenan en una base de datos relacional gestionada con Knex (SQLite en desarrollo). Inspirada en el diseño de API REST de freeCodeCamp.

## 🚀 Características

- ✅ CRUD completo para Workouts, Members y Records
- ✅ Validación de datos y manejo de errores robusto
- ✅ Estructura modular con servicios y controladores
- ✅ Respuestas JSON consistentes
- ✅ Configuración CORS para desarrollo
- ✅ Tests unitarios con Jest y Supertest
- ✅ Hot reload con Nodemon

## 📁 Estructura del Proyecto

```
crossfit-wod-api/
├── src/
│   ├── controllers/          # Lógica de los controladores
│   │   ├── workoutController.js
│   │   ├── memberController.js
│   │   └── recordController.js
│   ├── services/             # Lógica de negocio
│   │   ├── workoutService.js
│   │   ├── memberService.js
│   │   └── recordService.js
│   ├── database/             # Acceso a datos (Knex)
│   │   ├── knex.js          # instancia de Knex
│   │   ├── Workout.js
│   │   ├── Member.js
│   │   └── Record.js
│   └── v1/
│       └── routes/           # Definición de rutas
│           ├── workoutRoutes.js
│           ├── memberRoutes.js
│           └── recordRoutes.js
├── tests/                    # Tests unitarios
├── app.js                    # Configuración de Express
├── index.js                  # Punto de entrada
└── package.json
```

## ⚙️ Instalación

1. **Clona el repositorio:**
```bash
git clone <url-del-repositorio>
cd crossfit-wod-api
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Inicia el servidor en modo desarrollo:**
```bash
npm run dev
```

4. **Para producción:**
```bash
npm start
```

El servidor escuchará en `http://localhost:3000`.

## 📦 Dependencias

### Producción
- **express**: Framework web rápido y minimalista
- **body-parser**: Middleware para parsear JSON
- **cors**: Middleware para configurar CORS
- **uuid**: Generación de identificadores únicos

### Desarrollo
- **nodemon**: Auto-reload del servidor en desarrollo
- **jest**: Framework de testing
- **supertest**: Testing de APIs HTTP

## 🔗 Endpoints de la API

### Workouts

| Método | Endpoint                              | Descripción                        |
|--------|---------------------------------------|------------------------------------|
| GET    | `/api/v1/workouts`                    | Listar todos los workouts          |
| GET    | `/api/v1/workouts/:workoutId`         | Obtener un workout por ID          |
| POST   | `/api/v1/workouts`                    | Crear un nuevo workout             |
| PATCH  | `/api/v1/workouts/:workoutId`         | Actualizar un workout              |
| DELETE | `/api/v1/workouts/:workoutId`         | Eliminar un workout                |
| GET    | `/api/v1/workouts/:workoutId/records` | Listar records de un workout       |

### Members

| Método | Endpoint                              | Descripción                        |
|--------|---------------------------------------|------------------------------------|
| GET    | `/api/v1/members`                     | Listar todos los miembros          |
| GET    | `/api/v1/members/:memberId`           | Obtener un miembro por ID          |
| POST   | `/api/v1/members`                     | Crear un nuevo miembro             |
| PATCH  | `/api/v1/members/:memberId`           | Actualizar un miembro              |
| DELETE | `/api/v1/members/:memberId`           | Eliminar un miembro                |

### Records

| Método | Endpoint                              | Descripción                        |
|--------|---------------------------------------|------------------------------------|
| GET    | `/api/v1/records`                     | Listar todos los records           |
| GET    | `/api/v1/records/:recordId`           | Obtener un record por ID           |
| POST   | `/api/v1/records`                     | Crear un nuevo record              |
| PATCH  | `/api/v1/records/:recordId`           | Actualizar un record               |
| DELETE | `/api/v1/records/:recordId`           | Eliminar un record                 |

## 💡 Ejemplos de Uso

### Crear un Workout

**POST** `/api/v1/workouts`
```json
{
  "name": "Fran",
  "mode": "For Time",
  "equipment": ["barbell", "pull-up bar"],
  "exercises": [
    "21 thrusters (95/65 lb)",
    "21 pull-ups",
    "15 thrusters (95/65 lb)",
    "15 pull-ups",
    "9 thrusters (95/65 lb)",
    "9 pull-ups"
  ],
  "trainerTips": [
    "Scale the weight to complete thrusters in 1-2 sets",
    "Break up pull-ups early to maintain speed",
    "This should be a sprint - aim for sub 10 minutes"
  ]
}
```

**Respuesta:**
```json
{
  "status": "OK",
  "data": {
    "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    "name": "Fran",
    "mode": "For Time",
    "equipment": ["barbell", "pull-up bar"],
    "exercises": [
      "21 thrusters (95/65 lb)",
      "21 pull-ups",
      "15 thrusters (95/65 lb)",
      "15 pull-ups",
      "9 thrusters (95/65 lb)",
      "9 pull-ups"
    ],
    "trainerTips": [
      "Scale the weight to complete thrusters in 1-2 sets",
      "Break up pull-ups early to maintain speed",
      "This should be a sprint - aim for sub 10 minutes"
    ],
    "createdAt": "4/26/2025, 2:30:45 PM",
    "updatedAt": "4/26/2025, 2:30:45 PM"
  }
}
```

### Crear un Member

**POST** `/api/v1/members`
```json
{
  "name": "John Smith",
  "gender": "male",
  "dateOfBirth": "15/03/1990",
  "email": "john.smith@email.com",
  "password": "securePassword123"
}
```

### Crear un Record

**POST** `/api/v1/records`
```json
{
  "workout": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "record": "5:43 minutes"
}
```

### Obtener Records de un Workout

**GET** `/api/v1/workouts/a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6/records`

**Respuesta:**
```json
{
  "status": "OK",
  "data": [
    {
      "id": "rec1-id",
      "workout": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "record": "5:43 minutes"
    },
    {
      "id": "rec2-id", 
      "workout": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "record": "6:12 minutes"
    }
  ]
}
```

## 📋 Formato de Datos

### Workout
```json
{
  "id": "uuid",
  "name": "string",
  "mode": "string",
  "equipment": ["string"],
  "exercises": ["string"],
  "trainerTips": ["string"],
  "createdAt": "fecha",
  "updatedAt": "fecha"
}
```

### Member
```json
{
  "id": "uuid",
  "name": "string",
  "gender": "string",
  "dateOfBirth": "string (DD/MM/YYYY)",
  "email": "string",
  "password": "string (hashed)"
}
```

### Record
```json
{
  "id": "uuid",
  "workout": "workoutId (uuid)",
  "record": "string"
}
```

## 🧪 Testing

Ejecuta los tests unitarios:
```bash
npm test
```

Para ejecutar tests con cobertura:
```bash
npm run test:coverage
```

Los tests verifican:
- Respuestas correctas de los endpoints
- Códigos de estado HTTP apropiados
- Validación de datos de entrada
- Manejo de errores

## 🔧 Configuración CORS

La API está configurada para aceptar conexiones desde `http://localhost:8080` (ideal para desarrollo con Vue.js o React). Para cambiar esta configuración, modifica el archivo `app.js`:

```javascript
app.use(cors({
  origin: 'http://tu-dominio.com',
  credentials: true
}));
```

## ❌ Respuestas de Error

Todos los errores se devuelven con el formato consistente:
```json
{
  "status": "FAILED",
  "data": { 
    "error": "Mensaje descriptivo del error" 
  }
}
```

### Códigos de Estado HTTP
- `200` - OK (operación exitosa)
- `201` - Created (recurso creado exitosamente)
- `204` - No Content (recurso eliminado exitosamente)
- `400` - Bad Request (datos faltantes o inválidos)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)

## 🔧 Scripts Disponibles

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 🏗️ Notas de Desarrollo

- La capa de persistencia usa Knex.js; en desarrollo se utiliza SQLite (`ar360.db`).
- Las migraciones y seeds están en las carpetas `migrations/` y `seeds/`.
- Autenticación y autorización están disponibles mediante JWT y middleware en `src/middleware`.
- Para desarrollo local, usa herramientas como Postman, Insomnia o curl.
- Las contraseñas se almacenan hasheadas con bcrypt (seeds y registro usan hashing).
- El servidor soporta hot reload durante el desarrollo

## 🚀 Mejoras Futuras

- [ ] Autenticación JWT
- [ ] Encriptación de contraseñas con bcrypt
- [ ] Base de datos real (MongoDB, PostgreSQL)
- [ ] Paginación en endpoints de listado
- [ ] Filtros y búsqueda avanzada
- [ ] Rate limiting
- [ ] Logging con Winston
- [ ] Documentación con Swagger/OpenAPI
- [ ] Deployment con Docker
- [ ] Middleware de validación con Joi
- [ ] Caching con Redis

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

Desarrollado con ❤️ siguiendo el tutorial de freeCodeCamp para diseño de APIs REST.