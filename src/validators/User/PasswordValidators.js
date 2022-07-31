const ForgetPassword = require("../../models/ForgetPassword")
const { body, check, validationResult } = require("express-validator")
const { User } = require("../../models/User")
const { validatonError } = require("../../utilities/responses")





exports.PasswordEmailValidators = [
    check('email').notEmpty().withMessage('Please Enter Your Email.').bail()
    .custom(async (value, { req, loc, path }) => {
        const check = await User.findOne({where: {email: value}})
        if(check) req.body.email =check
        else return Promise.reject()
    }).withMessage('The Entered Email Cannot Be Found.').bail(),
   
    (req,res,next) => {
        const err = validationResult(req)
        if(!err.isEmpty()) return validatonError(res, err)
        next()
    }
]

// exports.PasswordTokenValidators = [
//     check('token').notEmpty().withMessage('Please Enter Your Token.').bail()
//     .custom(async (value, { req, loc, path }) => {
//         const check = await ForgetPassword.ForgetPassword.findOne({where: {token: value}})
//         if(check) req.body.token =check
//         else return Promise.reject()
//     }).withMessage('The Entered Token Cannot Be Found.').bail(),
//     (req,res,next) => {
//         const err = validationResult(req)
//         if(!err.isEmpty()) return validatonError(res, err)
//         next()
//     }
// ]


exports.PasswordValidators = [
    check('password').notEmpty().withMessage('Please Enter Your Token.').bail().matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
      ).withMessage("Please use strong password with numbers, alphabets and special characters.").bail(),
    (req,res,next) => {
        const err = validationResult(req)
        if(!err.isEmpty()) return validatonError(res, err)
        next()
    }
]