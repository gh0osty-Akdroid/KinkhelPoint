const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const Verification = db.define('verifications',{
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
    token: {
        allowNull: false,
        type: STRING,
        unique: true
    },
    is_email: {
        defaultValue: true,
        type: BOOLEAN
    }
},{
    tableName: 'verifications'
})

Verification.sync({alter:false})

module.exports = Verification