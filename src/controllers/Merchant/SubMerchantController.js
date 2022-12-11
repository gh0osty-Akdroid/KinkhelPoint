const { Merchant, createMerchant } = require("../../models/Merchant")
const MerchantPointConfig = require("../../models/MerchantPointConfig")
const { Points, userPointTransfer } = require("../../models/Points")
const { User } = require("../../models/User")
const UserRoles = require("../../models/UserRoles")
const { blankSuccess, notFoundError, dataSuccess, serverError } = require("../../utilities/responses")
const bcrypt = require("bcrypt")
const { generateId, generateUId, generateMerchantId } = require("../../utilities/random")

exports.addSubMerchant = async (req, res) => {
    try {
        const body = req.body
        var hash = await bcrypt.hash(body.password, 10)
        const user = User.build({
            "id": generateId(),
            'name': body.name,
            'phone': body.phone,
            'email': body.email,
            'uid': generateUId(),
            'password': hash,
            "site": req.site
        })
        await user.save().then(async () => {
            const merchant = Merchant.build({
                id: generateId(),
                user_id: user.id,
                merchant_id: body.merchant_id,
                parent_company: body.parent_company,
                merchant_code: generateMerchantId(),
                store_address: body.store_address,
                store_phone: body.store_phone,
                pan_number: body.pan_number,
                region: body.region,
                site: req.site
            })
            await merchant.save().then(async () => {
                await MerchantPointConfig.create({ merchant_id: merchant.id, id: generateId() })
                const userRoles = await UserRoles.create({ id: generateId(), user_id: user.id, role: body.role })
            }).catch((err) => { return serverError(res, err) })
            return dataSuccess(res, merchant)
        }).catch(err => { return serverError(res, err) })
    } catch (err) {
        serverError(res, err)
    }
}


exports.subMerchant = async (req, res) => {
    if (req.query.id) {
        await Merchant.findOne({
            where: { merchant_id: req.merchant.id, id: req.query.id }, include: {
                model: User,
                include: { model: Points },
                attributes: {
                    exclude: ['password'],
                }
            }
        }).then((data) => {
            return dataSuccess(res, data)
        }).catch((err) => {
            return notFoundError(res, "The Merchant with this credentials does not found.")
        })
    } else {
        await Merchant.findAll({ where: { merchant_id: req.merchant.id }, include: {
            model: User,
            attributes: {
                exclude: ['password'],
            }
        } }).then((data) => {
            dataSuccess(res, data)
        }).catch((err) => {
            notFoundError(res, "The Merchant with this credentials does not found.")
        })
    }

}



exports.deleteMerchant = async (req, res) => {
    await Merchant.findByPk(req.params.id).then((data) => {
        data.destroy().then((res) => {
            blankSuccess(res)
        })
    }).catch((err) => {
        notFoundError(res, "The Merchant with this credentials does not found.")
    })
}

exports.sendPoint = async (req, res) => {
    const merchantId = req.params.id
    const body = req.body
    await Merchant.findOne({
        where: { id: merchantId }, include: {
            model: User,

            include: { model: Points },
            attributes: {
                exclude: ['password'],
            }
        }
    }).then(async (data) => {
        const point = await Points.findOne({ where: { user_id: data.User.phone } })
        point.points += parseFloat(body.points)
        const values = {
            token: null,
            point_id: point.id,
            merchant_id: null,
            points: parseFloat(body.points),
            remarks: `${body.remarks}`,
            others: `You received ${parseFloat(body.points)} points from Purchase`,
        }
        await point.save()
        await userPointTransfer(req, res, values)

        const points = await Points.findOne({ where: { user_id: req.user.phone } })
        points.points -= parseFloat(body.points)
        const value = {
            token: null,
            point_id: points.id,
            merchant_id: null,
            points: parseFloat(body.points),
            remarks: `${body.remarks}`,
            others: `You Sent ${parseFloat(body.points)} points to Sub Merchant.`,
        }
        await points.save()
        await userPointTransfer(req, res, value)
        return blankSuccess(res)
    }).catch(err => {
        serverError(res, err)
    })
}
