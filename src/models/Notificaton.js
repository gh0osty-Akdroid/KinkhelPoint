const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateUId, generateId } = require('../utilities/random')
const { blankSuccess, serverError } = require('../utilities/responses')
const { User } = require('./User')

const Notification = db.define('Notification',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    uid:{
        type:BIGINT,
        unique:true,
        allowNull:false
    },
    user_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    web_link:{
        type:STRING,
        allowNull:true,
    },
    app_link:{
        type:STRING,
        allowNull:true
    },
    notification_msg: {
        type: STRING,
        allowNull:false
    },
    seen: {
        defaultValue:false,
        type: BOOLEAN,
    },
    
},{tableName: 'notification'})

Notification.sync({alter:false})


const createNotification = async(res, data) =>{
    try {
        const uid = generateUId()
        const user = await User.findAll()
        user.forEach(async e => {
            const transaction = await db.transaction()
            const notification = await Notification.build({
                'user_id': e.id,
                "uid":uid,
                "web_link" :data.web_link,
                "app_link":data.app_link,
                "notification_msg":data.notification_msg,
            }, { transaction })
            
            await transaction.afterCommit(() => {
                notification.id = generateId()
                notification.save()
            })
            await transaction.commit()
        });
        return blankSuccess(res)
    }
    catch (err) {
        console.log(err);
        return serverError(res, err)
    }
}

module.exports = {Notification, createNotification}