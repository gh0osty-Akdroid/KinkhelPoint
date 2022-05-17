const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')


const Session = db.define("Session" ,{
    user_id :{
        type: INTEGER,
        references:{
            model:"user",
            key:"id"
        },
        allowNull:false
    },
    device_information:{
        type: STRING,
        allowNull:false,
    },
    ip_information:{
        type:STRING,
        allowNull:false
    },
    location:{
        type:STRING,
        allowNull:true
    }
}, {tableName:"sessions"})

Session.sync({alter:false})

module.exports = Session