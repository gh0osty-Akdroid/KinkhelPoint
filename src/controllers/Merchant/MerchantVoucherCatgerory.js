const { Merchant } = require("../../models/Merchant")
const { VoucherCategory } = require("../../models/VoucherCategory")
const { generateId, generateMerchantId, generateUId } = require("../../utilities/random")
const { dataAccepted, serverError, dataSuccess, notFoundError } = require("../../utilities/responses")



exports.store = async(req, res) =>{
    const body = {merchant_id:req.merchant.id,id:generateId(), uid:generateUId() ,...req.body}
    const data = await VoucherCategory.create(body)
    await data.save().then(()=>dataAccepted(res)).catch((err)=>serverError(res, err))
}

exports.list = async(req,res)=>{
    await VoucherCategory.findAll({where:{merchant_id:req.merchant.id}}).then(async(e) =>dataSuccess(res,e)).catch(async(err)=>notFoundError(req, err))
}


exports.update = async(req, res)=>{
    let data = new VoucherCategory()
    data = req.body.VoucherCategory
    await data.update(req.body).then(()=>responses.blankSuccess(res)).catch(err=>serverError(res,err))
}


exports.delete = async(req, res)=>{
    let data = new VoucherCategory()
    data = req.body.VoucherCategory
    await data.destroy().then(()=>responses.blankSuccess(res)).catch(err=>serverError(res,err))
}

