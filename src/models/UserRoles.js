const { STRING, BOOLEAN, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')

const UserRoles= db.define('UserRoles', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: STRING,
        allowNull: true,
        validate:{
            isIn:{
                args:[["Customer",'Admin', 'Admin-Super','Admin-Region',"Merchant-Kirana", "Merchant-Distributor", "Merchant-Supermarket","Merchant-ECommerce", "Others", "Merchant-Cashier", "Merchant-SubMerchant"]],
                msg: "Must be specified roles."
            }
        }
    },
    user_id: {
        type: BIGINT,
        allowNull: false,
        references:{
            model:"users",
            key:"id"
        }
    },
    
}, {
    tableName: 'user_roles'
})

UserRoles.sync({alter:false})

module.exports =  UserRoles