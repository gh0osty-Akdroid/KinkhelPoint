const express = require('express')
const app = express()
require('dotenv').config({ encoding: 'latin1' })
const methodOverride = require('method-override')
const db = require('./src/config/db')
const cors = require('cors');
const helmet = require('helmet');
const port = process.env.APP_PORT

const apiRoutes = require('./src/routes/api')

app.use(helmet())
app.use(cors())
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(methodOverride('_method'))
app.use(express.json({ limit: '1mb' }))

app.use('/api', apiRoutes())

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})