const { STRING, BOOLEAN } = require('sequelize')
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


const User = db.define('User', {
    name: {
        type: STRING,
        allowNull: true
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
    user_name: {
        type: STRING,
        unique: true,
        allowNull: true
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


const createUser = async (data, res) => {
    if (data.image) {
        var image = await addImage(data.image)
    }
    if (data.password) {
        var hash = await bcrypt.hash(data.password, 10)
    }
    try {
        const transaction = await db.transaction()
        const user = await User.build({
            'name': data.name,
            'phone': data.phone,
            'email': data.email,
            'user_name': data.user_name,
            'password': hash,
            'image': image,
            'role': data.role
        }, { transaction }).save()
        transaction.afterCommit(() => {
            user.save()
        })
        transaction.commit()
        return user
    }
    catch (err) {
        return responses.serverError(res, err)
    }
}



User.afterCreate(async user => {
    const otp = randomstring.generate({
        length: 6,
        charset: 'numeric'
    })
    const vCode = randomstring.generate(126)
    let mail, Otp
    try {
        const transaction = await db.transaction()
        Otp = await Verification.build({ user_id: user.id, token: otp, isEmail: false }, { transaction })
        if (user.email) {
            mail = await Verification.build({ user_id: user.id, token: vCode, isEmail: true }, { transaction })
            const data = await ejs.renderFile(__dirname + "/../../src/public/views/welcomeMail.ejs", { name: user.name, site: process.env.APP_URL, token: vCode })
            await sendEmail(user.email, "Welcome!", data)
        }
        await otpVerfication(user.phone, "subject", otp)
        transaction.afterCommit(() => {
            if (user.email) {
                mail.save()
            }
            Otp.save()
        })
        transaction.commit()
    } catch (error) {
        console.log(error);
    }
})


module.exports = { User, createUser }