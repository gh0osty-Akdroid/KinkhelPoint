const { STRING, BOOLEAN, INTEGER, DOUBLE, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateId } = require('../utilities/random')
const { dataAccepted } = require('../utilities/responses')
const PointsDetail = require('./PointsDetail')
const { User } = require('./User')

const Points = db.define('Points',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    points: {
        defaultValue: 0,
        type: DOUBLE,
        allowNull: false
    },
    user_id: {
        allowNull: false,
        type: STRING,
        references: {
            model: 'users',
            key: 'phone'
        }
    }
},{
    tableName: 'points'
})

Points.sync({alter:false})







const createPoint = async(user)=>{
    await Points.build({
        "user_id":user.phone,
        "id":generateId()
    }).save().then((data)=>console.log("created")).catch(err=>console.log('err'))
}


const addMerchantPoints = async (req, res, data)=>{

}

const userPointTransfer = async (req, res, data) =>{
    const e = await PointsDetail.create(data)
    e.id = generateId()
    e.save()
}


const addBonusPoint = async(data)=>{
    const e = await PointsDetail.create(data)
    e.id = generateId()
    await e.save()
}




module.exports = {Points, createPoint, userPointTransfer, addBonusPoint, addMerchantPoints}