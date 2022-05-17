const express = require('express')
const routes = express.Router()
const User = require('../models/User')

const authController = require('../controllers/AuthController')
const { RegisterValidators } = require('../validators.js/AuthValidators')

module.exports = () => {
    
    routes.get('/register',RegisterValidators,authController.Register)
    // routes.get('/',RegisterValidators,authController.Register)

    return routes

}