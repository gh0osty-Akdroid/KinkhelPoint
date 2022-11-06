const { check, validationResult } = require("express-validator")
const Notification = require("../../models/Notificaton")
const responses = require("../../utilities/responses")

exports.create = [
    check('notification_msg').notEmpty().withMessage('Please Enter A Valid Site Name').bail(),
    check('web_link').notEmpty().withMessage('Please Enter A web link.').bail(),
    check('app_link').notEmpty().withMessage('Please Enter app link').bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return responses.validationError(res, err)
        next()
    }
]
