const MerchantPointConfig = require("../../models/MerchantPointConfig")
const { generateId } = require("../../utilities/random")
const { blankSuccess, serverError, dataSuccess, notFoundError } = require("../../utilities/responses")




exports.store = async (req,res) => {
    const body = req.body
    const pointConfig = MerchantPointConfig.build(body)
    pointConfig.id = generateId()
    await pointConfig.save().catch(err=>serverError(res)).then(()=>blankSuccess(res))  
}

exports.update = async (req,res) => {
    let pointConfig = new MerchantPointConfig()
    pointConfig = req.body.PointConfig
    await pointConfig.update().then((pc)=>responses.blankSuccess(res)).catch(err=>serverError(res,err))
}   

exports.destory = async (req,res) => {
    let pointConfig = new MerchantPointConfig()
    pointConfig = req.body.PointConfig 
    await pointBonus.destroy().then(()=>responses.blankSuccess(res)).catch(err=>serverError(res,err))
}

exports.show = async (req,res) => {
    const merchant = req.merchant
    await MerchantPointConfig.findAll({where:{mercahnt_id:merchant.id}}).then((data)=>dataSuccess(res, data)).catch((err)=>notFoundError(res))
}