const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateUId, generateId } = require('../utilities/random')
const { blankSuccess, serverError } = require('../utilities/responses')
const { User } = require('./User')

const Banners = db.define('Banners', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },    
    index: {
        allowNull: false,
        type: INTEGER,
    },
    image: {
        type: STRING,
        allowNull: true,
    },
    text: {
        type: STRING,
        allowNull: true
    },
    link: {
        type: STRING,
        allowNull: false,
    },
    others: {
        type: STRING    ,
        allowNull: true,
    },
    site:{
        type:BIGINT,
        references:{
            model:"site_settings",
            key:"id"
        },
        allowNull:true
    }
    

}, { tableName: 'banners' })

Banners.sync({ alter: false })

module.exports ={Banners}

