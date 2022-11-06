const { Merchant } = require("../../models/Merchant")
const { Points, userPointTransfer } = require("../../models/Points")
const { VoucherCategory } = require("../../models/VoucherCategory")
const { updateVoucherLists } = require("../../models/VoucherList")
const { getPagingData, getPagination } = require("../../utilities/paginator")
const { generateId, generateMerchantId, generateUId } = require("../../utilities/random")
const { dataAccepted, serverError, dataSuccess, notFoundError, blankSuccess } = require("../../utilities/responses")
const { VoucherStore } = require("./AdminVoucherController")
const { Op } = require('sequelize')



exports.store = async (req, res) => {
    const body = { id: generateId(), uid: generateUId(), site: req.site, by_admin: true, ...req.body }
    const data = await VoucherCategory.build(body)
    const adminPoint = await Points.findOne({ where: { user_id: req.user?.phone } })
    const values = {
        token: null,
        point_id: adminPoint.id,
        merchant_id: body.merchant_id ? body.merchant_id :null,
        points: parseFloat(body.total_point),
        remarks: body.merchant_id ? `You sent voucher of ${parseFloat(body.total_point)} points to merchantID: ${body.merchant_id}` :`You created voucher of ${parseFloat(body.total_point)} points.`,
        other: body.merchant_id ? `You sent voucher of ${parseFloat(body.total_point)} points to merchantID: ${body.merchant_id}` :`You created voucher of ${parseFloat(body.total_point)} points.`,
    }
    await userPointTransfer(req, res, values)
    await data.save().then(async () => {
        await VoucherStore(req, res, body)
    }).catch((err) => {
        serverError(res, err)
    })
}

exports.Merchantlist = async (req, res) => {
    const merchant = req.params.merchant_id
    const { page, size, input } = req.query;
    const { limit, offset } = await getPagination(page, size);
    if(!input){
        await VoucherCategory.findAndCountAll({ where: { merchant_id: merchant, site: req.site }, limit: limit, offset: offset, order:[ ['updatedAt', 'DESC'] ]}).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch(async (err) => notFoundError(res, err))
    }else{
        await VoucherCategory.findAndCountAll({ where: { merchant_id: merchant, site: req.site,name: {
                        [Op.iLike]: `%${input}%`
                    }}, limit: limit, offset: offset, order:[ ['updatedAt', 'DESC'] ]}).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch(async (err) => notFoundError(res, err))
        
    }
    
}

exports.Adminlist = async (req, res) => {
    const { page, size, input } = req.query;
    const { limit, offset } = await getPagination(page, size);
    if(!input){
    await VoucherCategory.findAndCountAll({ where: { merchant_id: null, site: req.site }, limit: limit, offset: offset ,order:[['updatedAt', 'DESC']]}).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch(async (err) => notFoundError(res, err))
    }else{
        await VoucherCategory.findAndCountAll({ where: { merchant_id: null, site: req.site, name: {
                        [Op.iLike]: `%${input}%`
                    } }, limit: limit, offset: offset ,order:[['updatedAt', 'DESC']]}).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch(async (err) => notFoundError(res, err))
        
    }
}


exports.show = async (req, res) => {
    await VoucherCategory.findOne({ where: { id: req.params.id} }).then(async (e) => dataSuccess(res, e)).catch(async (err) => notFoundError(req, err))
}

exports.update = async (req, res) => {
    let data = new VoucherCategory()
    data = req.body.VoucherCategory
    await data.update(req.body).then(() => blankSuccess(res)).catch((err) =>    
    serverError(res, err)
    )
}
exports.delete = async (req, res) => {
    let data = await VoucherCategory.findOne({ where: { id: req.params.id } })
    await data.destroy().then(() => blankSuccess(res)).catch(err => serverError(res, err))
}