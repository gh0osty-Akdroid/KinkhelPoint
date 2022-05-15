const express = require('express')
const routes = express.Router()
const User = require('../models/User')

module.exports = () => {
    
    routes.get('/',(req,res)=> {
        // User.createUser({test:'123', abc:'132'})
        return res.send('ok')
    })

    return routes

}