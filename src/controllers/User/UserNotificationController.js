const { Notification } = require("../../../src/models/Notificaton")


exports.getNotifactions = async (req, res) => {
    const user_id = req.params.user_id
    Notification.findAll({ where: { user_id: user_id } }).then((data) => {
        dataSuccess(res, data)
    }).catch((res) => {
        notFoundError(res, "Not found any new Notifications")
    })
}

exports.readNotifications = async (req, res) => {
    const user_id = req.params.user_id
    Notification.findAll({ where: { user_id: user_id ,seen:false} }).then((data) => {
        data.forEach(e=>{
            e.update({seen:true})
        })
        blankSuccess(res)
    }).catch((res) => {
        notFoundError(res, "Not found any new Notifications")
    })
}