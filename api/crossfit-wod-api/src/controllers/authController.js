// Controlador de autenticación
// Métodos: register, login


const authService = require('../services/authService');
const logger = require('../utils/logger');

module.exports = {
    async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;
            const user = await authService.register({ name, email, password, role });
            res.status(201).json({
                status: "OK",
                data: { user }
            });
        } catch (error) {
            logger.warn('Register failed', { error });
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login({ email, password });
            res.status(200).json({
                status: "OK",
                data: result
            });
        } catch (error) {
            logger.warn('Login failed', { error });
            next(error);
        }
    }
};
