import express from 'express'
import { createUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/userControllers.js'
import { validation } from '../middlewares/validation.js'
import { validateBodyRegister, validateBodyUpdate, validateParamsUpdate, validateParamsDelete } from '../validators/userValidators.js'
import { verifyJWT, admin } from '../middlewares/authentication.js'
import { imageUpload } from '../middlewares/fileUpload.js'

const router = express.Router()

router.route('/')
    .get(verifyJWT, admin, getUsers)
    .post(validation(validateBodyRegister, null), createUser)

router.route('/:id')
    .get(verifyJWT, admin, getUser)
    .patch(verifyJWT, validation(validateBodyUpdate, validateParamsUpdate), updateUser)
    .delete(verifyJWT, admin, validation(null, validateParamsDelete), deleteUser)
    
router.post('/upload', imageUpload.single('image'), (req, res) => {
    console.log(req.file)
})
    
export default router