const { check, validationResult } = require("express-validator")
const PointConfig = require("../../models/PointConfig")
const responses = require("../../utilities/responses")

exports.store = [
    check('site').notEmpty().withMessage('Please Enter A Valid Site Name').bail()
        .custom(async val => {
            const check = await PointConfig.findOne({ where: { site: val } })
            if (check) return Promise.reject()
            else return true
        }).withMessage('The Site Config Already Exists').bail(),
    check('value').isNumeric().withMessage('Please Enter A Valid Point Value').bail(),
    check('login_points').isNumeric().withMessage('Please Enter Valid Login Points').bail(),
    check('register_points').isNumeric().withMessage('Please Enter Valid Register Points').bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]

exports.update = [
    check('site').notEmpty().withMessage('Please Enter A Valid Site Name').bail()
        .custom(async val => {
            const check = await PointConfig.findOne({ where: { site: val } })
            if (check) return Promise.reject()
            else return true
        }).withMessage('The Site Config Already Exists').bail(),
    check('value').isNumeric().withMessage('Please Enter A Valid Point Value').bail(),
    check('login_points').isNumeric().withMessage('Please Enter Valid Login Points').bail(),
    check('register_points').isNumeric().withMessage('Please Enter Valid Register Points').bail(),
    check('id').notEmpty().withMessage('An Identification Must Be Present').bail()
        .custom(async (value, { req, loc, path }) => {
            const check = await PointConfig.findOne({ where: { id: value } })
            if (!check) return Promise.reject()
            else req.body.PointConfig = check
        }).withMessage('Please Enter A Valid Identification').bail(),

    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]

exports.destroy = [
    check('id').notEmpty().withMessage('An Identification Must Be Present').bail()
        .custom(async (value, { req, loc, path }) => {
            const check = await PointConfig.findOne({ where: { id: value } })
            if (!check) return Promise.reject()
            else req.body.PointConfig = check
        }).withMessage('Please Enter A Valid Identification').bail(),

    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]