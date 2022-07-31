const { body, check, validationResult } = require("express-validator")
const { Points } = require("../../models/Points")
const { User } = require("../../models/User")
const { validatonError } = require("../../utilities/responses")





exports.verifyTokenValidators = [
    check('token').notEmpty().withMessage('Please Enter Your token.').bail().isLength({ min: 6, max: 6 }).withMessage("The token size must be of 6 digits").bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return validatonError(res, err)
        next()
    }
]



exports.PointTransferValidators = [
    check('remarks').notEmpty().withMessage('Please give remarks.').bail(),
    check('phone').notEmpty().withMessage('Please input the transferring number.').custom(async (value, { req, res }) => {
        const user = await User.findOne({ where: { phone: value, role:"Customer" } })
        if (user) {
            req.receiver = user
            return true
        }
        else Promise.reject()
    }).withMessage("User with this cannot be found.").bail(),
    check("point").notEmpty().withMessage("Points cannot be empty").custom(async (value, { req, res }) => {
        const points = await Points.findOne({ where: { user_id: req.user.phone } })
        if (points.points>value) {
            req.Points = points
            return true
        }
        else Promise.reject()
    }).withMessage("Please enter a valid points").bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return validatonError(res, err)
        next()
    }
]