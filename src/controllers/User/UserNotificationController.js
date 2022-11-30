const { Notification } = require("../../../src/models/Notificaton")
const { notFoundError, blankSuccess, dataSuccess, serverError } = require("../../utilities/responses")


exports.getNotifactions = async (req, res) => {
    const user = req.user
    Notification.findAll({ where: { user_id: user.id } }).then((data) => {
        return dataSuccess(res, data)
    }).catch((err) => {
        return notFoundError(res, "Not found any new Notifications")
    })
}

exports.readNotifications = async (req, res) => {
    try {
        const user = req.user
        const data = await Notification.findAll({ where: { user_id: user.id, seen: false } })
        data.forEach(e => {
            e.update({ seen: true })
        })
        data.length > 0 ? blankSuccess(res) : notFoundError(res, "Not found any new Notifications")
    } catch (err) {
        serverError(res, err)
    }
}