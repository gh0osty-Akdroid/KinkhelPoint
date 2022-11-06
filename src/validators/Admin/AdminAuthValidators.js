const { body, check, validationResult } = require("express-validator")
const { User } = require("../../models/User")
const { Verification } = require("../../models/Verification")
const responses = require("../../utilities/responses")
const { Op } = require("sequelize");
const UserRoles = require("../../models/UserRoles");



exports.LoginValidators = [
    check('email').notEmpty().withMessage('Please enter a valid value.').bail().custom(async (value ,{req, res})=>{
        const user = await User.findOne({ where: { phone: value },
            include:[{model:UserRoles,
                where:{role:{[Op.like]: 'Admin%'} }}]
            })
        if (!user) return Promise.reject()
        req.user = user
        return true
        
    }).withMessage("User Not Found.").bail(),
    check('password').notEmpty().withMessage('Please enter a valid password').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            return responses.validationError(res, err)
        }
        next()
    }
]



exports.LoginVerifyValidators = [
    check('token').notEmpty().withMessage('Please enter a valid value.').bail()
        .custom(async (value, { req }) => {
            await await User.findOne({ where: { phone: req.params.user }, attributes: {exclude: ['password']}, }).then(async(data)=>{
                const verify = await Verification.findOne({ where: { user_id: data.id, is_email: false, token:value } })
                if(verify){
                    req.user = data
                    return true
                }
                else return Promise.reject()
            }).catch((err)=> {return Promise.reject()})
        }).withMessage("Your code has been expired. Please get new one.").bail(),
    
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validationError(res, err)
        }
        next()
    }
]

