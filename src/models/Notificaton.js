const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const { Op } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateUId, generateId } = require('../utilities/random')
const { blankSuccess, serverError } = require('../utilities/responses')
const { User } = require('./User')
const UserRoles = require('./UserRoles')

const Notification = db.define('Notification', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    uid: {
        type: BIGINT,
        allowNull: true,
        references: {
            model: 'notification_id',
            key: 'uid'
        }
    },
    user_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    web_link: {
        type: STRING,
        allowNull: true,
    },
    app_link: {
        type: STRING,
        allowNull: true
    },
    notification_msg: {
        type: STRING,
        allowNull: false
    },
    site: {
        type: BIGINT,
        allowNull: false,
        references: {
            model: "site_settings",
            key: "id"
        }
    },
    seen: {
        defaultValue: false,
        type: BOOLEAN,
    },

}, { tableName: 'notification' })

Notification.sync({ alter: false })




const NotificationID = db.define('NotificationID', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    web_link: {
        type: STRING,
        allowNull: true,
    },
    site: {
        type: BIGINT,
        allowNull: false,
        references: {
            model: "site_settings",
            key: "id"
        }
    },
    app_link: {
        type: STRING,
        allowNull: true
    },
    notification_msg: {
        type: STRING,
        allowNull: false
    },
    uid: {
        type: BIGINT,
        unique: true,
        allowNull: false
    },


}, { tableName: 'notification_id' })

NotificationID.sync({ alter: false })





const createNotification = async (req, res, data) => {
    try {
        const uid = generateUId()
        const user = await User.findAll({ where: { site: req.site }, include: [{ model: UserRoles, where: { role: { [Op.like]: "Customer" } } }] })
        const a = await NotificationID.build({
            id: generateId(), uid: uid, notification_msg: data.notification_msg, "web_link": data.web_link,
            "app_link": data.app_link, "site": req.site
        })
        await a.save()
        if (user.length > 0) {
            user.forEach(async element => {
                const notification = await Notification.build({
                    'user_id': element.id,
                    "uid": uid,
                    "web_link": data.web_link,
                    "app_link": data.app_link,
                    "notification_msg": data.notification_msg,
                    "site": req.site
                })
                notification.id = generateId()
                await notification.save()
            });

            blankSuccess(res)
        }
    }
    catch (err) {
        serverError(res, err)
    }
}



module.exports = { Notification, createNotification, NotificationID }



