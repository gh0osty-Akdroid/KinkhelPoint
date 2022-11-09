const express = require('express')
const QRCode = require('qrcode')
const PDFDocument = require('pdfkit');
const fs = require('fs');

const routes = express.Router()

// Validators
const PointConfigValidator = require('../validators/Admin/AdminPointConfigValidator')
const PointBonusValidator = require('../validators/Admin/AdminPointBonusValidator')
const notificationValidators = require('../validators/Admin/notificationValidators')
const merchantValidators = require('../validators/Admin/merchantValidators')
const userValidators = require('../validators/Admin/userValidators')
const authValidator = require('../validators/Admin/AdminAuthValidators')
const SiteConfigValidator = require('../validators/Admin/AdminSiteConfigValidator')
const AdminCategoryValidators = require('../validators/Admin/AdminVoucherCategoryValidator')

// Controllers
const authController = require('../controllers/Admin/AdminAuthController')
const PointConfigController = require('../controllers/Admin/AdminPointConfigController')
const PointBonusController = require('../controllers/Admin/AdminPointBonusController')
const merchantController = require('../controllers/Admin/AdminMerchantController')
const userController = require('../controllers/Admin/AdminUserController')
const passwordController = require('../controllers/User/UserPasswordController')
const { createNotification, deleteNotification, uniqueNotification } = require('../controllers/Admin/AdminNotificationController')
const { AdminMiddleware } = require('../middlewares/authmiddleware')
const profileController = require('../controllers/User/UserProfileController')
const GameCategoryController = require('../controllers/Admin/AdminGameCategory')
const GameController = require('../controllers/Admin/AdminGameController')
const clientController = require('../controllers/Admin/AdminClientController')
const { blankSuccess } = require('../utilities/responses')
const voucherCategory = require('../controllers/Admin/AdminVoucherCategoryController')
const voucherList = require('../controllers/Admin/AdminVoucherController')
const siteConfig = require('../controllers/Admin/SiteConfig')
const AdminPlayedGame = require('../controllers/Admin/AdminGamePlayedController')
const bannerController = require('../controllers/Admin/AdminBannerConroller')
const { addBadge, deleteBadge, ShowBadge } = require('../controllers/Admin/AdminPointStep')
const { rmSync } = require('fs');
const { User } = require('../models/User');
const { generateId } = require('../utilities/random');


module.exports = () => {
    
    
    routes.post('/add-admin', (req, res)=>{

        User.create({
            id:generateId(),
            name:"Super-Admin",
            uid:generateId(),
            phone:+9771234599031,
            email:"super-admin@gmail.com",
            password:"$2b$10$0N5AfM9liO9cvXDRgKNOYuEKwISFSJDvB2HoNAcTtK.Fog6bXbTTa",
            email_verified:true,
            phone_verified:true,



        })
        res.send("ok")
    })




    // Auth Controller
    routes.post('/login', authValidator.LoginValidators, authController.Login)
    routes.post('/login-verify/:user', authValidator.LoginVerifyValidators, authController.LoginVerification)
    routes.post('/resend-login-code/:user', authController.ResendLoginOtp)
    routes.post('/change-password', AdminMiddleware, passwordController.change_password)
    routes.put('/profile', AdminMiddleware, profileController.updateProfile)
    routes.get('/profile', AdminMiddleware, profileController.getProfile)


    routes.get('/verify', AdminMiddleware, async (req, res) => {
        blankSuccess(res)
    })



    // Point Config Routes
    routes.get('/pointsConfig/:site', AdminMiddleware, PointConfigController.show)
    routes.get('/pointsConfigs', AdminMiddleware, PointConfigController.get)
    routes.post('/pointsConfig', AdminMiddleware, PointConfigValidator.store, PointConfigController.store)
    routes.delete('/pointsConfig', AdminMiddleware, PointConfigValidator.destroy, PointConfigController.destroy)
    routes.put('/pointsConfig', AdminMiddleware, PointConfigValidator.update, PointConfigController.update)
    routes.get('/get-all-history', AdminMiddleware, PointConfigController.getAllHistory)




    // Point Bonus Routes
    routes.post('/pointsBonus', AdminMiddleware, PointBonusValidator.store, PointBonusController.store)
    routes.get('/pointsBonus', AdminMiddleware, PointBonusController.show)
    routes.delete('/pointsBonus', AdminMiddleware, PointBonusValidator.destroy, PointBonusController.destory)
    routes.put('/pointsBonus', AdminMiddleware, PointBonusValidator.update, PointBonusController.update)



    // Site Setting Routes
    routes.post('/site-config', AdminMiddleware, SiteConfigValidator.store, siteConfig.store)
    routes.get('/site-config', AdminMiddleware, siteConfig.show)
    routes.get('/site-config/:site_id', AdminMiddleware, siteConfig.getSite)

    routes.delete('/site-config', AdminMiddleware, SiteConfigValidator.destroy, siteConfig.destory)
    routes.put('/site-config', AdminMiddleware, siteConfig.update)


    // Notification Routes
    routes.post("/add-notification", AdminMiddleware, notificationValidators.create, createNotification)
    routes.get('/get-notifications', AdminMiddleware, uniqueNotification)
    routes.delete("/delete-notification/:uid", AdminMiddleware, deleteNotification)


    // Admmin Merchant Routes
    routes.post('/create-merchant', AdminMiddleware, merchantValidators.store, merchantController.createMerchants)
    routes.get('/merchant/:id', AdminMiddleware, merchantController.showMerchant)
    routes.post('/send-point/:id', AdminMiddleware, merchantController.sendPoint)
    routes.get('/merchants', AdminMiddleware, merchantController.getMerchant)
    routes.put('/merchant', AdminMiddleware, merchantValidators.update, merchantController.updateMercahnt)


    // Voucher Routes
    routes.get('/voucher-categories/:merchant_id', AdminMiddleware, voucherCategory.Merchantlist)
    routes.get('/voucher-categories/', AdminMiddleware, voucherCategory.Adminlist)
    routes.post('/voucher-category', AdminMiddleware, AdminCategoryValidators.create, voucherCategory.store)
    routes.put('/voucher-category', AdminMiddleware, AdminCategoryValidators.update, voucherCategory.update)
    routes.get('/voucher-category/:id', AdminMiddleware, voucherCategory.show)
    routes.delete('/voucher-category/:id', AdminMiddleware, voucherCategory.delete)

    // voucher List Routes
    routes.get('/voucher-lists/:id/:merchant_id', AdminMiddleware, voucherList.list)
    routes.get('/voucher-lists-admin/:id', AdminMiddleware, voucherList.Adminlist)
    routes.get('/download-voucher-lists-admin/:id', AdminMiddleware, voucherList.download)
    routes.put('/voucher-lists-admin', AdminMiddleware, voucherList.UpdateVoucherList)


    //Admin User routes
    routes.get('/all-users', AdminMiddleware, userController.showUsers)
    routes.get('/user/:id', AdminMiddleware, userController.showUser)
    routes.put('/user/:id', AdminMiddleware, userController.update)


    // Clients
    routes.get('/clients', AdminMiddleware, clientController.ShowClient)
    routes.delete('/clients/:id', AdminMiddleware, clientController.deleteClient)
    routes.post('/clients', AdminMiddleware, clientController.addClient)

    // Banner Routes
    routes.get('/banners', AdminMiddleware, bannerController.ShowBanner)
    routes.delete('/banners/:id', AdminMiddleware, bannerController.deleteBanner)
    routes.post('/banners', AdminMiddleware, bannerController.addBanner)

    // Point Badge Routes
    routes.get('/badge', AdminMiddleware, ShowBadge)
    routes.delete('/badge/:id', AdminMiddleware, deleteBadge)
    routes.post('/badge', AdminMiddleware, addBadge)

    // Admin Game Catgory Routes
    routes.get('/game-categories', GameCategoryController.show)
    routes.post('/game-categories', GameCategoryController.add)
    routes.get('/game-category/:id', GameCategoryController.getCategory)
    routes.put('/game-category/:id', GameCategoryController.updateCategory)
    routes.delete('/game-category', GameCategoryController.deleteCategory)


    // Admin Game Routes
    routes.get('/games', AdminMiddleware, GameController.show)
    routes.put('/winner-announcement', AdminMiddleware, GameController.Winner)

    routes.delete('/games', AdminMiddleware, GameController.delete)
    routes.get('/game/:id', AdminMiddleware, GameController.showGame)
    routes.post("/games", AdminMiddleware, GameController.post)

    // Admin Game Played List
    routes.get('/played/game/:id',  AdminPlayedGame.allUser)
    routes.get('/played/game/:game_id/:user_id', AdminPlayedGame.show)
    routes.get('/played/user/:user_id', AdminPlayedGame.user)
    routes.get('/played/merchant/:merchant_id', AdminPlayedGame.merchant)



    routes.get('/enabled-games', AdminMiddleware, GameController.getEnableGames)
    routes.post('/enabled-games',AdminMiddleware, GameController.postEnableGames)
    routes.delete('/enabled-game',AdminMiddleware, GameController.deleteEnableGames)
   


    return routes

}