const { body, check, validationResult } = require("express-validator")
const { Merchant } = require("../../models/Merchant")
const { User } = require("../../models/User")
const { UserVoucherList } = require("../../models/UserVoucherList")
const { VoucherCategory } = require("../../models/VoucherCategory")
const { VoucherList } = require("../../models/VoucherList")
const { validationError } = require("../../utilities/responses")


exports.redeemValidator = [
    check('code').notEmpty().withMessage('Please Enter redeem code.').bail()
        .custom(async (value, { req}) => {
            const voucher = await VoucherList.findOne({ where: { uid: value }, include:[{model:VoucherCategory}, {model:Merchant , include:[{model:User}]}]})
            if (new Date(voucher.VoucherCategory.validity).getTime() > new Date().getTime()) {
                req.voucher = voucher
                return true
            }
            else return Promise.reject()
        }).withMessage("The validity of the voucher has been expired.")
        .custom(async (value, { req}) => {
            const voucher = await VoucherList.findOne({ where: { uid: value }, include:[{model:VoucherCategory}, {model:Merchant , include:[{model:User}]}]})
            if(voucher.active) return true
            else return Promise.reject()
        }).withMessage("The voucher is not active now.")
        .custom(async (value, { req, loc, path }) => {
            const voucher = await VoucherList.findOne({ where: { uid: value } })
            const check = await UserVoucherList.findOne({ where: { voucher_id: voucher.id } })
            if (check) return Promise.reject()
            else return true
        }).withMessage('You already have used this redeem code').bail(),
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) return validationError(res, err)
        next()
    }
]
