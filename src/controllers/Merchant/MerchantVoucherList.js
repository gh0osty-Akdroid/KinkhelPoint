const { body } = require("express-validator")
const { VoucherCategory } = require("../../models/VoucherCategory")
const { VoucherList } = require("../../models/VoucherList")
const { generateId, generateUId } = require("../../utilities/random")
const { dataAccepted, serverError, dataSuccess, notFoundError, dataCreated } = require("../../utilities/responses")





exports.store = async(req, res) =>{
    const id = req.params.id
    const body = req.body
    const data = await VoucherCategory.findOne({where:{id:id}})
    const value =  data.total_point/ data.total_vouchers
    try {
        (data.total_vouchers).forLoop(async(e)=>{
            await VoucherList.create({
                "id":generateId(),
                "uid":generateUId(),
                "name":body.name,
                "value":value,
                "mercahnt_id":data.mercahnt_id,
                "category_id":data.id,
                "validity":body.validity,
                "userlimit":body.userlimit           
            }).save()
        })
        dataCreated(res, "The Voucher List has been created.")
    } catch (err) {
        serverError(res, err)
    }   
}

exports.list = async(req,res)=>{
    await VoucherList.findAll({where:{mercahnt_id:req.merchant.id, category_id:req.params.id}}).then(async(e) =>dataSuccess(res,e)).catch(async(err)=>notFoundError(req, err))
}



