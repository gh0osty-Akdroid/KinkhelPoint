const express = require('express')
const routes = express.Router()
const User = require('../models/User')

module.exports = () => {
    
    routes.get((req,res)=>{
        return res.send('ok')
    })

    return routes

}