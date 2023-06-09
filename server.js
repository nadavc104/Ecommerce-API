import express from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { logger, logEvents } from './middlewares/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { corsOptions } from './config/corsOptions.js'
import connectDB from './config/connectDB.js'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'


dotenv.config()
const app = express()

connectDB()


app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))
app.use(logger)

app.get('/', (req, res) => {
    res.send('Api is running')
})

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/categories', categoryRoutes)

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('connected to mongodb')
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongodbErrLog.log')
})