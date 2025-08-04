// Controlador de autenticación
// Métodos: register, login


const authService = require('../services/authService');

module.exports = {
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const user = await authService.register({ name, email, password, role });
            res.status(201).json({ user });
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message || 'Error en registro' });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login({ email, password });
            res.status(200).json(result);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message || 'Error en login' });
        }
    }
};
