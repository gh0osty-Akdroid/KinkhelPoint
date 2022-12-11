const { Points } = require("../../models/Points")
const PointsDetail = require("../../models/PointsDetail");
const { Token, createToken } = require("../../models/Token");
const { User } = require("../../models/User");
const { getPagingData, getPagination } = require("../../utilities/paginator");
const { dataSuccess, serverError, notFoundError, dataAccepted, validationError } = require("../../utilities/responses")


exports.PointDetails = async (req, res) => {
    try {
        const { page } = req.query;
        const { limit, offset } = await getPagination(page, null);
        await Points.findOne({ where: { user_id: req.user.phone },}).then(async (data) => {
            await PointsDetail.findAndCountAll({ where: { point_id: data.id }, limit: limit, offset: offset , order: [["createdAt", "DESC"]] }).then(async (e) => {
                const data = await getPagingData(e, page, limit)
                dataSuccess(res, data)
            }).catch((err) => notFoundError(res, err))
        })
    } catch (error) {
        serverError(res, error)
    }

}


exports.Point = async (req, res) => {
    try {
        const { page } = req.query;
        const { limit, offset } = await getPagination(page, null);
        await Points.findOne({ where: { user_id: req.user.phone } }).then(async (data) => {

            dataSuccess(res, data)
        }).catch((err) => notFoundError(res, err))
    } catch (error) {
        serverError(res, error)
    }

}



exports.requestToken = async (req, res) => {
    const user = req.user
    var { customer } = req.query
    try {
        if (customer) {
            await User.findOne({ where: { phone: `${customer}` } }).then((data) => {
                data ? createToken(req, res, data) : notFoundError(res, "Requested user has not been found.")
            }).catch(() => {
                serverError(res, "Something went wrong")
            })
        }
        else {
            await createToken(req, res, user)
        }
    } catch (error) {
        serverError(res, "Something went wrong.")
    }
}

exports.verifyToken = async (req, res) => {
    const user = req.user
    const body = req.body
    const { customer } = req.query
    if (customer) {
        const user_ = await User.findOne({ where: { phone: `${customer}` } })
        await Token.findOne({ where: { user_id: user_.id, token: body.token } }).then(async (data) => {
            data !== null ? dataSuccess(res, user_) : validationError(res, "The token has been expired. Try again later.")
        }).catch((err) => {
            serverError(res, err)
        })
    } else {
        await Token.findOne({ where: { user_id: user.id, token: body.token } }).then(async (data) => {
            data !== null ? dataAccepted(res) : validationError(res, "The token has been expired. Try again later.")
        }).catch((err) => serverError(res, err))
    }
}


const ReceiverEnd = async (req, res, user, data) => {
    try {
        await Points.findOne({ where: { user_id: data.phone } }).then(async (e) => {
            e.update({ points: (parseFloat(e.points) + parseFloat(data.point)) })
            const values = {
                "token": data.token,
                "point_id": e.id,
                "user_transfer_id": user.id,
                "points": data.point,
                "remarks": `You received ${data.points} points from ${user.phone}`,
                "others": `You received ${data.points} points from ${user.phone}`,
            }
            await userPointTransfer(req, res, values)

        }).catch((err) => { return err })
        return true
    } catch (error) {
        return false
    }


}

const SenderEnd = async (req, res, user, data, points) => {
    try {
        await points.update({ points: (parseFloat(points.points) - parseFloat(data.point)) })
        const values = {
            "token": data.token,
            "point_id": points.id,
            "user_transfer_id": user.id,
            "points": data.point,
            "remarks": `You sent ${data.points} points to ${data.phone}`,
            "others": `You sent ${data.points} points to ${data.phone}`,
        }
        await userPointTransfer(req, res, values)
        return true
    } catch (error) {
        return error
    }


}

exports.pointTransfer = async (req, res) => {
    try {
        const user = req.user
        const body = req.body
        await SenderEnd(req, res, user, body, req.Points).then(async () => {
            await ReceiverEnd(req, res, user, body).then(() => {
                dataSuccess(res, "Your points have been sent sucesfully!")
            })
        }).catch((err) => {
            serverError(res, err)
        })
    } catch (error) {
        serverError(res, err)

    }
}