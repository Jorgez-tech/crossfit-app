const Joi = require('joi');

const exercisesSchema = Joi.alternatives().try(
    Joi.array().items(Joi.string().min(1)).min(1),
    Joi.string().min(1)
);

const createWorkoutSchema = Joi.object({
    name: Joi.string().min(3).max(150).required(),
    description: Joi.string().max(1000).allow('', null),
    trainerTips: Joi.string().max(1000).allow('', null),
    exercises: exercisesSchema.required(),
    created_by: Joi.number().integer().positive().optional()
});

const updateWorkoutSchema = Joi.object({
    name: Joi.string().min(3).max(150),
    description: Joi.string().max(1000).allow('', null),
    trainerTips: Joi.string().max(1000).allow('', null),
    exercises: exercisesSchema
}).min(1);

const paramsSchema = Joi.object({
    workoutId: Joi.number().integer().positive().required()
});

module.exports = {
    createWorkoutSchema,
    updateWorkoutSchema,
    paramsSchema
};
