const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateId } = require('../utilities/random')
const { serverError } = require('../utilities/responses')
const { User } = require('./User')


const SiteSettings = db.define("SiteSettings", {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    sitename: {
        type: STRING,
        allowNull: false
    },
    logo: {
        type: STRING,
        allowNull: false
    },
    primary_color: {
        type: STRING,
        allowNull: true,
    },
    primary_dark_color: {
        type: STRING,
        allowNull: true
    },
    primary_light_color: {
        type: STRING,
        allowNull: true
    },
    secondary_color: {
        type: STRING,
        allowNull: true
    },
    secondary_dark_color: {
        type: STRING,
        allowNull: true
    },
    secondary_light_color: {
        type: STRING,
        allowNull: true
    },
    text_on_primary_color: {
        type: STRING,
        allowNull: true
    },
    text_on_secondary_color: {
        type: STRING,
        allowNull: true
    },

    site_phone: {
        type: STRING,
        validate: { len: [0,15] },
        allowNull: false
    },
    site_address: {
        type: STRING,
        allowNull: false
    },
    site_email: {
        type: STRING,
        allowNull: false
    },
    site_region: {
        type: STRING,
        allowNull: false
    },

    service_provider: {
        type: STRING,
        allowNull: true
    },
    host_provider: {
        type: STRING,
        allowNull: true
    },
    port: {
        type: STRING,
        allowNull: true
    },
    user_email: {
        type: STRING,
        allowNull: true
    },
    user_password: {
        type: STRING,
        allowNull: true
    },
}, { tableName: "site_settings" })

SiteSettings.sync({ alter: true
 })


module.exports = { SiteSettings }