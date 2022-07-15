const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT,BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const PointsDetail = db.define('PointsDetail',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    point_id: {
        allowNull:false,
        type: INTEGER,
        references: {
            model: 'points',
            key: 'id'
        }
    },
    points: {
        allowNull:false,
        type: DOUBLE
    },
    merchant_id: {
        allowNull:true,
        type: INTEGER,
        references: {
            model: 'merchants',
            key: 'id'
        }
    },
    user_transfer_id: {
        allowNull:true,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    remarks: {
        allowNull:false,
        type: STRING
    },
    token: {
        allowNull: false,
        type: STRING
    },
    other: {
        type: STRING,
        allowNull: true
    }
},{
    tableName: 'points_details'
})

PointsDetail.sync({alter:false})

module.exports = PointsDetail