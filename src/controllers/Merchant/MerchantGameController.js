const { default: axios } = require("axios");
const { User } = require("../../models/User");
const { dataSuccess, serverError, validationError, blankSuccess } = require("../../utilities/responses");
const { errorHandler } = require("../User/UserGameController");

const MerchantGameURL = axios.create({
    baseURL: process.env.USERGAMEURL
})


exports.show = async (req, res) => {
    MerchantGameURL.get(`/games`).then((data) => {
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




exports.getPlayedGame = async(req, res) =>{
    const id = req.merchant.id
    MerchantGameURL.get(`/play?merchant=${id}`).then((data) => {
        return dataSuccess(res, data?.data);
    }).catch((err) => {
        errorHandler(res, err)
    })
}



exports.post = async (req, res) => {
    var body = req.body
    await User.findOne({ where: { phone: `+${req.body.phone}` } }).then(user => {
        if (user !== null) {
            body = { ...body, user_id: user.id, merchant_id: req.merchant.id }
            MerchantGameURL.post(`/play`, body).then((data) => {
                blankSuccess(res)
            }).catch((err) => {
                console.log(err?.response?.data)
                errorHandler(res, err)
            })
        }
        else {
            body = { ...body, merchant_id: req.merchant.id }
            console.log(body)
            MerchantGameURL.post(`/play`, body).then((data) => {
                blankSuccess(res)
            }).catch((err) => {
                
                errorHandler(res, err)
            })
        }

    })

}

