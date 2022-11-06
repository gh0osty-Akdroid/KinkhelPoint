const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT,BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { Merchant } = require('./Merchant')
const { User } = require('./User')
const { VoucherList } = require('./VoucherList')

const RedeemedVoucher = db.define('RedeemedVoucher',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    points: {
        allowNull:false,
        type: DOUBLE
    },
    merchant_id: {
        allowNull:true,
        type: BIGINT,
        references: {
            model: 'merchants',
            key: 'id'
        }
    },
    user_id: {
        allowNull:true,
        type: BIGINT,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    voucher_id: {
        allowNull:true,
        type: BIGINT,
        references: {
            model: 'voucher_list',
            key: 'id'
        }
    },
    remarks: {
        allowNull:false,
        type: STRING
    },
    token: {
        allowNull: true,
        type: STRING
    },
    other: {
        type: STRING,
        allowNull: true
    }
},{
    tableName: 'redeemed_voucher'
})

RedeemedVoucher.sync({alter:true})

RedeemedVoucher.belongsTo(VoucherList,{
    foreignKey:"voucher_id"
})
VoucherList.hasOne(RedeemedVoucher,{foreignKey:"voucher_id"})
RedeemedVoucher.belongsTo(User,{foreignKey:"user_id"})
User.hasOne(RedeemedVoucher,{foreignKey:"user_id"})
RedeemedVoucher.belongsTo(Merchant,{foreignKey:"merchant_id"})
Merchant.hasOne(RedeemedVoucher,{foreignKey:"merchant_id"})

module.exports = RedeemedVoucher