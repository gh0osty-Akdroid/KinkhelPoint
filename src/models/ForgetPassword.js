const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const ejs = require('ejs')
const { sendMail } = require('../utilities/mailer')
const sendOTP = require('../utilities/otpHandler')
const { generateCode, generateId, generateToken } = require('../utilities/random')
const { blankSuccess } = require('../utilities/responses')

const ForgetPassword = db.define('ForgetPassword', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    token: {
        allowNull: false,
        type: STRING,
        unique: true
    },
    old_password: {
        allowNull: true,
        type: STRING
    },
    user_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'forget_passwords'
})

ForgetPassword.sync({ alter: false })



const createForgetPassword = async (res, user, mode) => {
    const transaction = await db.transaction()
    const code = generateToken()
    const data = ForgetPassword.build({
        "id": generateId(),
        'user_id': user.id,
        'token': code,
        'old_password': user.password,
    }, { transaction })

    await transaction.afterCommit(async () => {
        data.id = generateId()
        await data.save()
    })
    await transaction.commit()

    sendOTP(res, user.phone, `Your verification code is: ${code}`)
    // const data_ = await ejs.renderFile(__dirname + "/../../src/public/views/passwordResetToken.ejs", { token: code })
    // sendMail(user.email, "Password Reset Code", data_)
    
}
    


module.exports = { ForgetPassword, createForgetPassword }
