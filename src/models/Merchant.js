const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { serverError } = require('../utilities/responses')

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
    },
    verified: {
        type: BOOLEAN,
        defaultValue:false
    }

},{tableName: 'merchants'})

Merchant.sync({alter:true})

const t = await db.transaction
const createMerchant = async (user, data, res) =>{
    try {
        await Merchant.build({
            user_id :user,
            merchant_code : 
        })
                
    } catch (err) {
        return serverError(res)        
    }
}


module.exports = {Merchant, createMerchant}