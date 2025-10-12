const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const validationMiddleware = require('../../middleware/validationMiddleware');
const { registerSchema, loginSchema } = require('../../validation/authSchemas');

// Registro
router.post('/register', validationMiddleware(registerSchema), authController.register);
// Login
router.post('/login', validationMiddleware(loginSchema), authController.login);

module.exports = router;
