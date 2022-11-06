const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT,BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateId } = require('../utilities/random')
const { SiteSettings } = require('./SiteConfig')

const PointConfig = db.define('PointConfig',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    site:{
        allowNull: false,
        type:BIGINT,
        references:{
            model:"site_settings",
            key:"id"
        }
    },
    value:{
        allowNull: false,
        defaultValue: 1,
        type: DOUBLE
    },
    price:{
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
        type: DOUBLE,
        defaultValue: 1
    }
},{
    tableName: 'points_configs'
})

PointConfig.sync({alter:false})
PointConfig.belongsTo(SiteSettings, {foreignKey:"site",})
// SiteSettings.hasMany(PointConfig, {foreignKey:"site",})


module.exports = PointConfig