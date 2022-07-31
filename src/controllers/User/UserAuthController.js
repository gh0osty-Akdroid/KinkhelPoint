const db = require("../../config/db")
const { createUser, User } = require("../../models/User")
const Session = require("../../models/Session")
const responses = require("../../utilities/responses")
const jwt = require('jsonwebtoken');
const useragent = require('express-useragent');
const bcrypt = require('bcrypt');
const { createOTPtoken, Verification, createEmailtoken } = require("../../models/Verification");
const { generateCode } = require("../../utilities/random");
const { createPoint } = require("../../models/Points");


const generateAcessToken = async (user) => {
    const jwtToken = await jwt.sign(
        { id: user.id, phone: user.phone },
        process.env.JWTACESSSECRET,
        { expiresIn: 86400000 }
    );
    return jwtToken
}


exports.Register = async (req, res) => {
    const body = req.body
    const result = await createUser(res, body)
    
}





exports.Login = async (req, res) => {
    const { phone, password } = req.body
    try {
        const user = await User.findOne({ where: { phone: phone } }) || await User.findOne({ where: { email: phone } })
            await bcrypt.compare(password, user.password, async function (err, result) {
                if (result === true) createOTPtoken(res, user)
                else return responses.notFoundError(res, "User with these credentials cannot be found.")
            })
    } catch (err) {
        return responses.notFoundError(res, err)
    }
}




const checkSession = async (req, res, user, token) => {
    const device = req.useragent
    let data
    if (device.isMobile) data = "Mobile"
    else data = "Web"
    const session = await Session.Session.findOne({ where: { user_id: user.id, device_information: data } })
    if (session) return session.destroy().then(async()=> await Session.createSession(res, user, device, token, "info"))
    else await Session.createSession(req, user,device, token,"info")
}

exports.LoginVerification = async (req, res) => {
    const user_ = req.params.user
    const otp = req.body.otp
    const device = req.useragent
    let info
    const user = await User.findOne({ where: { phone: user_ } }) || await User.findOne({ where: { email: user_ } })
    if (!user) {
        responses.notFoundError(res, "user cannot be found of following credentials.")
    } else {
        Verification.findOne({ where: { user_id: user.id, is_email: false } }).then(async (data) => {
            if (data.token === otp) {
                const accessToken = await generateAcessToken(user)
                const response = await checkSession(req, res, user,accessToken)
                if (response) responses.dataSuccess(res, { user: user, token: accessToken })
                else responses.serverError(res,"err")
            }
            else responses.validatonError(res, "Token is either expired or not found.")
        })
    }

}


exports.ResendLoginOtp = async (req, res) => {
    const user_ = req.params.user
    console.log(user_);
    const user = await User.findOne({ where: { phone: user_ } }) || await User.findOne({ where: { email: user_ } })
    if (!user) {
        responses.notFoundError(res, "user cannot be found of following credentials.")
    } else {
        await createOTPtoken(res, user)
    }

}


exports.emailVerification = async (req, res) => {
    const email = req.params.email
    const vCode = req.params.vCode;
    User.findOne({ where: { email: email } }).then(async (user) => {
        if (user.email_verified) responses.dataSuccess(res, "The email has already been verified.")
        Verification.findOne({ where: { user_id: user.id, is_email: true } }).then(async (data) => {
            if (data.token === vCode) {
                responses.blankSuccess(res)
            }
            else responses.validatonError(res, "Token is either expired or not found.")
        })
    }).catch((err) => {
        responses.notFoundError(res, "User Not Found with given email")
    })
}

exports.NewEmailVerificationLink = async (req, res) => {
    const email = req.params.email
    await User.findOne({ where: { email: email } }).then((data) => {
        if (data.email_verified) responses.blankSuccess(res)
        createEmailtoken(data, res)
        responses.dataSuccess(res, "Email with new link has been sent")
    })
}

