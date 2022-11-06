const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { generateId } = require('../utilities/random')
const { serverError } = require('../utilities/responses')
const { User } = require('./User')


const Session = db.define("Session", {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: INTEGER,
        references: {
            model: "users",
            key: "id"
        },
        allowNull: false
    },
    device_information: {
        type: STRING,
        allowNull: false,
    },
    ip_information: {
        type: STRING,
        allowNull: true
    },
    location: {
        type: STRING,
        allowNull: true
    },
    access_token: {
        type: STRING,
        allowNull: false
    }
}, { tableName: "sessions" })

Session.sync({ alter: false })



const createSession = async (req, res,user, device, token, info) => {
    try {
        if (device.isMobile) {
            const session = await Session.build({
                "id":generateId(),
                "user_id": user.id,
                "device_information": "Mobile",
                "ip_information": req.ip,
                "location": "info.location",
                "access_token": token
            })
            await session.save()
        }
        else {
            const session = await Session.build({
                "id":generateId(),
                "user_id": user.id,
                "device_information": "Web",
                "ip_information": req.ip,
                "location": "info.location",
                "access_token": token
            })
            await session.save()
           
        }
        return true
    } catch (err) {
        return serverError(res, err)
    }
}


Session.belongsTo(User,{
    foreignKey:"user_id"
})


User.hasOne(Session,{
    foreignKey:"user_id"
})


module.exports = { Session, createSession }