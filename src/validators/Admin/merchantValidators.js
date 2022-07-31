const { check, validationResult } = require("express-validator")
const { Merchant } = require("../../models/Merchant")
const PointConfig = require("../../models/PointConfig")
const { User } = require("../../models/User")
const responses = require("../../utilities/responses")

exports.store = [
    check('user_id').notEmpty().withMessage('Please Enter A Valid User Id.').bail()
        .custom(async (val) => {
            const check = await User.findOne({ where: { id: val } })
            if (!check ) return Promise.reject()
            else return true
        }).withMessage('The User id you provided is wrong.').bail()
        .custom(async (val) => {   
            const data = await Merchant.findOne({ where: { user_id: val } })
            if (data) return Promise.reject()
            else return true
        }).withMessage('The Merchant is already available.').bail(),
    check('parent_company').notEmpty().withMessage('Please Enter A Valid Parent Company.').bail(),
    check('store_address').notEmpty().withMessage('Please Enter Valid Store address.').bail(),
    check('store_phone').notEmpty().withMessage('Please Enter Valid Store phone.').bail(),
    check('pan_number').notEmpty().withMessage('Please Enter Valid Pan Number.').bail()
    .custom(async (val) => {   
        const data = await Merchant.findOne({ where: { pan_number: val } })
        if (data) return Promise.reject()
        else return true
    }).withMessage('The Pan_number is already available.').bail(),
    check('region').notEmpty().withMessage('Please Enter Valid region.').bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validatonError(res, err)
        next()
    }
]

exports.update = [
    check('user_id').notEmpty().withMessage('Please Enter A Valid User Id.').bail()
        .custom(async val => {
            const check = await User.findOne({ where: { id: id } })
            if (check) return Promise.reject()
            else return true
        }).withMessage('The User id you provided is wrong.').bail(),
    check('parent_company').notEmpty().withMessage('Please Enter A Valid Parent Company.').bail(),
    check('store_address').notEmpty().withMessage('Please Enter Valid Store address.').bail(),
    check('store_phone').notEmpty().withMessage('Please Enter Valid Store phone.').bail(),
    check('pan_number').notEmpty().withMessage('Please Enter Valid Pan Number.').bail(),
    check('region').notEmpty().withMessage('Please Enter Valid region.').bail(),
    check('id').notEmpty().withMessage('An Identification Must Be Present').bail()
        .custom(async (value, { req, loc, path }) => {
            const check = await Merchant.findOne({ where: { id: value } })
            if (!check) return Promise.reject()
            else req.body.Merchant = check
        }).withMessage('Please Enter A Valid Identification').bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.notEmpty()) return responses.validatonError(res, err)
        next()
    }
]

