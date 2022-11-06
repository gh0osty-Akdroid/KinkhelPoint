const { body, check, validationResult } = require("express-validator")
const { Merchant } = require("../../models/Merchant")
const { Points } = require("../../models/Points")
const { User } = require("../../models/User")
const { VoucherCategory } = require("../../models/VoucherCategory")
const responses = require("../../utilities/responses")



exports.create = [
    check('name').notEmpty().withMessage('Name should not be empty.').bail(),
    check('batch').notEmpty().withMessage('Batch should not be empty.').bail(),
    check('total_point').notEmpty().withMessage('Total Points should not be empty.').bail().custom(async (value, { req, res }) => {
        const point = await Points.findOne({where: {user_id: req.user.phone}})
        if (parseFloat(point.points) > parseFloat(value)){
            req.point = point
            return true
        } 
        else return Promise.reject()
    }).withMessage("The total point should not exceed your total points."),
    check('total_vouchers').notEmpty().withMessage('Total Voucher Count should not be empty.').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validationError(res, err)
        }
        next()
    }
]

exports.update = [
    check('id').notEmpty().withMessage('An Identification Must Be Present').bail()
        .custom(async (value, { req, loc, path }) => {
            const check = await VoucherCategory.findOne({ where: { id: value } })
            if (!check) return Promise.reject()
            else req.body.VoucherCategory = check
        }).withMessage('Please Enter A Valid Identification').bail(),

    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]



exports.voucherList = [
    check('validity').notEmpty().withMessage('validity should not be empty.').bail(),
    check('name').notEmpty().withMessage('name should not be empty.').bail(),
    check('userlimit').notEmpty().withMessage('User limit should not be empty.').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validationError(res, err)
        }
        next()
    }
]

