const express = require('express')
const routes = express.Router()

const authController = require('../controllers/User/UserAuthController')
const { getNotifactions, readNotifications } = require('../controllers/User/UserNotificationController')
const passwordController = require('../controllers/User/UserPasswordController')
const profileController = require('../controllers/User/UserProfileController')
const { RegisterValidators, LoginValidators } = require('../validators/User/AuthValidators')
const { PasswordEmailValidators, PasswordTokenValidators, PasswordValidators } = require('../validators/User/PasswordValidators')

module.exports = () => {
    
    routes.post('/register',RegisterValidators,authController.Register)
    routes.get('/profile/:uid', profileController.getProfile)
    routes.put('/profile/:uid', profileController.updateProfile)
    routes.post('/login-verify/:email', authController.LoginVerification)
    routes.get('/email-verify/:email/:vCode', authController.emailVerification)
    routes.get('/new-email-code/:email', authController.NewEmailVerificationLink)
    routes.post('resend-login-code/:email', authController.LoginVerification)    
    routes.post('/login',LoginValidators,authController.Login)
    routes.post("/forget-password", PasswordEmailValidators, passwordController.forget_pwd),
    routes.post("/reset-password/:email",PasswordTokenValidators, passwordController.reset_pwd),
    routes.post("/new-password/:email", PasswordValidators,passwordController.new_pwd)

    routes.get('/notifications/:user_id', getNotifactions)
    routes.get('/notifications/:user_id/read', readNotifications)
    routes.post('/otp',authController.otpVerify)
    routes.get('/otp/:user_id',authController.resendOtp)






    return routes

}