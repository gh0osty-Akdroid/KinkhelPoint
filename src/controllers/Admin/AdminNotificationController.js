const e = require('express')
const Notification = require('../../models/Notificaton')
const { blankSuccess, dataSuccess, notFoundError, serverError } = require('../../utilities/responses')


exports.createNotification = async (req, res) => {
    const body = req.body
    Notification.createNotification(res, body)
}


exports.uniqueNotification = async (req, res) => {
    await Notification.NotificationID.findAll().then((data) => {
        dataSuccess(res, data)
    }).catch((err) => notFoundError(res, "All data cannot be retrived."))
}


exports.deleteNotification = async (req, res) => {
    const uid = req.params.uid
    await Notification.NotificationID.findOne({ where: { uid: uid } }).then(async (e) => {
        await Notification.Notification.findAll({ where: { uid: uid } }).then(async (data) => {
            data.forEach(async (element) => {
                element.destroy()
            })
        })
        await e.destroy()
    }).then(async (e) => dataSuccess(res, "Done Delete.")).catch(async(err)=>serverError(res, "No Notification with this identification found."))

}
