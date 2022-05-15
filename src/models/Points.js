const { STRING, BOOLEAN, INTEGER, DOUBLE } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const Points = db.define('Points',{
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