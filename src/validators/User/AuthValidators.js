const { body, check, validationResult } = require("express-validator")
const { User } = require("../../models/User")
const responses = require("../../utilities/responses")



exports.RegisterValidators = [
    check('email').isEmail().withMessage('Email is not valid.').bail()
    .isLength({ max: 250 }).withMessage('Email cannot be this long.').bail()
    .custom(async value =>{
        const one = await User.findOne({where:{email : value}})
        if(one != null){
            return Promise.reject()
        }
        else{
            return true
        }
    }).withMessage('Email is already in use.').bail(),
    check('phone').notEmpty().withMessage('Please enter your phone number').bail()
    .isNumeric().withMessage('Phone number should be in number').bail().custom(async value=>{
        const one = await User.findOne({ where: { phone: value } })
        if (one != null) {
            return Promise.reject()
        }
        else {
            return true
        }
    }).withMessage('Phone Number is already in use.').bail(),
    check('name').notEmpty().withMessage('Please enter your name.').bail()
    .isLength({max: 100 }).withMessage('Name should not exceed 50 letters').bail(),
    check('password').notEmpty().withMessage('Please enter a valid password').bail().matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
      ).withMessage("Please use strong password with numbers, alphabets and special characters.").bail()
    .isLength({ min: 8, max: 50 }).withMessage('Your Password Strength Is Not Good Enough').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            return responses.validatonError(res, err)
        }
        next()
    }
]

exports.LoginValidators = [
    check('phone').notEmpty().withMessage('Please enter a valid value.').bail(),
    check('password').notEmpty().withMessage('Please enter a valid password').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            return responses.validatonError(res, err)
        }
        next()
    }
]
