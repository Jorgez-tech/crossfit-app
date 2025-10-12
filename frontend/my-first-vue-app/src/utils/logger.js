/* eslint-disable no-console */
const log = (level, context, message, payload) => {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${context}]`;

    if (payload !== undefined) {
        console[level](prefix, message, payload);
    } else {
        console[level](prefix, message);
    }
};

const logger = {
    debug(context, message, payload) {
        if (process.env.NODE_ENV === 'production') {
            return;
        }
        log('log', context, message, payload);
    },
    info(context, message, payload) {
        log('info', context, message, payload);
    },
    warn(context, message, payload) {
        log('warn', context, message, payload);
    },
    error(context, message, payload) {
        log('error', context, message, payload);
    },
    scoped(context) {
        return {
            debug: (message, payload) => logger.debug(context, message, payload),
            info: (message, payload) => logger.info(context, message, payload),
            warn: (message, payload) => logger.warn(context, message, payload),
            error: (message, payload) => logger.error(context, message, payload)
        };
    }
};

export default logger;
