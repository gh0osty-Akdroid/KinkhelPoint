const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const ejs = require('ejs')
const { sendMail } = require('../utilities/mailer')
const sendOTP = require('../utilities/otpHandler')
const { generateToken, generateCode, generateId } = require('../utilities/random')
const { validationError, blankSuccess, serverError, dataSuccess } = require('../utilities/responses')

const Verification = db.define('verifications', {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        allowNull: false,
        type: BIGINT,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    token: {
        allowNull: false,
        type: STRING,
        unique: false
    },
    is_email: {
        defaultValue: true,
        type: BOOLEAN
    }
}, {
    tableName: 'verifications'
})

Verification.sync({ alter: false })

const createOTPtoken = async (res, user) => {
    const checkToken = await Verification.findOne({ where: { user_id: user.id, is_email: false } })
    if (checkToken) {
        await checkToken.destroy().then(async() => await createPhoneToken(res, user)).catch(err => serverError(res,err))
    }
    else createPhoneToken(res, user)
}

const createPhoneToken = async (res, user) => {
    const OTP = generateToken()
    const token = Verification.build({
        "id":generateId(),
        'user_id': user.id,
        'token': OTP,
        "is_email": false
    })

    await token.save().then(() => {
        sendOTP(res, user.phone, `Your Verification Code is: ${OTP}`)
    }).catch(err => console.log(err))
}



const createEmailtoken = async (user,type, res) => {
    try {
        const transaction = await db.transaction()
        const vCode = generateToken()
        const token = Verification.build({
            'user_id': user.id,
            'token': vCode,
            "is_email": true
        }, { transaction })

        await transaction.afterCommit(async () => {
            token.id = generateId()
            await token.save()
            if (data === "welcome") {
                const data = await ejs.renderFile(__dirname + "/../../src/public/views/welcomeMail.ejs", { user: user, token: vCode })
                await sendMail(user, "Welcome!", data)
            }
            if (data === "forget") {
                const data = await ejs.renderFile(__dirname + "/../../src/public/views/forgetPassword.ejs", { user: user, token: vCode })
                await sendMail(user, "Welcome!", data)
            }
            // if (data === "welcome") {
            //     const data = await ejs.renderFile(__dirname + "/../../src/public/views/welcomeMail.ejs", { user: user, site: process.env.APP_URL, token: vCode })
            //     await sendMail(user, "Welcome!", data)
            // }
            // if (data === "welcome") {
            //     const data = await ejs.renderFile(__dirname + "/../../src/public/views/welcomeMail.ejs", { user: user, site: process.env.APP_URL, token: vCode })
            //     await sendMail(user, "Welcome!", data)
            // }
            

        })
        await transaction.commit()
    }
    catch (err) {
        return console.log(err)
    }
}







module.exports = { Verification, createEmailtoken, createOTPtoken }