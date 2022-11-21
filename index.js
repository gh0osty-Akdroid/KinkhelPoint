const express = require('express')
const app = express()
const cluster = require('cluster')
const os = require('os')
require('dotenv').config({ encoding: 'latin1' })
const methodOverride = require('method-override')
const db = require('./src/config/db')
const cors = require('cors');
const helmet = require('helmet')
const axios = require('axios')
const port = process.env.APP_PORT
const useragent = require('express-useragent')
const path = require('path');
const userApi = require('./src/routes/userApi')
const adminApi = require('./src/routes/adminApi')
const merchantApi = require('./src/routes/merchantApi')
const { User } = require('./src/models/User')
const { dataSuccess } = require('./src/utilities/responses')


app.use(cors())


app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
)
app.use(useragent.express());
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, './src/public/Storage/')))
app.use(express.json({ limit: '2mb' }))


app.use('/api/v1/user', userApi())
app.use('/api/v1/merchant', merchantApi())
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