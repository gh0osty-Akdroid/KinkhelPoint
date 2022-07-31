const express = require('express')
const routes = express.Router()

// Validators
const PointConfigValidator = require('../validators/Admin/AdminPointConfigValidator')
const PointBonusValidator = require('../validators/Admin/AdminPointBonusValidator')
const notificationValidators = require('../validators/Admin/notificationValidators')
const merchantValidators = require('../validators/Admin/merchantValidators')
const userValidators = require('../validators/Admin/userValidators')
const authValidator = require('../validators/Admin/AdminAuthValidators')

// Controllers
const authController = require( '../controllers/Admin/AdminAuthController')
const PointConfigController = require('../controllers/Admin/AdminPointConfigController')
const PointBonusController = require('../controllers/Admin/AdminPointBonusController')
const merchantController = require('../controllers/Admin/AdminMerchantController')
const userController = require('../controllers/Admin/AdminUserController')

const { createNotification , deleteNotification, uniqueNotification} = require('../controllers/Admin/AdminNotificationController')
const { AdminMiddleware } = require('../middlewares/authmiddleware')

module.exports = () => {

    // Auth Controller
    routes.post('/login',authValidator.LoginValidators, authController.Login)
    routes.post('/login-verify/:user', authController.LoginVerification)
    routes.post('/resend-login-code/:user', authController.ResendLoginOtp)

    
    // Point Config Routes
    routes.get('/pointsConfig/:site',AdminMiddleware ,PointConfigController.show)
    routes.post('/pointsConfig',AdminMiddleware,PointConfigValidator.store, PointConfigController.store)
    routes.delete('/pointsConfig',AdminMiddleware,PointConfigValidator.destroy, PointConfigController.destroy)
    routes.put('/pointsConfig',AdminMiddleware, PointConfigValidator.update, PointConfigController.update)



    // Point Bonus Routes
    routes.post('/pointsBonus',AdminMiddleware, PointBonusValidator.store, PointBonusController.store)
    routes.get('/pointsBonus',AdminMiddleware,  PointBonusController.show)
    routes.delete('/pointsBonus',AdminMiddleware, PointBonusValidator.destroy, PointBonusController.destory)
    routes.put('/pointsBonus',AdminMiddleware, PointBonusValidator.update, PointBonusController.update)


    // Notification Routes
    routes.post("/add-notification",AdminMiddleware, notificationValidators.create, createNotification)
    routes.get('/get-notifications', AdminMiddleware,uniqueNotification)
    routes.delete("/delete-notification/:uid",AdminMiddleware,deleteNotification)


    // Admmin Merchant Routes
    routes.post('/create-merchant',AdminMiddleware,merchantValidators.store,merchantController.createMerchant)
    routes.get('/mercahnt/:id',AdminMiddleware,merchantController.showMerchant)
    routes.get('/merchants',AdminMiddleware,merchantController.getMerchant)
    routes.put('/merchant/',AdminMiddleware,merchantValidators.update,merchantController.updateMercahnt)
    

    //Admin User routes
    routes.get('/all-users',AdminMiddleware,userController.showUsers)
    routes.get('/user/:id',AdminMiddleware,userController.showUser)
    routes.put('/user/:id',AdminMiddleware,userController.update)
    
    

    return routes

}