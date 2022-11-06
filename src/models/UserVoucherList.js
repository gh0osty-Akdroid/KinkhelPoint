const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { redeemPoints } = require('../utilities/pointHandler')
const { generateId } = require('../utilities/random')
const { User } = require('./User')
const { VoucherList } = require('./VoucherList')


const UserVoucherList = db.define('UserVoucherList', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        allowNull: false,
        type: BIGINT,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    voucher_id: {
        allowNull: false,
        type: BIGINT,
        references: {
            model: "voucher_list",
            key: "id"
        }
        
    },
    region: {
        allowNull: true,
        type:STRING,
    },

}, {
    tableName: 'user_voucher_list'
})


UserVoucherList.sync({ alter: true })
UserVoucherList.belongsTo(VoucherList, {
    foreignKey:"voucher_id"
})

VoucherList.hasOne(UserVoucherList, {foreignKey:"voucher_id"})

UserVoucherList.belongsTo(User, {foreignKey:"user_id"})
User.hasOne(UserVoucherList, {foreignKey:"user_id"})



const createUserVoucherList = async (req, res, user, voucher) => {
    try {
        const data = await UserVoucherList.build({
            "user_id": user.id,
            "voucher_id": voucher.id
        })
        data.id = generateId()
        await data.save()
        return true
    } catch (error) {
        console.log(error);
    }
    
}



module.exports = { UserVoucherList, createUserVoucherList}