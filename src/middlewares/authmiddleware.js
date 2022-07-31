
const passport = require('passport')
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const secret_key = process.env.SECRETKEY
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { unauthorizedError, serverError } = require('../utilities/responses');
const { Merchant } = require('../models/Merchant');





exports.AdminMiddleware = async (req, res, next) => {
    var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
    if (token) {
        await jwt.verify(token, process.env.JWTACESSSECRET, async (err, decode) => {
            if (err) res.status(403).send('User Is Not Authenticated')
            else {
                await User.findOne({ where: { id: decode.id, phone: decode.phone } }).then((u) => {
                    if (!u) unauthorizedError(res, err)
                    else {
                        if (u.role != "Admin") return unauthorizedError(res, "You are not authorized.")
                        req.user = u
                        next()
                    }

                }).catch((err) => unauthorizedError(res, "You are not allowed."))
            }
        })
    }
    else unauthorizedError(res, "You are not authorized to go into that page.")
    next
}


exports.UserMiddleware = async (req, res, next) => {
    var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
        if (token) {
        await jwt.verify(token, process.env.JWTACESSSECRET, async (err, decode) => {
            if (err) serverError(res, "You are not authorized.")
            else {
                await User.findOne({ where: { id: decode.id, phone: decode.phone } }).then((u) => {
                    if (!u) unauthorizedError(res, err)
                    else {
                        if (u.role != "Customer") {
                            unauthorizedError(res, "You are not authorized.")
                        }
                        req.user = u
                        next()
                    }

                }).catch((err) => unauthorizedError(res, "You are not allowed."))
            }
        })
    }
    else unauthorizedError(res, "You are not authorized to go into that page.")
    next
}



exports.MerchantMiddleware = async (req, res, next) => {
    var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
    if (token) {
        await jwt.verify(token, process.env.JWTACESSSECRET, async (err, decode) => {
            if (err) res.status(403).send('User Is Not Authenticated')
            else {
                await User.findOne({ where: { id: decode.id, phone: decode.phone } }).then(async(u) => {
                    if (!u) unauthorizedError(res, err)
                    else {
                        if (u.role === "Merchant") {
                            req.user = u
                            req.merchant = await Merchant.findOne({where:{user_id:u.id}})
                            next()
                        }
                        else unauthorizedError(res, "You are not authorized.")
                    }

                }).catch((err) => unauthorizedError(res,err))
            }
        })
    }
    else unauthorizedError(res, "You are not authorized to go into that page.")
    next
}

