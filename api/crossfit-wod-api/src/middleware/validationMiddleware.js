// Middleware utilitario para validar payloads con Joi
function validationMiddleware(schema, property = 'body') {
    return (req, _res, next) => {
        const data = req[property];
        const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });

        if (error) {
            const details = error.details.map(detail => detail.message);
            return next({ status: 400, message: 'Datos inválidos', details });
        }

        req[property] = value;
        return next();
    };
}

module.exports = validationMiddleware;
