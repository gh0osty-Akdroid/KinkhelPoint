const express = require('express')
const app = express()
const cluster = require('cluster')
const os = require('os')
require('dotenv').config({ encoding: 'latin1' })
const methodOverride = require('method-override')
const db = require('./src/config/db')
const cors = require('cors');
const helmet = require('helmet')
const port = process.env.APP_PORT
const path = require('path');
const userApi = require('./src/routes/userApi')
const adminApi = require('./src/routes/adminApi')
const merchantApi = require('./src/routes/merchantApi')
const pointsApi = require('./src/routes/adminApi')

app.use(helmet())
app.use(cors())
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(methodOverride('_method'))
app.use(express.json({ limit: '1mb' }))

app.use('/api/v1/user', userApi())
app.use('/api/v1/merchant', merchantApi())
app.use('/api/v1/points', pointsApi())
app.use('/api/v1/admin', adminApi())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/public/views'))

app.listen(port, () => console.log(`Server - ${process.pid} http://localhost:${port}`))

// if(cluster.isMaster){
//     for(let i =0; i<os.cpus().length; i++){
//         cluster.fork()
//     }
//     cluster.on('exit',(worker,code,signal)=> {
//         cluster.fork()
//     })
// }
// else app.listen(port, () => console.log(`Server - ${process.pid} http://localhost:${port}`))

// TODO -- All The Relations