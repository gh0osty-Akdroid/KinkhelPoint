const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const Address = db.define('Address',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    city: {
        allowNull: false,
        defaultValue: 'Kathmandu',
        type: STRING
    },
    address: {
        allowNull: false,
        type: STRING,
    },
    country: {
        allowNull:false,
        defaultValue: 'Nepal',
        type: STRING
    },
    street_name: {
        allowNull: true,
        type: STRING
    },
    postal_code: {
        allowNull: true,
        type: STRING({length: 9})
    }
},{tableName: 'addresses'})

Address.sync({alter:false})

module.exports = Address

