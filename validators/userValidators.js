import Joi from 'joi'

const validator = (schema) => (payload) => 
    schema.validate(payload, { abortEarly: false}) 


const registerSchema = Joi.object({

    username: Joi.string().alphanum().min(5).max(16).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    firstName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
    lastName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
    roles: Joi.array().required()
})
const paramsUpdateSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)

})
const bodyUpdateSchema = Joi.object({

    firstName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
    lastName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
    roles: Joi.array().required(),
    active: Joi.boolean().required()
})

const deleteSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
})

const validateBodyRegister = validator(registerSchema)
const validateBodyUpdate = validator(bodyUpdateSchema)
const validateParamsUpdate = validator(paramsUpdateSchema)
const validateParamsDelete = validator(deleteSchema)

export { validateBodyRegister, validateBodyUpdate, validateParamsUpdate, validateParamsDelete }