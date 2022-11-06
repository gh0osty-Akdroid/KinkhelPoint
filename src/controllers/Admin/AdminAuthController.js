const db = require("../../config/db")
const { createUser, User } = require("../../models/User")
const { Merchant, createMerchant } = require('../../models/Merchant')
const SubMerchant = require('../../models/Merchant')
const responses = require("../../utilities/responses")
const jwt = require('jsonwebtoken');
const Randomstring = require('randomstring')
const bcrypt = require('bcrypt')
const Session = require('../../models/Session')
const { createOTPtoken, Verification } = require("../../models/Verification")


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
        const user = req.user
        await bcrypt.compare(password, user.password, async function (err, result) {
            if (result === true) await createOTPtoken(res, user)
            else return responses.notFoundError(res, "Credentials does not match.")
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
    if (session) return session.destroy().then(async () => await Session.createSession(req,res, user, device, token, "info"))
    else await Session.createSession(req,res, user, device, token, "info")
}

exports.LoginVerification = async (req, res) => {
    const user = req.user
    const device = req.useragent
    const accessToken = await generateAcessToken(user)
    const response = await checkSession(req, res, user, accessToken)
    if (response) responses.dataSuccess(res, { user: user, token: accessToken })
    else responses.serverError(res, "Something went wrong")
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




