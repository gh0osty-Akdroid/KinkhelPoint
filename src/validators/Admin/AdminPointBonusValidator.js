const { check, validationResult } = require("express-validator")
const PointBonus = require("../../models/PointBonus")
const PointConfig = require("../../models/PointConfig")

exports.store = [
    check('site').notEmpty().withMessage('Please Enter A Site To Add Bonus System').bail()
    .custom(async (value, { req, loc, path }) => {
        const check = await PointConfig.findOne({where: {site: value}})
        if(check) req.body.PointConfig =check
        else return Promise.reject()
    }).withMessage('The Entered Site Cannot Be Found.').bail(),
    check('hourly_point').isNumeric().withMessage('Please Enter A Valid Hourly Rate Of Bonus').bail(),
    check('monthly_point').isNumeric().withMessage('Please Enter A Valid Monthly Rate Of Bonus').bail(),
    check('daily_point').isNumeric().withMessage('Please Enter A Valid Daily Rate Of Bonus').bail(),
    check('weekly_point').isNumeric().withMessage('Please Enter A Valid Weekly Rate Of Bonus').bail(),
    check('hourly').isBoolean().withMessage('Please Enter If The Bonus Is Hourly').bail(),
    check('weekly').isBoolean().withMessage('Please Enter If The Bonus Is Weekly').bail(),
    check('monthly').isBoolean().withMessage('Please Enter If The Bonus Is Monthly').bail(),
    check('daily').isBoolean().withMessage('Please Enter If The Bonus Is Daily').bail(),

    (req,res,next) => {
        const err = validationResult(req)
        if(!err.isEmpty()) return responses.validatonError(res, err)
        next()
    }
]

exports.update = [
    check('site').notEmpty().withMessage('Please Enter A Site To Add Bonus System').bail()
    .custom(async (value, { req, loc, path }) => {
        const check = await PointConfig.findOne({where: {site: value}})
        if(check) req.body.PointConfig =check
        else return Promise.reject()
    }).withMessage('The Entered Site Cannot Be Found.').bail(),
    check('id').notEmpty().withMessage('An Identification Must Be Present').bail()
    .custom(async (value, { req, loc, path }) => {
        const check = await PointBonus.findOne({where: {id: value}})
        if(!check) return Promise.reject()
        else req.body.PointBonus = check
    }).withMessage('Please Enter A Valid Identification').bail(),
    check('hourly_point').isNumeric().withMessage('Please Enter A Valid Hourly Rate Of Bonus').bail(),
    check('monthly_point').isNumeric().withMessage('Please Enter A Valid Monthly Rate Of Bonus').bail(),
    check('daily_point').isNumeric().withMessage('Please Enter A Valid Daily Rate Of Bonus').bail(),
    check('weekly_point').isNumeric().withMessage('Please Enter A Valid Weekly Rate Of Bonus').bail(),
    check('hourly').isBoolean().withMessage('Please Enter If The Bonus Is Hourly').bail(),
    check('weekly').isBoolean().withMessage('Please Enter If The Bonus Is Weekly').bail(),
    check('monthly').isBoolean().withMessage('Please Enter If The Bonus Is Monthly').bail(),
    check('daily').isBoolean().withMessage('Please Enter If The Bonus Is Daily').bail(),

    (req,res,next) => {
        const err = validationResult(req)
        if(!err.isEmpty()) return responses.validatonError(res, err)
        next()
    }
]

exports.destroy = [
    check('id').notEmpty().withMessage('An Identification Must Be Present').bail()
    .custom(async (value, { req, loc, path }) => {
        const check = await PointBonus.findOne({where: {id: value}})
        if(!check) return Promise.reject()
        else req.body.PointBonus = check
    }).withMessage('Please Enter A Valid Identification').bail(),

    (req,res,next) => {
        const err = validationResult(req)
        if(!err.isEmpty()) return responses.validatonError(res, err)
        next()
    }
]