const db = require("../../config/db")
const { createUser, User } = require("../../models/User")
const {Merchant, createMerchant} = require('../../models/Merchant')
const SubMerchant = require('../../models/Merchant')
const responses = require("../../utilities/responses")
const jwt = require('jsonwebtoken');
const Randomstring = require('randomstring')
const bcrypt = require('bcrypt')


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
        const user = Merchant.findOne({ where: { email: email } }) || User.findOne({ where: { phone: phone } })
        await bcrypt.compare(password, user.password, async function (err, result) {
            if (result === true) {
                const token = await generateAcessToken(user)
                res.cookie(`merchantSession ${user.id}`, token, { httpOnly: true, sameSite: 'None', maxAge: 86400000, secure: true })
                return responses.dataSuccess(res, { token: token, user: user })
            }
            return responses.notFoundError(res, "User with the credential does not found.")
        })
    } catch (err) {
        return responses.notFoundError(res, err)
    }

}

exports.Register = async (req, res) => {
    const body = req.body
    try {
        const result = await createUser(body, res)
        console.log(result);
        if (result){
            const merchant  = await createMerchant(result.id, body, res)
        }
        return responses.blankSuccess(res)
    } catch (err) {
        return err
    }
}

