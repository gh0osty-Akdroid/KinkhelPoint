const db = require("../config/db")
const { createUser, User } = require("../models/User")
const responses = require("../utilities/responses")
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
        const user = User.findOne({ where: { email: email } }) || User.findOne({ where: { phone: phone } })
        await bcrypt.compare(password, user.password, async function (err, result) {
            if (result === true) {
                const token = await generateAcessToken(user)
                const userDetails = await User.findOne({where: {id :user.id}, include:[{model:"addresses"}, {model:"points"}, {model:"points_details"}]})
                res.cookie('jwt', token, { httpOnly: true, sameSite: 'None', maxAge: 86400000, secure: true })
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
        return responses.blankSuccess(res)
    } catch (err) {
        return responses.serverError(res, err)
    }
}


exports.Address = async(req, res) =>{
    
}