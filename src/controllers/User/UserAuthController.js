const db = require("../../config/db")
const { createUser, User } = require("../../models/User")
const Session = require("../../models/Session")
const responses = require("../../utilities/responses")
const jwt = require('jsonwebtoken');
const Randomstring = require('randomstring')
const bcrypt = require('bcrypt');
const { createOTPtoken, Verification, createEmailtoken } = require("../../models/Verification");
const { generateCode } = require("../../utilities/random");


const generateAcessToken = async (user) => {
    const jwtToken = await jwt.sign(
        { id: user.id, phone: user.phone },
        process.env.JWTACESSSECRET,
        { expiresIn: 86400000 }
    );
    return jwtToken
}



exports.Login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = User.findOne({ where: { email: email } }) || User.findOne({ where: { phone: email } })
        await bcrypt.compare(password, user.password, async function (err, result) {
            if (result === true) {
                createOTPtoken(user)
                return responses.dataSuccess(res, { user: user })
            }
            return responses.notFoundError(res, "User with the credential does not found.")
        })
    } catch (err) {
        return responses.notFoundError(res, err)
    }

}




exports.LoginVerification = async (req, res) => {
    const email = req.params.email
    const otp = req.body.otp
    User.findOne({ where: { email: email } }) || User.findOne({ where: { phone: email } }).then(async (user) => {
        Verification.findOne({ where: { user_id: user.id }, order: [['createdAt', 'DESC']] }).then(async (data) => {
            if (data.token === otp) {
                const acessToken = await generateAcessToken(user)
                responses.dataSuccess(res, { user: user, jwtToken: acessToken })
            }
            else responses.validatonError(res, "Token is either expired or not found.")
        })
    }).catch(() => { responses.notFoundError(res, err) })
}

exports.ResendLoginOtp = async (req, res) => {
    const email = req.params.email
    const user = User.findOne({ where: { email: email } }) || User.findOne({ where: { phone: email } })
    createOTPtoken(user)
    responses.blankSuccess(res)
}

exports.Register = async (req, res) => {
    const body = req.body
    try {
        const result = await createUser(body, res)
        return responses.blankSuccess(res)
    } catch (err) {
        return responses.serverError(res, err)
    }
}


exports.emailVerification = async (req, res) => {
    const email = req.params.email
    const vCode = req.params.vCode;
    User.findOne({ where: { email: email } }).then(async(user) => {
        if (user.email_verified) responses.dataSuccess(res, "The email has already been verified.")
        Verification.findOne({ where: { user_id: user.id }, order: [['createdAt', 'DESC']] }).then(async (data) => {
            if (data.token === vCode && data.is_email) {
                responses.blankSuccess(res)
            }
            else responses.validatonError(res, "Token is either expired or not found.")
        })
    }).catch((err)=>{
        responses.notFoundError(res, "User Not Found with given email")
    })
}

exports.NewEmailVerificationLink = async (req, res) => {
    const email = req.params.email
    await User.findOne({ where: { email: email } }).then((data)=>{
        if(data.email_verified) responses.blankSuccess(res)
        createEmailtoken(data,res)
        responses.dataSuccess(res, "Email with new link has been sent")
    })
}

