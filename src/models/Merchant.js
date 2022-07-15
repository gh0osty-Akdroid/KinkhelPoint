const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, INET } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateMerchantId, generateId } = require('../utilities/random')
const { serverError } = require('../utilities/responses')

const Merchant = db.define('Merchant', {
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


const transaction = db.transaction()
const createMerchant = async (user, data, res) => {
    try {
        const merchant = await Merchant.build({
            user_id: user,
            merchant_code: generateMerchantId(),
            store_address: data.store_address,
            store_phone: data.store_phone,
            pan_number: data.pan_number,
            merchant_id: data.merchant_id
        })
        merchant.id = generateId()
        merchant.save()
        return merchant
    } catch (err) {
        return serverError(res, err)
    }
}


module.exports = { Merchant, createMerchant }