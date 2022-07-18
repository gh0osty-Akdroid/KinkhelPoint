const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT, BIGINT } = require('sequelize')
const Sequelize = require('sequelize')
const db = require('../config/db')
const { sendEmail } = require('../utilities/mailer')
const { otpVerfication } = require('../utilities/otpHandler')
const { generateToken, generateCode } = require('../utilities/random')
const { validatonError, blankSuccess, serverError, dataSuccess } = require('../utilities/responses')

const Verification = db.define('verifications', {
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

const createOTPtoken = async (user, res) => {
    // try {
    //     const token_ = 123456
    //     // const transaction = await db.transaction()
    //     const token = Verification.build({
    //         'user_id': user.id,
    //         'token': token_,
    //         "is_email": false
    //     }, { transaction })

    //     await token.save().catch(err => serverError(res, err)).then(v => dataSuccess(res, user))

    //     // await transaction.afterCommit(() => {
    //     //     token.id = generateId()
    //     //     // otpVerfication(user, "subject",token_ )
    //     //     token.save()
    //     // })
    //     // await transaction.commit()
    //     // // return blankSuccess(res)
    // }
    // catch (err) {
    //     return serverError(res, err)
    // }
    const checkToken = await Verification.findOne({ where: { user_id: user.id } })
    if (checkToken) {
        await checkToken.destroy().then(() => createPhoneToken(user, res)).catch(err => console.log(err))
    }
    else createPhoneToken(user, res)
}

const createPhoneToken = async (user, res) => {
    const token = Verification.build({
        'user_id': user.id,
        'token': 111111,
        "is_email": false
    })

    await token.save().then(() => {
        return dataSuccess(res, user)
    }).catch(err => console.log(err))
}

const createEmailtoken = async (user, res) => {
    try {
        const transaction = await db.transaction()
        const token = await Verification.build({
            'user_id': user.id,
            'token': generateCode(),
            "is_email": true
        }, { transaction })

        await transaction.afterCommit(async () => {
            token.id = generateId()
            token.save()
            const data = await ejs.renderFile(__dirname + "/../../src/public/views/welcomeMail.ejs", { name: user.name, site: process.env.APP_URL, token: vCode })
            await sendEmail(user.email, "Welcome!", data)

        })
        await transaction.commit()
        return blankSuccess(res)
    }
    catch (err) {
        return serverError(res)
    }
}







module.exports = { Verification, createEmailtoken, createOTPtoken }