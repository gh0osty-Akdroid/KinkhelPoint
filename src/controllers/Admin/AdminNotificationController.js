const Notification = require('../../models/Notificaton')
const { getPagination, getPagingData } = require('../../utilities/paginator')
const { blankSuccess, dataSuccess, notFoundError, serverError } = require('../../utilities/responses')


exports.createNotification = async (req, res) => {
    const body = req.body
    Notification.createNotification(req, res, body)
}


exports.uniqueNotification = async (req, res) => {
    const { page, size, site } = req.query;
    const { limit, offset } = await getPagination(page, size);
    await Notification.NotificationID.findAndCountAll({ limit: limit, offset: offset, where: { site: req.site } }).then(async(data) => {
        const e = await getPagingData(data,page, limit)
        dataSuccess(res, e)
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
    }).then(async (e) => dataSuccess(res, "Done Delete.")).catch(async (err) => serverError(res, "No Notification with this identification found."))

}
