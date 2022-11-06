const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateUId, generateId } = require('../utilities/random')
const { blankSuccess, serverError } = require('../utilities/responses')
const { User } = require('./User')

const Agents = db.define('Agents', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },    
    name: {
        allowNull: false,
        type: INTEGER,
    },
    discount_percentage: {
        type: STRING,
        allowNull: true,
    },
    Validity: {
        type: STRING,
        allowNull: true
    },
    uselimit: {
        type: STRING,
        allowNull: false,
    },
    url_link: {
        type: STRING,
        allowNull: false,
    },
    others: {
        type: STRING,
        allowNull: false,
    },
    

}, { tableName: 'agents' })

Agents.sync({ alter: false })

