const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { serverError } = require('../utilities/responses')

const SubMerchant = db.define('SubMerchant',{
    user_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    merchant_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    submerchant_code: {
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
    },
    verified: {
        type: BOOLEAN,
        defaultValue:false
    }

},{tableName: 'sub_merchants'})

SubMerchant.sync({alter:true})





module.exports = SubMerchant