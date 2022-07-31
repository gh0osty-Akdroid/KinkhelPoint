const { body, check, validationResult } = require("express-validator")
const Merchant = require("../../models/Merchant")
const { User } = require("../../models/User")
const { Verification } = require("../../models/Verification")
const responses = require("../../utilities/responses")



exports.RegisterValidators = [
    check('email').isEmail().withMessage('Email is not valid.').bail()
        .isLength({ max: 250 }).withMessage('Email cannot be this long.').bail()
        .custom(async value => {
            const one = await Merchant.findOne({ where: { email: value } })
            if (one != null) {
                return Promise.reject()
            }
            else {
                return true
            }
        }).withMessage('Email is already in use.').bail(),
    check('phone').notEmpty().withMessage('Please enter your phone number').bail()
        .isNumeric().withMessage('Phone number should be in number').bail().custom(async value => {
            const one = await User.findOne({ where: { phone: value } })
            if (one != null) {
                return Promise.reject()
            }
            else {
                return true
            }
        }).withMessage('Phone Number is already in use.').bail(),
    check('name').notEmpty().withMessage('Please enter your name.').bail()
        .isLength({ max: 100 }).withMessage('Name should not exceed 50 letters').bail(),
    check('password').notEmpty().withMessage('Please enter a valid password').matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
    ).withMessage("Please use strong password with numbers, alphabets and special characters.").bail()
        .isLength({ min: 8, max: 50 }).withMessage('Your Password Strength Is Not Good Enough').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validatonError(res, err)
        }
        next()
    }
]

exports.LoginValidators = [
    check('email').notEmpty().withMessage('Please enter a valid value.').bail()
        .custom(async (value, { req }) => {
            const user = await User.findOne({ where: { email: value } }) || await User.findOne({ where: { phone: value } })
            if (user.role === "Merchant") {
                req.merchant = user
                return true
            }
            else return Promise.reject()
        }).withMessage("You are not registered with Merchant.").bail(),
    check('password').notEmpty().withMessage('Please enter a valid password').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validatonError(res, err)
        }
        next()
    }
]


exports.LoginVerifyValidators = [
    check('token').notEmpty().withMessage('Please enter a valid value.').bail()
        .custom(async (value, { req }) => {
            await User.findOne({ where: { email: req.params.user } }) || await User.findOne({ where: { phone: req.params.user } }).then(async(data)=>{
                const verify = await Verification.findOne({ where: { user_id: data.id, is_email: false, token:value } })
                if(verify){
                    req.code = verify
                    req.merchant = data
                    return true
                }
                else return Promise.reject()
            }).catch((err)=> {return Promise.reject()})
        }).withMessage("Your code has been expired. Please get new one.").bail(),
    
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validatonError(res, err)
        }
        next()
    }
]
