const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT,BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateId } = require('../utilities/random')

const MerchantPointConfig = db.define('MerchantPointConfig',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    merchant_id:{
        allowNull: false,
        type: BIGINT,
        references:{
            model:"merchants",
            key:"id"
        }
    },
    value:{
        allowNull: false,
        defaultValue: 1,
        type: DOUBLE
    },
    amounts:{
        allowNull: false,
        type: DOUBLE,
        defaultValue: 1,
    },
},{
    tableName: 'merchant_points_configs'
})

MerchantPointConfig.sync({alter:false})


module.exports = MerchantPointConfig