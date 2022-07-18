const e = require('express')
const Notification = require('../../models/Notificaton')
const { blankSuccess, dataSuccess, notFoundError } = require('../../utilities/responses')


exports.createNotification = async (req, res) => {
    const body = req.body
    await Notification.createNotification(res, body)
}


exports.uniqueNotification = async(req, res) =>{
    await Notification.Notification.findAll().then((data)=>{
        dataSuccess(res, data)
    }).catch((err)=>notFoundError(res, "All data cannot be retrived."))
}


exports.deleteNotification = async (req, res) => {
    const uid = req.params.uid
    console.log(uid);
    await Notification.Notification.findAll({ where: { uid: uid } }).then(async(data)=>{
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            await element.destroy()
        }
        blankSuccess(res)
    })
}
