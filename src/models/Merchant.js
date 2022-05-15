const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const Merchant = db.define('Merchant',{
    user_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    merchant_code: {
        allowNull: false,
        type: STRING,
        unique: true
    },
    store_address: {
        allowNull:true,
        type: STRING
    },
    store_phone: {
        allowNull:true,
        type: STRING({length:15})
    },
    pan_number: {
        allowNull: true,
        type: STRING,
        unique: true
    }

},{tableName: 'merchants'})

Merchant.sync({alter:false})

module.exports = Merchant