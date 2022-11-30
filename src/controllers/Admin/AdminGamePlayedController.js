const { default: axios } = require("axios");
const { dataSuccess, serverError, validationError, blankSuccess } = require("../../utilities/responses");
const { errorHandler } = require("../User/UserGameController");



const AdminGameUrl = axios.create({
    baseURL: process.env.GAMEURL
})


exports.allUser = async(req, res)=>{
    AdminGameUrl.get(`/userGame/game/${req.params.id}?iteration=${req.query.iteration}`).then((data)=>{
        return dataSuccess(res, data?.data?.data);
        }).catch((err)=>{
        return errorHandler(err)
    })
}

exports.user = async(req, res)=>{
    AdminGameUrl.get(`/userGame/user/${req.params.user_id}`).then((data)=>{
        return dataSuccess(res, data?.data?.data);
    }).catch((err)=>{
       return errorHandler(err)
    })
}


exports.merchant = async(req, res)=>{
    AdminGameUrl.get(`/userGame/merchant/${req.params.merchant_id}`).then((data)=>{
        return dataSuccess(res, data?.data?.data);
    }).catch((err)=>{
       return errorHandler(err)
    })
}


exports.show = async(req, res)=>{
    AdminGameUrl.get(`/userGame/play/${req.params.game_id}/${req.params.user_id}`).then((data)=>{
         return dataSuccess(res, data?.data?.data);
    }).catch((err)=>{
        return errorHandler(err)
    })
}


exports.findwinners =async(req, res) =>{
    AdminGameUrl.post(`/findWinner/${req.params.id}`, req.body).then((data)=>{
        return dataSuccess(res, data?.data?.data);
   }).catch((err)=>{
       return errorHandler(err)
   })
}