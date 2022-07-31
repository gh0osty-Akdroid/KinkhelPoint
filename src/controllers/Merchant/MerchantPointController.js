const { userPointTransfer, Points } = require("../../models/Points")
const { createToken, Token } = require("../../models/Token")
const { User } = require("../../models/User")
const { serverError, dataAccepted, validatonError, dataSuccess, notFoundError } = require("../../utilities/responses")


exports.requestToken = async (req, res) => {
    const user = req.user
    try {
        await createToken(req, res, user)
    } catch (error) {
        serverError(res, "Something went wrong.")
    }
}

exports.verifyToken = async (req, res) => {
    const user = req.user
    const body = req.body
    await Token.findOne({ where: { user_id: user.id, token: body.token } }).then(async () => dataAccepted(res))
        .catch((err) => validatonError(res, "The token has been expired. Please request a new token."))
}


const ReceiverEnd = async (user, data) => {
    try {
        await Points.findOne({ where: { user_id: data.phone } }).then(async (e) => {
            console.log(e.points, data.point);
            e.update({ points: (e.points + data.point) })
            const values = {
                "token": data.token,
                "points_id": e.id,
                "user_transfer_id": user.id,
                "points": data.points,
                "remarks": data.remarks,
                "others": `You received ${data.points} points from ${user.phone}`,
            }
            await userPointTransfer(req, res, values)
            
        }).catch((err) => { return err })
        return true
    } catch (error) {
        return false
    }
    

}

const SenderEnd = async (user, data, points) => {
    try {
        await points.update({ points: (points.points - data.points) })
        const values = {
            "token": data.token,
            "points_id": points.id,
            "user_transfer_id": user.id,
            "points": data.points,
            "remarks": data.remarks,
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
        const sender = await SenderEnd(user, body, req.Points)
        const receiver = await ReceiverEnd(user, body)
        console.log(sender, receiver)
    } catch (error) {
        console.log(error);

    }



}