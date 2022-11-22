const { STRING, BOOLEAN, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { sendEmail } = require('../utilities/mailer')
const { otpVerfication } = require('../utilities/otpHandler')
const responses = require('../utilities/responses')
const Verification = require('./Verification')
const randomstring = require('randomstring');
const ejs = require('ejs');
const { addImage } = require('../utilities/fileHandler')
const bcrypt = require('bcrypt');
const { generateId, generateUId, generateCode, generateToken } = require('../utilities/random')
const { createPoint, Points } = require('./Points')
const { registerPoint } = require('../utilities/pointHandler')
const UserRoles = require('./UserRoles')


const User = db.define('User', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: STRING,
        allowNull: true
    },
    uid: {
        type: BIGINT,
        unique: true,
        allowNull: false
    },
    phone: {
        allowNull: false,
        unique: true,
        type: STRING({ length: 15 }),
    },
    image: {
        type: STRING,
        allowNull: true
    },
    email: {
        type: STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    banned: {
        allowNull: false,
        defaultValue: false,
        type: BOOLEAN
    },
    password: {
        allowNull: true,
        type: STRING,
    },
    email_verified: {
        defaultValue: false,
        type: BOOLEAN,
    },
    phone_verified: {
        defaultValue: false,
        type: BOOLEAN,
    },
    site: {
        allowNull:true,
        type: BIGINT,
        references:{
            model:"site_settings",
            key:"id"
        }
    },
}, {
    tableName: 'users'
})


User.hasOne(Points, { foreignKey:"user_id", sourceKey: 'phone',})

User.hasMany(UserRoles, { foreignKey:"user_id"})




User.sync({ alter: false })

const createUser = async (res, body) => {
    var hash = await bcrypt.hash(body.password, 10)
    try {
        const transaction = await db.transaction()
        const user = User.build({
            'name': body.name,
            'phone': body.phone,
            'email': body.email,
            'uid': generateUId(),
            'password': hash,
            'site': body.site,
            'role': body.role
        }, { transaction })

        await transaction.afterCommit(async () => {
            user.id = generateId()
            user.uid = generateUId()
            const user_ = await user
            await user.save()
        })
        await transaction.commit()
        await UserRoles.create({user_id:user.id,role:"Customer", id:generateId()})

        return responses.blankSuccess(res)
    }
    catch (err) {
        return responses.serverError(res, err)
    }
}

User.afterCreate(async (user, res) => {
   
    await createPoint(user)
    // await registerPoint(null, res, user)
    // await Verification.createEmailtoken(user, res)
})


module.exports = { User, createUser }