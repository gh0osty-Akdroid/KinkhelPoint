const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const { FLOAT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const PointBadge = db.define('PointBadge',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    points: {
        allowNull: false,
        type: INTEGER,
    },
    name: {
        allowNull: false,
        type: STRING
    },
    other: {
        allowNull: false,
        type: STRING,
    },
    site:{
        allowNull:true,
        type:BIGINT,
        references:{
            model:"site_settings",
            key:"id"
        }
    }
   },{tableName: 'point_badge'})

PointBadge.sync({alter:false})

module.exports = PointBadge

