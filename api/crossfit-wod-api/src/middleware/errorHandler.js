const logger = require('../utils/logger');

// Centralized error handler to standardize API error responses
function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';
    logger.error('Unhandled error', {
        status,
        message,
        stack: err.stack,
        details: err.details
    });

    res.status(status).json({
        status: 'ERROR',
        message,
        details: err.details
    });
}

module.exports = errorHandler;
