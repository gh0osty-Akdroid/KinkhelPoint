const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateMerchantId, generateId } = require('../utilities/random')
const { serverError } = require('../utilities/responses')
const { Merchant } = require('./Merchant')
const { VoucherCategory } = require('./VoucherCategory')


const VoucherList = db.define('VoucherList', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    uid: {
        type: BIGINT,
        unique: true
    },
    value: {
        allowNull: false,
        type: DOUBLE,
    },
    merchant_id: {
        allowNull: true,
        type: BIGINT,
        references: {
            model: "merchants",
            key: "id"
        }
    },
    category_id: {
        allowNull: false,
        type: BIGINT,
        references: {
            model: "voucher_category",
            key: "id"
        }
    },
    active: {
        type: BOOLEAN,
        defaultValue: false
    },
    by_admin: {
        type: BOOLEAN,
        defaultValue: false
    },
    batch: {
        type: STRING,
        allowNull:true
    },
    index:{
        type:BIGINT,
        defaultValue:0
    },
    site: {
        type: BIGINT,
        allowNull:true,
        references:{
            model:"site_settings",
            key:"id"
        }
    }
}, { tableName: 'voucher_list' })


VoucherList.belongsTo(Merchant,{
    foreignKey:"merchant_id"
})



Merchant.belongsTo(VoucherList,{
    foreignKey:"merchant_id"
})


VoucherList.belongsTo(VoucherCategory,{ foreignKey:"category_id"})
VoucherCategory.hasMany(VoucherList,{ foreignKey:"category_id"})

VoucherList.sync({ alter: false })

const updateVoucherLists = async (data) => {
    const alldata = await VoucherList.findAll({ where: { category_id: data.id } })
    alldata.forEach(async (data) => {
        data.update({ active:false })
    })
}


module.exports = { VoucherList , updateVoucherLists}

