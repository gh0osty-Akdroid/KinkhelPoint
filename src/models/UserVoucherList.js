const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { redeemPoints } = require('../utilities/pointHandler')
const { generateId } = require('../utilities/random')


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

}, {
    tableName: 'user_voucher_list'
})


UserVoucherList.sync({ alter: true })


const createUserVoucherList = async (req, res, user, voucher) => {
    try {
        const data = await UserVoucherList.create({
            "user_id": user,
            "voucher_id": voucher.id
        })
        data.id = generateId()
        await data.save()
        await redeemPoints(req, res, user, voucher)
        return true
    } catch (error) {
        
    }
    
}

module.exports = { UserVoucherList, createUserVoucherList}