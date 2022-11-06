const { check, validationResult } = require("express-validator")
const { SiteSettings } = require("../../models/SiteConfig")
const responses = require("../../utilities/responses")

exports.store = [
    check('sitename').custom(async val => {
        const check = await SiteSettings.findOne({ where: { sitename: val } })
        if (check) return Promise.reject()
        else return true
    }).withMessage('The site config of this name already exists').bail()
    .notEmpty().withMessage('The site config of this name should not be empty').bail(),
    check('site_region').notEmpty().withMessage('Please Enter A Valid Site Name').bail()
        .custom(async val => {
            const check = await SiteSettings.findOne({ where: { site_region: val } })
            if (check) return Promise.reject()
            else return true
        }).withMessage('The site config of this region already exists').bail(),
    check('site_phone').notEmpty().withMessage('Please Enter A Valid Site Phone').bail(),
    check('site_email').notEmpty().withMessage('Please Enter A Valid Site Email').bail(),
    check('logo').notEmpty().withMessage('Please Enter A Valid Site Logo').bail(),
    check('site_address').notEmpty().withMessage('Please Enter A Valid Site Address').bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]


exports.destroy = [
    check('uid').notEmpty().withMessage('An Identification Must Be Present').bail()
        .custom(async (value, { req, loc, path }) => {
            const check = await SiteSettings.findOne({ where: { id: value } })
            if (!check) return Promise.reject()
            else req.body.SiteSettings = check
        }).withMessage('Please Enter A Valid Identification').bail(),

    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]