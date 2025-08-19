// Middleware para verificar rol de usuario
module.exports = function (roles = []) {
    // roles: array de roles permitidos
    // normalize roles
    if (typeof roles === 'string') roles = [roles];
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !user.role) {
                return res.status(403).json({ message: 'Role not present' });
            }
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({ message: 'Insufficient role' });
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Role verification failed' });
        }
    };
};
