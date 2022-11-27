const { body, check, validationResult } = require("express-validator")
const { Merchant } = require("../../models/Merchant")
const { User } = require("../../models/User")
const { Verification } = require("../../models/Verification")
const responses = require("../../utilities/responses")
const { Op } = require("sequelize")




exports.userValidator = [
    check("name").notEmpty().withMessage("Name should not be empty").bail(),
    check("phone").notEmpty().withMessage("Credential Phone Number should not be empty.").bail()
        .custom(async (value, { req }) => {
            const check = await User.findOne({ where: { phone: value }, include: [{ model: Merchant }] })
            if (req.user.phone === check.phone) return true
            else {
                if (req.user === check.Merchant) return Promise.reject()
                else return true
            }
        }).withMessage("Phone number already exists with merchant.").bail(),
    check("email").notEmpty().withMessage("Email Should not be empty.").custom(async (value, { req }) => {
        const check = await User.findOne({ where: { email: value }, include: [{ model: Merchant }] })
        if (req.user.phone === check.phone) return true
        else {
            if (check.Merchant) return Promise.reject()
            else return true
        }
    }).withMessage("Email already exists with merchant.").bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validationError(res, err)
        }
        next()
    }
]


exports.merchantValidator = [
    check("parent_company").notEmpty().withMessage("Name should not be empty").bail(),
    check("store_phone").notEmpty().withMessage("Phone Number should not be empty."),
    check("store_address").notEmpty().withMessage("Address should not be empty.").bail(),
    check("pan_number").notEmpty().withMessage("Pan Number / Store Identification Number should not be empty.").bail().
        custom(async (value, {req}) => {
            const check = await Merchant.findOne({where:{ pan_number: value }})
            if (check?.pan_number === req.merchant.pan_number) {
                return true 
            }
            else{ 
                if (check) return Promise.reject()
                else return true
            }
        }).withMessage("The Identification/ Pan Number already exists."),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validationError(res, err)
        }
        next()
    }
]

exports.ImageValidators = [
    check("image").notEmpty().withMessage("Image should not be empty").bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validationError(res, err)
        }
        next()
    }
]
    