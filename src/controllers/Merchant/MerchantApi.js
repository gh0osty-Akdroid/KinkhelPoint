const { Merchant } = require("../../models/Merchant")
const MerchantPointConfig = require("../../models/MerchantPointConfig")
const { Points, userPointTransfer } = require("../../models/Points")
const { User } = require("../../models/User")
const { generateUId, generateId } = require("../../utilities/random")
const { dataSuccess, serverError, validationError } = require("../../utilities/responses")

exports.ApiController = async (req, res) => {
    try {
        const body = req.body
        const merchant = await Merchant.findOne({ where: { merchant_code: body.MC, secret_key: body.SK }, include: [{ model: User }] })
        const user = await User.findOrCreate({ where: { phone: body.UP }, defaults: { phone: body.UP, uid: generateUId(), id: generateId() } })
        const pointGained = await PointConfiguration(merchant, body)
        await MerchantEnd(req, res, merchant, user, { point: pointGained, ...body })
    }
    catch (err) {
        serverError(res, err)
    }
}


const PointConfiguration = async (merchant, body) => {
    const data = await MerchantPointConfig.findOne({ where: { merchant_id: merchant.id } })
    const point = (parseFloat(body.TA) * parseFloat(data.value)) / parseFloat(data.amounts)
    return point.toFixed(2)

}

const MerchantEnd = async (req, res, merchant, user, body) => {
    console.log(merchant?.User?.phone)
    await Points.findOne({ where: { user_id: merchant?.User?.phone } }).then(async (e) => {
        console.log(e.points)
        if (parseFloat(e.points) < parseFloat(body.point)) {
            return validationError(res, "Your point is not sufficient.")
        }
        e.update({ points: (parseFloat(e.points) - parseFloat(body.point)) })
        const values = {
            "token": null,
            "point_id": e.id,
            "merchant_id": merchant.id,
            "points": body.point,
            "remarks": body.RE,
            "others": `You sent ${body.point} points to ${body.UP} for purchasing of amount ${body.TA}.`,
        }
        await userPointTransfer(req, res, values)
        await UserEnd(req, res, merchant, user, body)
    })


}

const UserEnd = async (req, res, merchant, user, body) => {
    await Points.findOrCreate({ where: { user_id: user[0].phone }, defaults: { user_id: user[0].phone, id: generateId() } }).then(async (data) => {
        var e = data[0]
        e.update({ points: (parseFloat(e.points) + parseFloat(body.point)) })
        const values = {
            "token": null,
            "point_id": e.id,
            "merchant_id": null,
            "points": body.point,
            "remarks": body.RE,
            "others": `You received ${body.point} points from ${merchant.parent_company} for purchasing of amount ${body.TA}.`,
        }
        await userPointTransfer(req, res, values).then(() => {
            dataSuccess(res, "Done")
        })
    })
}