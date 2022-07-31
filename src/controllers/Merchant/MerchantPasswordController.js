const db = require("../../config/db")
const { createUser, User } = require("../../models/User")
const Session = require("../../models/Session")
const responses = require("../../utilities/responses")
const jwt = require('jsonwebtoken');
const Randomstring = require('randomstring')
const bcrypt = require('bcrypt');
const ForgetPassword = require("../../models/ForgetPassword");
const { sendEmail } = require("../../utilities/mailer");
const saltRounds = 10



exports.forget_pwd = async (req, res) => {
    const email = req.body.email
    const mode = req.query.mode
    await User.findOne({ where: { email: email } }).then(async (user) => {
        const data = await ForgetPassword.ForgetPassword.findOne({ where: { user_id: user.id } })
        if (!data) {
            await ForgetPassword.createForgetPassword(res, user, mode)
        }
        else {
            data.destroy().then(async () => ForgetPassword.createForgetPassword(res, user, mode))
        }
    }).catch((res) => {
        return responses.notFoundError(res, "User not found with provided email.")
    })
}

exports.reset_pwd = async (req, res) => {
    const email = req.params.email
    const token = req.body.token
    await User.findOne({ where: { email: email } }).then(async (user) => {
        const user_ = await ForgetPassword.ForgetPassword.findOne({ where: { token: token, user_id: user.id } })
        if (user_) {
            responses.blankSuccess(res)
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
    const id = req.user.id
    await User.findOne({ where: { id: id } }).then(async (user) => {
        await bcrypt.compare(body.password, user.password, async function (err, result) {
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


