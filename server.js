import express from 'express'
import { logger, logEvents } from './middlewares/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'
const app = express()
app.use(logger)

app.get('/', (req, res) => {
    res.send('Api is running')
})

app.use(errorHandler)
app.listen(3500, () => console.log('Server is running on port 3500'))