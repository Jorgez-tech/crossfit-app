// Middleware para verificar rol de usuario

module.exports = function (roles = []) {
    // roles: array de roles permitidos
    return (req, res, next) => {
        // TODO: Implementar verificación de rol
        next();
    };
};
