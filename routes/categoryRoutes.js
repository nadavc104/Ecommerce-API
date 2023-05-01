import express from 'express'
import { imageUpload } from '../middlewares/fileUpload.js'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryControllers.js'
import { verifyJWT, admin } from '../middlewares/authentication.js'
import { validation } from '../middlewares/validation.js'
import { validateBody, validateFile, validateParams } from '../validators/categoryValidators.js'

const router = express.Router()

router.route('/')
    .get(getCategories)
    .post(verifyJWT, admin, imageUpload.single('image'), validation(validateBody, null, validateFile), createCategory)

router.route('/:id')
    .patch(verifyJWT, admin, imageUpload.single('image'), validation(validateBody, validateParams, null), updateCategory)
    .delete(verifyJWT, admin, validation(null, null, validateParams), deleteCategory)

export default router