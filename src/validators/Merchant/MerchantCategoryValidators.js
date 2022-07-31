const { body, check, validationResult } = require("express-validator")
const { Merchant } = require("../../models/Merchant")
const { Points } = require("../../models/Points")
const { User } = require("../../models/User")
const responses = require("../../utilities/responses")



exports.create = [
    check('name').notEmpty().withMessage('Name should not be empty.').bail(),
    check('batch').notEmpty().withMessage('Batch should not be empty.').bail(),
    check('total_point').notEmpty().withMessage('Total Points should not be empty.').bail().custom(async (value, { req, res }) => {
        const point = await Points.findOne({where: {user_id: req.user.phone}})
        if (point.points > value)return true
        else return Promise.reject()
    }),
    check('total_vouchers').notEmpty().withMessage('Total Voucher Count should not be empty.').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validatonError(res, err)
        }
        next()
    }
]
