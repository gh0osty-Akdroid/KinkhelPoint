const { check, validationResult } = require("express-validator")
const { Merchant } = require("../../models/Merchant")
const PointConfig = require("../../models/PointConfig")
const { User } = require("../../models/User")
const responses = require("../../utilities/responses")

exports.store = [
    check('email').optional({ checkFalsy: true }).isEmail().withMessage('Please enter the valid email').bail()
        .custom(async (value) => {
            const data = await User.findOne({ where: { email: value }, include: [{ model: Merchant }] })
            if (data) return Promise.reject()
            else return true
        }).withMessage('The merchant with this email already exists.').bail(),
        check('merchant_id').notEmpty().withMessage('Please enter the valid Merchant Id').bail()
        .custom(async (value) => {
            const data = await Merchant.findOne({ where: { id: value } })
            if (data) return true
            else return Promise.reject()
        }).withMessage('The merchant does not exists.').bail(),

    check('phone').optional({ checkFalsy: true }).custom(async (value) => {
        const data = await User.findOne({ where: { phone: value }, include: [{ model: Merchant }] })
        if (data) return Promise.reject()
        else return true
    }).withMessage('The user with this phone already exists.').bail(),
    check('parent_company').notEmpty().withMessage('Please Enter A Valid Parent Company.').bail(),
    check('store_address').notEmpty().withMessage('Please Enter Valid Store address.').bail(),
    check('store_phone').notEmpty().withMessage('Please Enter Valid Store phone.').bail(),
    check('pan_number').notEmpty().withMessage('Please Enter Valid Pan Number.').bail()
        .custom(async (val) => {
            const data = await Merchant.findOne({ where: { pan_number: val } })
            if (data) return Promise.reject()
            else return true
        }).withMessage('The Pan number is already available.').bail(),
    check('region').notEmpty().withMessage('Please Enter Valid region.').bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]

exports.update = [
    check('merchant_id').notEmpty().withMessage('An Identification Must Be Present').bail()
        .custom(async (value, { req, loc, path }) => {
            const check = await Merchant.findOne({ where: { id: value } })
            if (!check) return Promise.reject()
            else req.body.Merchant = check
        }).withMessage('Please Enter A Valid Identification').bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]

