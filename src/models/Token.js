const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const sendOTP = require('../utilities/otpHandler')
const { generateId, generateToken } = require('../utilities/random')

const Token = db.define('tokens',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    token: {
        allowNull: false,
        type: STRING,
        unique: true
    },
    system: {
        allowNull: false,
        type: STRING
    }
},{
    tableName: 'tokens'
})

Token.sync({alter:false})


const createToken = async(req, res, user) =>{
    const token = await Token.findOne({where:{user_id:user.id}})
    if (token) token.destroy().then(async()=>addToken(req, res, user))
    else addToken(req, res, user)
}


const addToken = async(req, res, user) =>{
    const code  = generateToken()
    const token = await Token.build({
        "user_id": user.id,
        "token": code,
        "system":"null"
    })
    token.id = generateId()
    await token.save()
    const message = `Your token is ${code}.`
    sendOTP(res,user.phone,message)
}

module.exports = {Token, createToken}