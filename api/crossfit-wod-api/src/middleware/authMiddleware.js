// Middleware para verificar JWT
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('Environment variable JWT_SECRET is required for authMiddleware');
}

module.exports = function (req, _res, next) {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next({ status: 401, message: 'Token missing or malformed' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        return next({ status: 401, message: 'Invalid or expired token' });
    }
};
