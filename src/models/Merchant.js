const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateMerchantId, generateId } = require('../utilities/random')
const { serverError, dataAccepted } = require('../utilities/responses')
const { User } = require('./User')
const UserRoles = require('./UserRoles')


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
    site: {
        type: BIGINT,
        allowNull:true,
        references:{
            model:"site_settings",
            key:"id"
        }
    },
    secret_key:{
        type:STRING, 
        unique:true,
        allowNull:true
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


Merchant.belongsTo(Merchant, {foreignKey:"merchant_id", as:"Parent"})
Merchant.hasMany(Merchant, {foreignKey:"merchant_id", as:"Child"})

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
            region:data.region,
            site:null
        })
        merchant.id = generateId()
        await merchant.save()
        const userRoles = await UserRoles.findOne({where:{user_id:data.user_id}})
        await userRoles.update({role:body.role})
        return dataAccepted(res)
        
    } catch (err) {
        return serverError(res, err)
    }
}






Merchant.hasMany(Merchant, {foreignKey:"merchant_id"})
Merchant.belongsTo(Merchant, {foreignKey:"merchant_id"})


module.exports = { Merchant, createMerchant }