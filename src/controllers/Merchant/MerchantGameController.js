const { default: axios } = require("axios");
const { Points, userPointTransfer } = require("../../models/Points");
const { User } = require("../../models/User");
const { dataSuccess, serverError, validationError, blankSuccess } = require("../../utilities/responses");
const { errorHandler } = require("../User/UserGameController");

const MerchantGameURL = axios.create({
    baseURL: process.env.USERGAMEURL
})

const AdminGameUrl = axios.create({
    baseURL: process.env.GAMEURL
})


exports.show = async (req, res) => {
    MerchantGameURL.get(`/games?site=${req.site}`).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}




exports.showGame = async (req, res) => {
    const id = req.params.id
    MerchantGameURL.get(`/game/${id}`).then((data) => {
        return dataSuccess(res, data?.data);
    }).catch((err) => {
        errorHandler(res, err)
    })
}




exports.getPlayedGame = async (req, res) => {
    const id = req.merchant.id
    AdminGameUrl.get(`/userGame/merchant/${id}`).then((data) => {
        return dataSuccess(res, data?.data);
    }).catch((err) => {
        errorHandler(res, err)
    })
}



exports.post = async (req, res) => {
    var body = req.body
    await User.findOne({ where: { phone: `+${req.body.phone}` } }).then(async user => {
        if (user !== null) {
            body = { ...body, user_id: user.id, merchant_id: req.merchant.id }
            await Points.findOne({ where: { user_id: user.phone } }).then((point) => {
                if (point.points > parseFloat(body.charge)) {
                    MerchantGameURL.post(`/play`, body).then(async (data) => {
                        point.points = point.points - parseFloat(body.charge)
                        point.save()
                        const values = {
                            "token": null,
                            "point_id": point.id,
                            "points": body.charge,
                            "remarks": `You spent ${body.charge} points for playing game.`,
                            "others": `You spent ${body.charge} points for playing game.`,
                        }
                        await userPointTransfer(req, res, values)
                        blankSuccess(res)
                        
                    }).catch((err) => {
                        console.log(err?.response?.data)
                        errorHandler(res, err)
                    })
                }
                else {
                    validationError(res, "You dont have sufficient point to play this game.")
                }
            })
           
        }
        else {
            body = { ...body, merchant_id: req.merchant.id }
            await Points.findOne({ where: { user_id: req.user.phone } }).then((point) => {
                if (point.points > parseFloat(body.charge)) {
                    MerchantGameURL.post(`/play`, body).then(async (data) => {
                        point.points = point.points - parseFloat(body.charge)
                        await point.save()
                        const values = {
                            "token": null,
                            "point_id": point.id,
                            "points": body.charge,
                            "remarks": `You spent ${body.charge} points for playing game.`,
                            "others": `You spent ${body.charge} points for playing game.`,
                        }
                        await userPointTransfer(req, res, values)
                        blankSuccess(res)
                        
                    }).catch((err) => {
                        errorHandler(res, err)
                    })
                }
                else {
                    validationError(res, "You dont have sufficient point to play this game.")
                }

            })




        }

    })

}

