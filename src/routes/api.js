const express = require('express')
const User = require('../models/Verification')
const routes = express.Router()
const temp = require('../models/User')

module.exports = () => {
    
    routes.get('/', (req, res) => {
        // const user = User.build({
        //     'phone': '91123222',
        //     'user_name': 'Helloits2me22',
        //     'role': 'Merchant2'
        // })
        // user.save()
        return res.send('ok')
    })

    return routes
}