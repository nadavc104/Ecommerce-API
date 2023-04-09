import rateLimit from 'express-rate-limit'
import { logEvents } from '../middlewares/logger.js'

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attemps, please try again in few minutes'
    },
    handler: (req, res, next, options) => {
        logEvents(`Too many Request: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, errLog.log)
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export { loginLimiter }