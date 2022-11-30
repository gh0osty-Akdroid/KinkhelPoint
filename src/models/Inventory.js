const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const db = require('../config/db')


const Products = db.define('Products', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        allowNull: false,
        type: STRING,
        
    },   
    merchant_id: {
        type: BIGINT,
        allowNull: false,
        references: {
            model: "merchants",
            key: "id"
        }
    }
}, { tableName: 'products' })

Products.sync({ alter: false })




const ProductImage = db.define('ProductImage', {
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
    image: {
        type: STRING,
        allowNull: true,
    }


}, { tableName: 'product_image' })


ProductImage.sync({ alter: false })


ProductImage.belongsTo(Products, {foreignKey:"product_id"})
Products.hasMany(ProductImage, {foreignKey:"product_id"})

module.exports = { Products, ProductImage }