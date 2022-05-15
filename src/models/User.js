const { STRING, BOOLEAN } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const User = db.define('User',{
    name: {
        type: STRING,
        allowNull: true
    },
    phone:{
        allowNull:false,
        unique:true,
        type: STRING({length: 15}),
    },
    image: {
        type: STRING,
        allowNull: true
    },
    email: {
        type: STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    banned:{
        allowNull:false,
        defaultValue: false,
        type: BOOLEAN
    },
    user_name: {
        type: STRING,
        unique: true,
        allowNull:true
    },
    password: {
        allowNull: true,
        type: STRING,
    },
    email_verified: {
        defaultValue: false,
        type: BOOLEAN,
    },
    phone_verified: {
        defaultValue: false,
        type: BOOLEAN,
    },
    role: {
        type: STRING,
        defaultValue: 'Customer',
        allowNull: false,
        validate: {
            isIn:[['Customer','Merchant','Admin']]
        }
    },
},{
    tableName: 'users'
})



User.sync({alter:true})

module.exports = User