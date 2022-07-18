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
    role: {
        type: STRING,
        defaultValue: 'Customer',
        allowNull: false,
        validate: {
            isIn: [['Customer', 'Merchant', 'Admin']]
        }
    },
}, {
    tableName: 'users'
})


User.sync({ alter: true })

const createUser = async (res, body) => {
    var hash = await bcrypt.hash(body.password, 10)
    try {
        const transaction = await db.transaction()
        const user = await User.build({
            'name': body.name,
            'phone': body.phone,
            'email': body.email,
            'uid': generateUId(),
            'password': hash,
            'role': body.role
        }, { transaction })

        await transaction.afterCommit(() => {
            user.id = generateId()
            user.uid = generateUId()
            user.save()
        })
        await transaction.commit()
        return user
    }
    catch (err) {
        return responses.serverError(res, err)
    }
}



User.afterCreate(async user => {
    await Verification.createEmailtoken(user, res)
    await Verification.createOTPtoken(user, res)
})


module.exports = { User, createUser }