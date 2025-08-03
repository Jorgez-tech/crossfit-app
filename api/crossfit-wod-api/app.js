const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const v1RecordRouter = require("./src/v1/routes/recordRoutes");
const v1WorkoutRouter = require("./src/v1/routes/workoutRoutes");
const memberRoutes = require("./src/v1/routes/memberRoutes");

const app = express();

// Configurar CORS para permitir conexiones desde la aplicación Vue
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://192.168.100.8:8080'
  ],
  credentials: true
}));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// rutas
app.use("/api/v1/workouts", v1WorkoutRouter);
app.use("/api/v1/records", v1RecordRouter);
app.use("/api/v1/members", memberRoutes);

module.exports = app;
