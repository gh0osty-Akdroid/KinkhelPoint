const { default: axios } = require("axios");
const { dataSuccess, serverError, validationError, blankSuccess } = require("../../utilities/responses");
const { errorHandler } = require("../User/UserGameController");

const AdminGameUrl = axios.create({
    baseURL: process.env.GAMEURL
    // baseURL :"http://52.26.60.188:6969/api/v1/admin/"
})


exports.show = async (req, res) => {
    AdminGameUrl.get(`/games?search=${!req.query.input ? "" : req.query.input}&site=${req.site}`).then((data) => {
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
    const data = { site: req.site, ...body }
    AdminGameUrl.delete(`/games`, { "data": data }).then((data) => {
        return dataSuccess(res, "Deleted sucessFully");
    }).catch((err) => {
        errorHandler(res, err)
    })
}

exports.post = async (req, res) => {
    const body = req.body
    AdminGameUrl.post(`/games`, { region: req.site, ...body }).then((data) => {
        blankSuccess(res)
    }).catch((err) => {
        errorHandler(res, err)
    })
}





exports.getEnableGames = async (req, res) => {
    AdminGameUrl.get(`/games/enabled`).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}




exports.postAlternateGame = async (req, res) => {
    const body = req.body
    AdminGameUrl.post(`/games/alternate`, body).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}



exports.getAlternateGame = async (req, res) => {
    const body = req.body
    AdminGameUrl.get(`/games/alternate`, body).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}




exports.postEnableGames = async (req, res) => {
    const body = req.body
    AdminGameUrl.post(`/games/enabled`, body).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}

exports.deleteEnableGames = async (req, res) => {
    AdminGameUrl.delete(`/games/enabled`, { "data": req.body }).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}



exports.Winner = async (req, res) => {
    AdminGameUrl.put(`/winnerAnnouncement`, req.body).then((data) => {
        return dataSuccess(res, data?.data?.data);
    }).catch((err) => {
        return errorHandler(res, err)
    })
}






exports.AddWinner = async (req, res) => {
    console.log(req.body)
    try {
        AdminGameUrl.post('/winners', req.body).then(data => {
            return dataSuccess(res, data?.data?.data)
        }).catch(err => {
            return errorHandler(err)
        })
    } catch (err) {
        return errorHandler(res, err)

    }

}


exports.CheckWinnigNumber = async (req, res) => {
    AdminGameUrl.post(`/findWinner/${req.params.iterationId}`, { number: req.body }).catch(err => {
        return errorHandler(err)
    }).then(data => {
        return dataSuccess(res, data?.data?.data)
    })
}


exports.getIterations = async (req, res) => {
    AdminGameUrl.get(`/iterations/${req.params.id}`).then(data => {
        return dataSuccess(res, data?.data?.data)
    }).catch(err => {
        return errorHandler(err)
    })
}

exports.AddWinningNumber = async (req, res) => {
    AdminGameUrl.post(`/iterations`, req.body).then(data => {
        return dataSuccess(res, data?.data?.data)
    }).catch(err => {
        return errorHandler(err)
    })
}

// exports.Winner = async (req, res) =>{
//     AdminGameUrl.get().catch.then()
// }