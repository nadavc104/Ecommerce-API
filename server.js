import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Api is running')
})
app.listen(3500, () => console.log('Server is running on port 3500'))