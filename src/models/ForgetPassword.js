const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const ForgetPassword = db.define('ForgetPassword',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    token: {
        allowNull:false,
        type: STRING,
        unique: true
    },
    old_password: {
        allowNull: true,
        type: STRING
    },
    user_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    }
},{
    tableName: 'forget_passwords'
})

ForgetPassword.sync({alter:false})

module.exports = ForgetPassword