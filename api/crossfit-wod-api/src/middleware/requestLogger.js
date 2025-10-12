const logger = require('../utils/logger');

function requestLogger(req, _res, next) {
    logger.info('HTTP request', {
        method: req.method,
        url: req.originalUrl,
        correlationId: req.headers['x-correlation-id'] || null,
        user: req.user ? { id: req.user.id, role: req.user.role } : undefined
    });
    next();
}

module.exports = requestLogger;
