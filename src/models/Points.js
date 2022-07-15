const { STRING, BOOLEAN, INTEGER, DOUBLE, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

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

module.exports = Points