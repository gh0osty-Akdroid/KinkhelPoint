
const passport = require('passport')
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const secret_key = process.env.SECRETKEY
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { unauthorizedError, serverError, notFoundError } = require('../utilities/responses');
const { Merchant } = require('../models/Merchant');
const { Op } = require('sequelize');
const UserRoles = require('../models/UserRoles');





exports.AdminMiddleware = async (req, res, next) => {
    var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
    if (token) {
        req.site= req.headers.site
        await jwt.verify(token, process.env.JWTACESSSECRET, async (err, decode) => {
            if (err) return unauthorizedError(res, "Your login session has been expired.")
            else {
                await User.findOne({
                    where: { id: decode.id, phone: decode.phone },
                    include: [{
                        model: UserRoles,
                        where: { role: { [Op.like]: 'Admin%' } }
                    }], attributes: { exclude: ["password"] }
                }).then((u) => {
                    if (u) {
                        req.user = u
                        next()
                    }
                    else return unauthorizedError(res, "Your session has been expired. Please login again.")
                }).catch((err) => {

                    notFoundError(res, "User doesn't found.")
                })
            }
        })
    }
    else unauthorizedError(res, "You are not authorized to go into that page.")
    next
}


exports.UserMiddleware = async (req, res, next) => {
    var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
    if (token) {
        req.site= req.headers.site
        await jwt.verify(token, process.env.JWTACESSSECRET, async (err, decode) => {
            if (err) return unauthorizedError(res, "Token has been expired.")
            else {
                await User.findOne({
                    where: { id: decode.id, phone: decode.phone },
                    include: [{
                        model: UserRoles,
                        where: { role: { [Op.like]: '%Customer%' } }
                    }], attributes: { exclude: ["password"] }
                }).then((u) => {
                    if (u) {
                        req.user = u
                        next()
                    }
                    else return unauthorizedError(res, "Your session has been expired. Please login again dna.")
                }).catch((err) => {

                    notFoundError(res, "User doesn't found.")
                })
            }
        })
    }
    else return unauthorizedError(res, "You are not authorized to go into that page.")
    next
}



exports.MerchantMiddleware = async (req, res, next) => {
    var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
    if (token) {
        req.site= req.headers.site
        await jwt.verify(token, process.env.JWTACESSSECRET, async (err, decode) => {
            if (err) return notFoundError(res, 'You are not authorized to access to that page.')
            else {
                await User.findOne({
                    where: { id: decode.id, phone: decode.phone },
                    include: [{
                        model: UserRoles,
                        where: { role: { [Op.like]: 'Merchant%' } }
                    }], attributes: { exclude: ["password"] }
                }).then(async(u) => {
                    if (u) {
                        req.user = u
                        req.merchant = await Merchant.findOne({ where: { user_id: u.id } })

                        next()
                    }
                    else return unauthorizedError(res, "Your session has been expired. Please login again.")
                }).catch((err) => {
                    unauthorizedError(res, "You are not authorized to go into that page.")
                })
            }
        })
    }
    else unauthorizedError(res, "Your session token has been expired. Please login again.")
    next
}

exports.SiteMiddleware = async(req, res, next) =>{
    req.site= req.headers.site
    next()
}