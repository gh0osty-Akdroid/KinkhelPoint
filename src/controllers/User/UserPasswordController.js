const db = require("../../config/db")
const { createUser, User } = require("../../models/User")
const Session = require("../../models/Session")
const responses = require("../../utilities/responses")
const jwt = require('jsonwebtoken');
const Randomstring = require('randomstring')
const bcrypt = require('bcrypt');
const ForgetPassword = require("../../models/ForgetPassword");
const { sendEmail } = require("../../utilities/mailer");


exports.forget_pwd = async (req, res) => {
    const body = req.body
    const tokens = await Math.random().toString().substring(2, 8)
    const user_ = await User.findOne({ where: { email: body.email } }).then(async () => {
        const user = await ForgetPassword.findOne({ where: { user_id: user_.id } })
        if (!user) {
            const token = ForgetPassword.build({
                user_id: user_.id,
                token: tokens,
                old_password: user_.password
            })
            const data = ejs.renderFile('./src/public/views/passwordResetToken.ejs', { token: tokens })
            await await sendEmail(body.email, "Reset Your Password", data)
            await token.save().then((res) => responses.blankSuccess(res))
        }
        else {
            await user.update({ token: tokens, old_password: user_.password }).then(async (user) => {
                const data = await ejs.renderFile('./src/public/View/passwordResetToken.ejs', { token: tokens })
                await sendEmail(body.email, "Reset Your Password", data)
                responses.blankSuccess(res)
            }).catch((err) => responses.forbiddenError(res, err))
        }
    }).catch((res) => {
        return responses.notFoundError(res, "User not found with provided email.")
    })
}

exports.reset_pwd = async (req, res) => {
    const email = req.params.email
    const token = req.body.token
    const user = User.findOne({ where: { email: email } }).then(async () => {
        const user_ = await ForgetPassword.findOne({ where: { token: token, user: email } })
        if (user_) {
            responses.dataSuccess(res, user)
        }
        else {
            responses.unauthorizedError(res, "Token has been expired.")
        }
    }).catch((err) => {
        responses.notFoundError(res, "User Not found.")
    })
}

exports.new_pwd = async (req, res) => {
    const body = req.body
    const email = req.params.email
    await User.findOne({ where: { email: email } }).then(async (user) => {
        await bcrypt.hash(body.password, saltRounds).then(async (hash) => {
            user.update({ password: hash })
        })
        responses.blankSuccess(res)
    }).catch((err) => responses.serverError(res, err))
}

exports.change_password = async (req, res) => {
    const body = req.body
    const email = req.params.email
    await User.findOne({ where: { email: email } }).then(async (user) => {
        await bcrypt.compare(password, user.password, async function (err, result) {
            if (result === true) {
                await bcrypt.hash(body.new_password, saltRounds).then(async (hash) => {
                    user.update({ password: hash })
                })
                return responses.blankSuccess(res)
            }
            return responses.validatonError(res, "Old password doesnot match")
        })
    }).catch((err) => responses.serverError(res, err))
}






