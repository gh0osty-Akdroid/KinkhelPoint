const {Points, addBonusPoint} = require('../models/Points')
const PointConfig = require('../models/PointConfig')
const PointBonus = require('../models/PointBonus')
const SITE_ID = process.env.SITE_ID


exports.registerPoint = async(req, res, user) =>{
    try {
        const pointConfig = await PointConfig.findOne({where:{site:SITE_ID}})
        const points = await Points.findOne({where:{user_id:user.phone}})
        points.update({ points : (points.points+pointConfig.register_points)})
        const data ={
            point_id : points.id,
            points:pointConfig.register_points,
            remarks:"From System",
            other:`You have received ${pointConfig.register_points} as register point Bonus.`,
        }
        await addBonusPoint(data)
    } catch (err) {
         return console.log(err)
    }
}


exports.loginPoint = async(req, res, user) =>{
    try {
        const session = req.cookie.session
        const pointConfig = await PointConfig.findOne({where:{site:SITE_ID}})
        const points = await Points.findOne({where:{user_id:user.phone}}).then(()=>{
            points.update({ points : (points.points+pointConfig.login_points)})
        })
        const data ={
            point_id : points.id,
            points:pointConfig.login_points,
            remarks:`You have received ${pointConfig.login_points} as login point Bonus.`,
            

        }
        await addBonusPoint(data )
    } catch (err) {
         return console.log(err)
    }
}

exports.bonusPoint = async(req, res, user) =>{

}


exports.redeemPoints = async(req, res, user, voucher)=>{
    try {
        const points = await Points.findOne({where:{user_id:user.phone}})
        points.update({ points : (points.points + voucher.value)})
        const data ={
            point_id : points.id,
            points: voucher.value,
            remarks:`You have received ${voucher.value} as redeemed point Bonus from ${voucher.Merchant.parent_company}`,
        }
        await addBonusPoint(req, res, data)
    } catch (err) {
         return console.log(err)
    }
}