const { default: axios } = require("axios");
const { Points, addBonusPoint } = require("../../models/Points");
const { dataSuccess, serverError, validationError, notFoundError } = require("../../utilities/responses");



const UserGameUrl = axios.create({
    baseURL: process.env.USERGAMEURL
})


exports.errorHandler =(res, err) =>{
    if (err?.response?.status===404){
        return notFoundError(res, err)
    }
    else if(err?.response?.status===400){
        return serverError(res, err)
    }

    else if(err?.response?.status===406){
        return validationError(res, err?.response?.data?.error)
    }
}




exports.getGames = async (req, res) => {
    UserGameUrl.get('/games').then((data) => {
        dataSuccess(res, data?.data?.data)
    }).catch((err) => {
        serverError(res, err?.response?.data)
    })
}

exports.getGame = async (req, res) => {
    const id = req.params.id
    UserGameUrl.get(`/game/${id}`).then((data) => {
        dataSuccess(res, data?.data?.data)
    })
}

const reducePoint = async (points, point) => {
    points.points -= parseFloat(point)
    await points.save()
    const value = {
        point_id: points.id,
        points: point,
        remarks: `Your ${point} points has been reduced for playing game.`,
        other: `Your ${point} points has been reduced for playing game.`
    }
    addBonusPoint(value)
    return true
}


exports.playGame = async (req, res) => {
    let body = req.body
    let point
    const user = req.user
    body  = {...body,user_id:user.id}
    UserGameUrl.post(`/play`).then(async (data) => {
        point = data?.data?.data.charge
        const points = await Points.findOne({ where: { user_id: user.phone } })
        if (points.points > point) {
            UserGameUrl.post(`/play`, body).then(async (data) => {
                await reducePoint(points, point)
                dataSuccess(res, data?.data?.data)
            }).catch((err) => {
                if (err?.response?.status === 406) {
                    return errorHandler(res, err)
                }
            })
        }
        else return validationError(res, "You do not have sufficient point to play this game.")
    }).catch((err)=>{
        errorHandler(res, err)
    })

}

exports.playedGames = async (req, res) => {
    const user = req.user
    UserGameUrl.get(`/play/${user.id}`).then((data) => {
        dataSuccess(res, data?.data?.data)
    }).catch((err) => {
        if (err?.response?.status === 406) {
            validationError(err?.response?.data?.error?.errors[0].msg);
        }
        else return serverError(res, err)
    })
}