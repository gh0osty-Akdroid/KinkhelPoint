const { body } = require("express-validator")
const { VoucherCategory } = require("../../models/VoucherCategory")
const { VoucherList } = require("../../models/VoucherList")
const { getPagination, getPagingData } = require("../../utilities/paginator")
const { generateId, generateUId } = require("../../utilities/random")
const { dataAccepted, serverError, dataSuccess, notFoundError, dataCreated } = require("../../utilities/responses")





exports.store = async(req, res) =>{
    const id = req.params.id
    const body = req.body
    const merchant_id = req.merchant.id
    const data = await VoucherCategory.findOne({where:{id:id}})
    const value =  (parseFloat(data.total_point)/ parseFloat(data.total_vouchers))
    try {
        for (let i = 0; i < data.total_vouchers; i++) {
            await VoucherList.build({
                "id":generateId(),
                "uid":generateUId(),
                "name":body.name,
                "value":value,
                "merchant_id":merchant_id,
                "category_id":data.id,
                "validity":body.validity,
                "userlimit":body.userlimit           
            }).save()
        }
        dataCreated(res, "The Voucher List has been created.")
    } catch (err) {
        serverError(res, err)
    }   
}

exports.list = async(req,res)=>{
    const merchant = req.merchant.id
    const { page, size, enable, batch } = req.query;
    const { limit, offset } = await getPagination(page, size);
    var null_ = batch === "null" ? null : batch
    await VoucherList.findAndCountAll({
        order: [
            ['index', 'DESC'],
        ], where: { merchant_id: merchant, category_id: req.params.id, active: enable, batch: null_ }, limit: limit, offset: offset
    }).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch((err) => {
        notFoundError(res, err)
    })
}




exports.update = async (req, res) => {
    const body = req.body
    var item, merchant
    merchant = req.merchant.id
    try {
        if (body.from) {
            if (parseInt(body.from) > parseInt(body.to)) {
                for (item = parseInt(body.from); item >= parseInt(body.to); item--) {
                    await VoucherList.findOne({ where: { merchant_id: merchant, index: item, category_id: req.body.id } }).then(async (e) => {
                        e.update({ active: req.body.active, batch: req.body.batch })
                    })
                }
            }
            else {
                for (item = parseInt(body.from); item <= parseInt(body.to); item++) {
                    await VoucherList.findOne({ where: { merchant_id: merchant, index: item, category_id: req.body.id } }).then(async (e) => {
                        e.update({ active: req.body.active, batch: req.body.batch })
                    })
                }
            }
        }
        else {
            if (req.query.active) {
                const data = await VoucherList.findAll({ where: { merchant_id: merchant, category_id: req.query.id, batch:req.query.batch } })
                data.forEach(async (e) => {
                    e.update({ active: req.query.active })
                })
            }
            else {
                body.items.forEach(async (e) => {
                    await VoucherList.findOne({ where: { id: e } }).then(async (e) => {
                        e.update({ active: req.body.active, batch: body.batch })
                    })
                });
            }
        }
        return dataSuccess(res, "Your vouchers has been Updated.")        
    } catch (error) {
        return notFoundError(res, "The requested vouchers cannot be found.")
    }

}

