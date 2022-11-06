const MerchantPointConfig = require("../../models/MerchantPointConfig")
const { generateId } = require("../../utilities/random")
const { blankSuccess, serverError, dataSuccess, notFoundError } = require("../../utilities/responses")


exports.update = async (req,res) => {
    try {
        await MerchantPointConfig.findOne({where:{merchant_id:req.merchant.id}}).then(data =>{
            data.update(req.body)
            dataSuccess(res, "Your Point config has been updated.")
        }).catch(err=>{
            serverError(res, err)
        })
    } catch (err) {
        
    }
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