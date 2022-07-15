const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const { BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const Notification = db.define('Notification',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    link:{
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

module.exports = Notification

