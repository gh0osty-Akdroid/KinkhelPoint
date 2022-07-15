const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { serverError } = require('../utilities/responses')


const Session = db.define("Session" ,{
    user_id :{
        type: INTEGER,
        references:{
            model:"users",
            key:"id"
        },
        allowNull:false
    },
    device_information:{
        type: STRING,
        allowNull:false,
    },
    ip_information:{
        type:STRING,
        allowNull:false
    },
    location:{
        type:STRING,
        allowNull:true
    }
}, {tableName:"sessions"})

Session.sync({alter:false})

const t = db.transaction()

const createSession = async (data, res) =>{
    try {
        const session = await Session.build({
            user_id:data.user.id,
            device_information:data.device_information,
            ip_information:data.ip_information,
            location:data.location
        }, {t})
        await t.afterCommit(()=> {
            session.save()
        })    
        await t.commit()        
    } catch (err) {
        serverError(res)
    }
}


module.exports = Session