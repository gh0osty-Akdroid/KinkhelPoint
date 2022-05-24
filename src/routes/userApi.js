const express = require('express')
const routes = express.Router()

const authController = require('../controllers/User/UserAuthController')
const { RegisterValidators, LoginValidators } = require('../validators/User/AuthValidators')

module.exports = () => {
    
    routes.post('/register',RegisterValidators,authController.Register)
    routes.post('/login',LoginValidators,authController.Login)

    return routes

}