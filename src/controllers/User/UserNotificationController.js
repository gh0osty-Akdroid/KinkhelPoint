const { Notification } = require("../../../src/models/Notificaton")
const { notFoundError, blankSuccess, dataSuccess } = require("../../utilities/responses")


exports.getNotifactions = async (req, res) => {
    const user = req.user
    Notification.findAll({ where: { user_id: user.id } }).then((data) => {
        return dataSuccess(res, data)
    }).catch((err) => {
        return notFoundError(res, "Not found any new Notifications")
    })
}

exports.readNotifications = async (req, res) => {
    const user = req.user
    Notification.findAll({ where: { user_id: user.id, seen: false } }).then((data) => {
        data.forEach(e => {
            e.update({ seen: true })
        })
        blankSuccess(res)
    }).catch((res) => {
        notFoundError(res, "Not found any new Notifications")
    })
}