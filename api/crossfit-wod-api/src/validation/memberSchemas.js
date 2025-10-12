const Joi = require('joi');

const baseMember = {
    name: Joi.string().min(2).max(100),
    gender: Joi.string().valid('male', 'female', 'other'),
    dateOfBirth: Joi.date().iso(),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(128),
    phone: Joi.string().allow('', null),
    membershipStatus: Joi.string().valid('active', 'inactive', 'pending'),
    notes: Joi.string().max(500).allow('', null)
};

const createMemberSchema = Joi.object({
    ...baseMember,
    name: baseMember.name.required(),
    gender: baseMember.gender.required(),
    dateOfBirth: baseMember.dateOfBirth.required(),
    email: baseMember.email.required(),
    password: baseMember.password.required()
});

const updateMemberSchema = Joi.object(baseMember).min(1);

const paramsSchema = Joi.object({
    memberId: Joi.number().integer().positive().required()
});

module.exports = {
    createMemberSchema,
    updateMemberSchema,
    paramsSchema
};
