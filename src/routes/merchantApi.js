const express = require('express')
const routes = express.Router()

const authController = require('../controllers/Merchant/MerchantAuthController')
const { RegisterValidators, LoginValidators } = require('../validators/Merchant/AuthValidators')

module.exports = () => {
    
    routes.post('/register',authController.Register)
    routes.post('/login',authController.Login)

    return routes

}