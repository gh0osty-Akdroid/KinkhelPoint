const Notification = require('../../models/Notificaton')
const { blankSuccess, dataSuccess, notFoundError } = require('../../utilities/responses')


exports.createNotification = async (req, res) => {
    const body = req.body
    Notification.createNotification(res, body)
    blankSuccess(res)
}

exports.deleteNotification = async (req, res) => {
    const uid = req.params.uid
    Notification.Notification.findAll({ where: { uid: uid } }).then(async(data)=>{
        data.forEach(e=>{
            e.destroy()
        })
        blankSuccess(res)
    }).catch((err)=>{
        notFoundError(res,"Not found these Notifications")
    })
}
