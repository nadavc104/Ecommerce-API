import express from 'express'
import { createUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/userControllers.js'
import { validation } from '../middlewares/validation.js'
import { validateBodyRegister, validateBodyUpdate, validateParamsUpdate, validateParamsDelete } from '../validators/userValidators.js'

const router = express.Router()


router.route('/')
    .get( getUsers)
    .post(validation(validateBodyRegister, null), createUser)

router.route('/:id')
    .get( getUser)
    .patch( validation(validateBodyUpdate, validateParamsUpdate), updateUser)
    .delete(validation(null, validateParamsDelete), deleteUser)
    
export default router