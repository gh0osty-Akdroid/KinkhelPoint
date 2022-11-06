const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const PointBonus = db.define('PointBonus', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    point_config_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'points_configs',
            key: 'id'
        }
    },
    hourly: {
        allowNull: true,
        type: BOOLEAN
    },
    monthly: {
        allowNull: true,
        type: BOOLEAN
    },
    weekly: {
        allowNull: true,
        type: BOOLEAN
    },
    hourly_point: {
        allowNull: true,
        type: DOUBLE
    },
    weekly_point: {
        allowNull: true,
        type: DOUBLE
    },
    monthly_point: {
        allowNull: true,
        type: DOUBLE
    },
}, {
    tableName: 'points_bonus'
})

PointBonus.sync({ alter: false })

module.exports = { PointBonus }




