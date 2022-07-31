const { body, check, validationResult } = require("express-validator")
const { User } = require("../../models/User")
const responses = require("../../utilities/responses")



exports.LoginValidators = [
    check('email').notEmpty().withMessage('Please enter a valid value.').bail().custom(async (value ,{req, res})=>{
        const user = await User.findOne({ where: { email: value } }) || await User.findOne({ where: { phone: value } })
        if (user) req.user = user
        else Promise.reject()
    }).withMessage("User does not found").bail(),
    check('password').notEmpty().withMessage('Please enter a valid password').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            return responses.validatonError(res, err)
        }
        next()
    }
]
