const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const { JSON } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')


const VoucherCategory = db.define('VoucherCategory', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    merchant_id: {
        allowNull: true,
        type: BIGINT,
        references: {
            model: 'merchants',
            key: 'id'
        }
    },
    name: {
        allowNull: false,
        type: STRING,
        unique: false
    },
    batch: {
        allowNull:false,
        type: JSON(1000)
    },
    total_point:{
        type:DOUBLE,
        allowNull:false
    },
    uid:{
        type:BIGINT,
        allowNull:false,
        unique:true
    },
    total_vouchers:{
        type:INTEGER,
        allowNull:false
    },
    validity: {
        allowNull: true,
        type: STRING
    },
    site:{
        type:BIGINT,
        allowNull:false,
        references:{
            model:"site_settings",
            key:"id"
        }
    },
    active:{
        type:BOOLEAN,
        defaultValue:true
    },
    
    by_admin:{
        type:BOOLEAN,
        defaultValue:false

    }
}, {
    tableName: 'voucher_category'
})


VoucherCategory.sync({ alter: true })

module.exports ={VoucherCategory, }