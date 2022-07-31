const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateMerchantId, generateId } = require('../utilities/random')
const { serverError } = require('../utilities/responses')

const VoucherList = db.define('VoucherList', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    uid: {
        type: BIGINT,
        unique:true
    },
    name:{
        type:STRING,
        allowNull:true
    },
    value: {
        allowNull: false,
        type: DOUBLE,
    },
    merchant_id: {
        allowNull: false,
        type: BIGINT,
        references:{
            model:"merchants",
            key:"id"
        }
    },
    category_id: {
        allowNull: false,
        type: BIGINT,
        references:{
            model:"voucher_category",
            key:"id"
        }
    },
    validity: {
        allowNull: true,
        type: STRING
    },
    userlimit: {
        allowNull: true,
        type: INTEGER
    },
}, { tableName: 'voucher_list' })

VoucherList.sync({ alter: true })


module.exports = {VoucherList}

