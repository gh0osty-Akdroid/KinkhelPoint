const express = require('express')
const routes = express.Router()

const authController = require('../controllers/User/UserAuthController')
const { getNotifactions, readNotifications } = require('../controllers/User/UserNotificationController')
const passwordController = require('../controllers/User/UserPasswordController')
const profileController = require('../controllers/User/UserProfileController')
const { RegisterValidators, LoginValidators } = require('../validators/User/AuthValidators')
const { PasswordEmailValidators, PasswordTokenValidators, PasswordValidators } = require('../validators/User/PasswordValidators')
const {  UserMiddleware } = require('../middlewares/authmiddleware')
const voucherController = require('../controllers/User/UserVoucherController')


module.exports = () => {


    // Auth Routes   
    routes.post('/register',RegisterValidators,authController.Register)
    routes.post('/login',LoginValidators,authController.Login)
    routes.post('/login-verify/:user', authController.LoginVerification)
    routes.post('/resend-login-code/:user', authController.ResendLoginOtp)



    // Password Routes
    routes.post("/forget-password", PasswordEmailValidators, passwordController.forget_pwd),
    routes.post("/reset-password/:email", passwordController.reset_pwd),
    routes.post("/new-password/:email", PasswordValidators,passwordController.new_pwd)
    routes.post('/change-password', passwordController.change_password)


    // Profile Routes
    routes.get('/profile/:uid', profileController.getProfile)
    routes.put('/profile/:uid', profileController.updateProfile)



    // routes.get('/email-verify/:email/:vCode', authController.emailVerificationlength)
    // routes.get('/new-email-code/:email', authController.NewEmailVerificationLink)
     

    // Voucher Routes
    routes.post('/redeem-voucher', voucherController.redeem)

    // Notification Routes
    routes.get('/notifications/:user_id', getNotifactions)
    routes.get('/notifications/:user_id/read', readNotifications)

    





    return routes

}