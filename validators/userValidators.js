import Joi from 'joi'

const validator = (schema) => (payload) => 
    schema.validate(payload, { abortEarly: false}) 


const bodySchemaRegister = Joi.object({
    username: Joi.string().alphanum().min(5).max(16).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    firstName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
    lastName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
    roles: Joi.array().required()
})

const bodySchemaUpdate = Joi.object({
    firstName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
    lastName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
    roles: Joi.array(),
    active: Joi.string()
})

const paramsSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
})

const validateBodyRegister = validator(bodySchemaRegister)
const validateParams = validator(paramsSchema)
const validateBodyUpdate = validator(bodySchemaUpdate)

export { validateBodyRegister, validateBodyUpdate, validateParams }