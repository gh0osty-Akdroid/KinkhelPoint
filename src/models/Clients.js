const { STRING, BOOLEAN, INTEGER, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const Clients = db.define('Clients',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        allowNull: false,
        type: STRING,
    },
    image: {
        allowNull: false,
        type: STRING
    },
    other: {
        allowNull: true,
        type: STRING,
    },
    site:{
        type:BIGINT,
        references:{
            model:"site_settings",
            key:"id"
        },
        allowNull:true
    }
   },{tableName: 'clients'})

Clients.sync({alter:false})

module.exports = Clients

