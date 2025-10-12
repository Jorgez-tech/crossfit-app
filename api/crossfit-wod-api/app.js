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
  origin: [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://192.168.100.8:8080',
    'http://192.168.100.8:8081'
  ],
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
