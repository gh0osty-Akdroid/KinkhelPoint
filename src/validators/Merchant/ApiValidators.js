const { body, check, validationResult } = require("express-validator")
const { Merchant } = require("../../models/Merchant")
const { User } = require("../../models/User")
const responses = require("../../utilities/responses")




exports.ApiValidators = [
    check('UP').notEmpty().withMessage("User point cannot be empty.").bail(),
    check('MC').notEmpty().withMessage('Merchant cannot be empty.').bail().
    custom(async (value, { req }) => {
        const merchant = await Merchant.findOne({ where: { merchant_code : value }, include:[{model:User}] })
        if (merchant) return req.merchant = merchant
        else return Promise.reject()
    }).withMessage("The Merchant Code is invalid.").bail(),
    check('SK').notEmpty().withMessage('Please enter your secret key').bail().
    custom(async (value, { req }) => {
        if (req.merchant.secret_key === value ) return true
        else return Promise.reject()
    }).withMessage("The secret key is not valid for the merchant.").bail(),
    check('RE').notEmpty().withMessage('Please enter your remarks.').bail()
    .isLength({max: 500 }).withMessage('remarks should not exceed 500 letters').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            return responses.validationError(res, err)
        }
        next()
    }
]
