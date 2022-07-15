const express = require('express')
const routes = express.Router()

const authController = require('../controllers/User/UserAuthController')
const passwordcontroller = require('../controllers/User/UserPasswordController')
const { RegisterValidators, LoginValidators } = require('../validators/User/AuthValidators')
const { PasswordEmailValidators, PasswordTokenValidators, PasswordValidators } = require('../validators/User/PasswordValidators')

module.exports = () => {
    
    routes.post('/register',RegisterValidators,authController.Register)
    routes.post('/login',LoginValidators,authController.Login)
    routes.post("/forget-password", PasswordEmailValidators, passwordcontroller.forget_pwd),
    routes.post("/reset-password/:email",PasswordTokenValidators, passwordcontroller.reset_pwd),
    routes.post("/new-password/:email", PasswordValidators,passwordcontroller.new_pwd)


    return routes

}