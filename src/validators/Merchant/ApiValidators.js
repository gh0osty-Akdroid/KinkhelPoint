const { body, check, validationResult } = require("express-validator")
const Merchant = require("../../models/Merchant")
const responses = require("../../utilities/responses")



exports.ApiValidators = [
    check('user').notEmpty().withMessage("number cannot be empty.").bail(),
    check('merchant').notEmpty().withMessage('merchant cannot be empty.').bail(),
    check('remarks').notEmpty().withMessage('Please enter your remarks.').bail()
    .isLength({max: 500 }).withMessage('remarks should not exceed 500 letters').bail(),
    check('points').notEmpty().withMessage('Please enter your points').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            return responses.validatonError(res, err)
        }
        next()
    }
]
