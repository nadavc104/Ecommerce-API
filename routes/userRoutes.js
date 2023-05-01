import express from 'express'
import { createUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/userControllers.js'
import { validation } from '../middlewares/validation.js'
import { validateBodyRegister, validateBodyUpdate, validateParams  } from '../validators/userValidators.js'
import { verifyJWT, admin } from '../middlewares/authentication.js'

const router = express.Router()

router.route('/')
    .get(verifyJWT, admin, getUsers)
    .post(verifyJWT, admin, validation(validateBodyRegister, null, null), createUser)

router.route('/:id')
    .get(verifyJWT, admin, getUser)
    .patch(verifyJWT, validation(validateBodyUpdate, validateParams, null), updateUser)
    .delete(verifyJWT, admin, validation(null, validateParams, null), deleteUser)
    
export default router