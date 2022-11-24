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
const { removeImage, addImage } = require("../../utilities/fileHandler")




// Merchant Pos And Non pos

const generateAcessToken = async (user) => {
    const jwtToken = await jwt.sign(
        { id: user.id, phone: user.phone },
        process.env.JWTACESSSECRET,
        { expiresIn: 86400000 }
    );
    return jwtToken
}


exports.Login = async (req, res) => {
    const { password } = req.body
    const merchant = req.user
    await bcrypt.compare(password, merchant.password, async function (err, result) {
        console.log(result)
        if (result === true) await createOTPtoken(res, merchant)
        else return responses.notFoundError(res, "Merchant with these credentials cannot be found.")
    })

}







const checkSession = async (req, res, user, token) => {
    const device = req.useragent
    let data
    if (device.isMobile) data = "Mobile"
    else data = "Web"
    const session = await Session.Session.findOne({ where: { user_id: user.id, device_information: data } })
    if (session) return session.destroy().then(async () => await Session.createSession(req, res, user, device, token, "info"))
    else await Session.createSession(req, res, user, device, token, "info")
}


exports.LoginVerification = async (req, res) => {
    const user = req.user
    const accessToken = await generateAcessToken(user)
    const response = await checkSession(req, res, user, accessToken)
    if (response) responses.dataSuccess(res, { user: user, token: accessToken })
    else responses.serverError(res, "Something went Wrong")
}


exports.ResendLoginOtp = async (req, res) => {
    const user_ = req.params.user
    const user = await User.findOne({ where: { phone: user_ } }) || await User.findOne({ where: { email: user_ } })
    if (!user) {
        responses.notFoundError(res, "user cannot be found of following credentials.")
    } else {
        await createOTPtoken(res, user)
    }

}

exports.profile = async (req, res) => {
    const user = req.user
    const merchant = req.merchant
    responses.dataSuccess(res, { user:user, merchant:merchant })
}


exports.updateUser =async (req, res)=>{
    const user = req.user
    await user.update(req.body).then(()=>{
        responses.dataAccepted(res)
    }).catch(err=>{
        responses.serverError(res, err)
    })
}

exports.updateMerchant = async(req,res)=>{
    const merchant = req.merchant
    await merchant.update(req.body).then(()=>{
        responses.dataAccepted(res)
    }).catch(err=>{
        responses.serverError(res, err)
    })
}

exports.updateImage = async(req, res) =>{
    const user = req.user
    await removeImage(user.image).then(async()=>{
        const image = await addImage(req.body.image)
        await user.update({image:image}).then(()=>{
            responses.dataAccepted(res)
        }).catch(err=>{
            responses.serverError(res, err)
        })
    }).catch(err=>{
        responses.serverError(res, err)
    })
}
