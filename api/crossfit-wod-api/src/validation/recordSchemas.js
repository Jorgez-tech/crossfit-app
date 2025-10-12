const Joi = require('joi');

const baseRecord = {
    user_id: Joi.number().integer().positive(),
    wod_id: Joi.number().integer().positive(),
    result: Joi.string().max(255),
    notes: Joi.string().max(500).allow('', null),
    date: Joi.date().iso().allow(null)
};

const createRecordSchema = Joi.object({
    user_id: baseRecord.user_id.required(),
    wod_id: baseRecord.wod_id.required(),
    result: baseRecord.result.required(),
    notes: baseRecord.notes,
    date: baseRecord.date
});

const updateRecordSchema = Joi.object(baseRecord).min(1);

const recordParamsSchema = Joi.object({
    recordId: Joi.number().integer().positive().required()
});

const workoutRecordParamsSchema = Joi.object({
    workoutId: Joi.number().integer().positive().required()
});

module.exports = {
    createRecordSchema,
    updateRecordSchema,
    recordParamsSchema,
    workoutRecordParamsSchema
};
