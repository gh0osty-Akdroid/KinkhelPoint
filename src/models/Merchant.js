const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateMerchantId, generateId } = require('../utilities/random')
const { serverError, dataAccepted } = require('../utilities/responses')
const { User } = require('./User')

const Merchant = db.define('Merchant', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    parent_company:{
        type:STRING,
        allowNull:true
    },
    user_id: {
        allowNull: false,
        type: BIGINT,
        unique:true,
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
        allowNull: true,
        type: STRING
    },
    store_phone: {
        allowNull: true,
        type: STRING({ length: 15 })
    },
    pan_number: {
        allowNull: true,
        type: STRING,
        unique: true
    },
    verified: {
        type: BOOLEAN,
        defaultValue: false
    },
    merchant_id: {
        type: INTEGER,
        references: {
            model: "merchants",
            key: "id"
        },
        allowNull: true
    },
    region: {
        type: STRING,
        allowNull: true
    }

}, { tableName: 'merchants' })

Merchant.sync({ alter: true })


Merchant.belongsTo(User,{
    foreignKey:"user_id"
})

User.hasOne(Merchant, {
    foreignKey:'user_id'
})


const transaction = db.transaction()
const createMerchant = async (res, data) => {
    try {
        const merchant = await Merchant.build({
            user_id: data.user_id,
            parent_company: data.parent_company,
            merchant_code: generateMerchantId(),
            store_address: data.store_address,
            store_phone: data.store_phone,
            pan_number: data.pan_number,
            merchant_id: data.merchant_id,
            region:data.region
        })
        merchant.id = generateId()
        await merchant.save()
        return dataAccepted(res)
    } catch (err) {
        return serverError(res, err)
    }
}


module.exports = { Merchant, createMerchant }