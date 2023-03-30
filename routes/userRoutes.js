import express from 'express'
import { createUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/userControllers.js'

const router = express.Router()

router.route('/')
    .get(getUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)
   

export default router