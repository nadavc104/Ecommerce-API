import express from 'express'
import { loginLimiter } from '../middlewares/loginLimiter.js'
import { login, refresh, logout } from '../controllers/authControllers.js'

const router = express.Router()


router.route('/refresh')
    .get(refresh)

router.route('/logout')
    .post(logout)

router.route('/')
    .post(loginLimiter, login)


export default router