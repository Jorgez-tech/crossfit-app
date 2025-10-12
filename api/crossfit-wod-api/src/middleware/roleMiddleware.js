// Middleware para verificar rol de usuario
module.exports = function (roles = []) {
    // roles: array de roles permitidos
    // normalize roles
    if (typeof roles === 'string') roles = [roles];
    return (req, _res, next) => {
        try {
            const user = req.user;
            if (!user || !user.role) {
                return next({ status: 403, message: 'Role not present' });
            }
            if (roles.length && !roles.includes(user.role)) {
                return next({ status: 403, message: 'Insufficient role' });
            }
            next();
        } catch (error) {
            return next({ status: 500, message: 'Role verification failed' });
        }
    };
};
