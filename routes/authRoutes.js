import express from 'express'
import { loginLimiter } from '../middlewares/loginLimiter.js'
import { validation } from '../middlewares/validation.js'
import { login, refresh, logout } from '../controllers/authControllers.js'

const router = express.Router()

router.route('/')
    .post(loginLimiter, login)

router.route('/refresh')
    .get(refresh)

router.route('/logout')
    .post(logout)

export default router