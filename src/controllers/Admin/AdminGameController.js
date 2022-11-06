const { default: axios } = require("axios");
const { dataSuccess, serverError, validationError, blankSuccess } = require("../../utilities/responses");
const { errorHandler } = require("../User/UserGameController");

const AdminGameUrl = axios.create({
    baseURL: process.env.GAMEURL
})


exports.show = async (req, res) => {
    AdminGameUrl.get(`/games`).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}




exports.showGame = async (req, res) => {
    const id = req.params.id
    AdminGameUrl.get(`/game/${id}`).then((data) => {
        return dataSuccess(res, data?.data);
    }).catch((err) => {
     errorHandler(res, err)
    })
}


exports.delete = async (req, res) => {
    const body = req.body
    const data = {site:req.site,...body}
    AdminGameUrl.delete(`/games`, {"data": data}).then((data) => {
        return dataSuccess(res, "Deleted sucessFully");
    }).catch((err) => {
        errorHandler(res, err)
    })
}

exports.post = async (req, res) => {
    const body = req.body
    AdminGameUrl.post(`/games`, body).then((data) => {
        blankSuccess(res)
    }).catch((err) => {
        console.log(err?.response?.data)
        errorHandler(res, err)
    })
}





exports.getEnableGames = async(req, res) =>{
    AdminGameUrl.get(`/games/enabled`).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}


exports.postEnableGames = async(req, res) =>{
    const body = req.body
    AdminGameUrl.post(`/games/enabled`, body).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}

exports.deleteEnableGames = async(req, res) =>{
    AdminGameUrl.delete(`/games/enabled`, {"data":req.body}).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}



exports.Winner = async(req, res) =>{
    AdminGameUrl.put(`/winnerAnnouncement`,req.body).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}