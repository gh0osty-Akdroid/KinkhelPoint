const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT,BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const PointConfig = db.define('PointConfig',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    site:{
        allowNull: false,
        type: STRING
    },
    value:{
        allowNull: false,
        defaultValue: 1,
        type: DOUBLE
    },
    login_points:{
        allowNull: false,
        type: STRING,
        defaultValue: 1,
    },
    register_points: {
        allowNull: false,
        type: STRING,
        defaultValue: 1
    }
},{
    tableName: 'points_configs'
})

PointConfig.sync({alter:true})

module.exports = PointConfig