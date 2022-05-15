const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const Token = db.define('tokens',{
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

module.exports = Token