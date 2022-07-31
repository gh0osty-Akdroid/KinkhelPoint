const express = require('express')
const routes = express.Router()
const axios = require('axios')

const authController = require('../controllers/Merchant/MerchantAuthController')
const passwordController = require('../controllers/Merchant/MerchantPasswordController')
const voucherCategory = require('../controllers/Merchant/MerchantVoucherCatgerory')
const voucherList = require('../controllers/Merchant/MerchantVoucherList')

const pointController = require('../controllers/Merchant/MerchantPointController')

const merchantCategoryValidators = require('../validators/Merchant/MerchantCategoryValidators')
const { RegisterValidators, LoginValidators, LoginVerifyValidators } = require('../validators/Merchant/AuthValidators')
const { PasswordValidators } = require('../validators/User/PasswordValidators')
const { MerchantMiddleware } = require('../middlewares/authmiddleware')
const { PointTransferValidators, verifyTokenValidators } = require('../validators/Merchant/PointTransferValidator')


module.exports = () => {


    // Auth Routes
    routes.post('/login', LoginValidators, authController.Login)
    routes.post('/login-verify/:user', LoginVerifyValidators, authController.LoginVerification)
    routes.post('/resend-login-code/:user', authController.ResendLoginOtp)



    // password routes
    routes.get('/forget-password', passwordController.forget_pwd)
    routes.post("/reset-password/:email", passwordController.reset_pwd),
    routes.post("/new-password/:email", PasswordValidators, passwordController.new_pwd)
    routes.post('/change-password', PasswordValidators, passwordController.change_password)



    // Voucher Routes
    routes.get('/voucher-categories', MerchantMiddleware, voucherCategory.list)
    routes.post('/voucher-category',MerchantMiddleware, merchantCategoryValidators.create, voucherCategory.store)
    routes.put('/voucher-category/:id',MerchantMiddleware, voucherCategory.update)
    routes.delete('/voucher-category/:id',MerchantMiddleware, voucherCategory.delete)

    // voucher List Routes

    routes.get('/voucher-lists/:id',MerchantMiddleware, voucherList.list)
    routes.post('/voucher-lists/:id',MerchantMiddleware, voucherList.store)

    

    // Point tranfer Routes 
    routes.get('/get-transfer-token',pointController.requestToken)
    routes.post('/verify-transfer-token',verifyTokenValidators, pointController.verifyToken)
    routes.post('/transfer-points',PointTransferValidators, pointController.pointTransfer)
    
    return routes

}