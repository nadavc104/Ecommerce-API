import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { logger, logEvents } from './middlewares/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { corsOptions } from './config/corsOptions.js'


const app = express()

app.use(express.json())

app.use(cors(corsOptions))

app.use(cookieParser())

app.use(logger)

app.get('/', (req, res) => {
    res.send('Api is running')
})

app.use(errorHandler)
app.listen(3500, () => console.log('Server is running on port 3500'))