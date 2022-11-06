const { check, validationResult } = require("express-validator")
const { Merchant } = require("../../models/Merchant")
const PointConfig = require("../../models/PointConfig")
const { User } = require("../../models/User")
const responses = require("../../utilities/responses")

exports.store = [
    check('name').notEmpty().withMessage('Please Enter A Valid Name.').bail(),
    check('variation').notEmpty().withMessage('Please Enter At Least A Single Valid Variation.').bail(),
    check('images').notEmpty().withMessage('Please Enter Valid Store phone.').bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]
