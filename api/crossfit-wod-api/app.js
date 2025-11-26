const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const v1RecordRouter = require("./src/v1/routes/recordRoutes");
const v1WorkoutRouter = require("./src/v1/routes/workoutRoutes");
const memberRoutes = require("./src/v1/routes/memberRoutes");
const authRoutes = require("./src/v1/routes/authRoutes");
const swaggerSpec = require('./src/docs/swagger');
const requestLogger = require('./src/middleware/requestLogger');
const errorHandler = require('./src/middleware/errorHandler');

const logger = require('./src/utils/logger');

const app = express();

// Configurar CORS para permitir conexiones desde la aplicación Vue
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origen (como curl o apps móviles)
    if (!origin) return callback(null, true);
    
    // Permitir cualquier origen local (localhost o 127.0.0.1) en cualquier puerto
    if (origin.match(/^http:\/\/localhost:\d+$/) || origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
      return callback(null, true);
    }
    
    // Permitir la IP específica de la red local
    if (origin.match(/^http:\/\/192\.168\.100\.8:\d+$/)) {
      return callback(null, true);
    }
    
    // Lista blanca explícita
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://192.168.100.8:8080',
      'http://192.168.100.8:8081'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // En desarrollo, ser permisivo
    if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Logging de cada request
app.use(requestLogger);

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de autenticación
app.use("/api/v1/auth", authRoutes);

// Rutas principales de la API
app.use("/api/v1/workouts", v1WorkoutRouter);
app.use("/api/v1/records", v1RecordRouter);
app.use("/api/v1/members", memberRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Centralized error handler
app.use(errorHandler);

logger.info('API inicializada');

module.exports = app;
