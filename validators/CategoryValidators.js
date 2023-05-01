import Joi from 'joi'

const validator = (schema) => (payload) => 
    schema.validate(payload, { abortEarly: false}) 

const bodySchema = Joi.object({

    name: Joi.string().alphanum().min(5).max(16).required(),
    description: Joi.string().required(),
    parent: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
})

const fileSchema = Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
    size: Joi.number().max(1024 * 1024 * 3).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required()
})

const paramsSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)

})

const validateBody = validator(bodySchema)
const validateFile = validator(fileSchema)
const validateParams = validator(paramsSchema)


export { validateBody, validateFile, validateParams }