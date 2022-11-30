const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateUId, generateId } = require('../utilities/random')
const { blankSuccess, serverError } = require('../utilities/responses')
const { Inventory, Products } = require('./Inventory')
const { User } = require('./User')

const ProductVariation = db.define('ProductVariation', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'products',
            key: 'id'
        },
        onDelete:"CASCADE"
    },
    size: {
        type: STRING,
        allowNull: true,
    },
    price: {
        type: STRING,
        allowNull: true
    },
}, { tableName: 'product_variation' })

ProductVariation.sync({ alter: false })

ProductVariation.belongsTo(Products, {foreignKey:"product_id"})
Products.hasMany(ProductVariation, {foreignKey:"product_id"})





module.exports = { ProductVariation }