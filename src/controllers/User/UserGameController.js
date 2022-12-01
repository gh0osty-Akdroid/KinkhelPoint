const { default: axios } = require("axios");
const { Points, addBonusPoint } = require("../../models/Points");
const { User } = require("../../models/User");
const { dataSuccess, serverError, validationError, notFoundError, blankSuccess } = require("../../utilities/responses");



const UserGameUrl = axios.create({
    baseURL: process.env.USERGAMEURL
})

const AdminGameUrl = axios.create({
    baseURL: process.env.GAMEURL
})



exports.errorHandler = (res, err) => {
    if (err?.response?.status === 404) {
        return notFoundError(res, err)
    }
    else if (err?.response?.status === 400) {
        return serverError(res, err)
    }
    else if (err?.response?.status === 406) {
        return validationError(res, err?.response?.data?.error)
    }
}


const errorHandlers = (res, err) => {
    if (err?.response?.status === 404) {
        return notFoundError(res, err)
    }
    else if (err?.response?.status === 400) {
        return serverError(res, err)
    }
    else if (err?.response?.status === 406) {
        return validationError(res, err?.response?.data?.error)
    }
}




exports.show = async (req, res) => {
    console.log(req.site)
    UserGameUrl.get(`/games?site=${req.site}`).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandlers(res, err)
    })
}




exports.showGame = async (req, res) => {
    const id = req.params.id
    UserGameUrl.get(`/game/${id}`).then((data) => {
        return dataSuccess(res, data?.data);
    }).catch((err) => {
        errorHandlers(res, err)
    })
}




exports.getPlayedGame = async (req, res) => {
    const id = req.user.id
    AdminGameUrl.get(`/userGame/user/${id}`).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        errorHandlers(res, err)
    })
}



exports.post = async (req, res) => {
    var body = req.body
    body = { ...body, user_id: req.user.id }
    await Points.findOne({ where: { user_id: req.user.phone } }).then((point) => {
        if (point.points > parseFloat(body.charge) ) {
            UserGameUrl.post(`/play`, body).then((data) => {
                point.points = point.points - parseFloat(body.charge)
                point.save()
                blankSuccess(res)
            }).catch((err) => {
                errorHandlers(res, err)
            })
        }
        else {
            validationError(res, "You dont have sufficient point to play this game.")
        }

    })

}

exports.getActiveAlternate = async(req, res) =>{
    UserGameUrl.get(`/games/alternate`).then((data) => {
        return dataSuccess(res, data?.data);
    }).catch((err) => {
        errorHandlers(res, err)
    })
}



