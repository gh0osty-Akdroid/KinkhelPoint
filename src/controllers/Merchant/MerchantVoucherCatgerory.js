const { Merchant } = require("../../models/Merchant")
const { Points } = require("../../models/Points")
const { VoucherCategory } = require("../../models/VoucherCategory")
const { updateVoucherLists } = require("../../models/VoucherList")
const { getPagingData, getPagination } = require("../../utilities/paginator")
const { generateId, generateMerchantId, generateUId } = require("../../utilities/random")
const { dataAccepted, serverError, dataSuccess, notFoundError, blankSuccess } = require("../../utilities/responses")
const { VoucherStore } = require("../Admin/AdminVoucherController")



const MerchantEnd = async (req, res, merchant, voucher, point) => {
    try {
        point.update({ points: (parseFloat(point.points) - parseFloat(voucher.value)) })
        const values = {
            "token": null,
            "point_id": point.id,
            "merchant_id": merchant.id,
            "points": voucher.total_point,
            "remarks": `Your ${voucher.total_point} points has been deducted for creating ${voucher.name}`,
            "others": `Your ${voucher.total_point} points has been deducted for creating ${voucher.name}`,
        }
        await userPointTransfer(req, res, values)
        return true
    } catch (err) {
        return false
    }
}


exports.store = async (req, res) => {
    const body = { merchant_id: req.merchant.id, id: generateId(), uid: generateUId(),site: req.site, by_admin: true, ...req.body }
    const data = await VoucherCategory.build(body)
    await data.save().then(async () => {
        await VoucherStore(req, res, body)
        await MerchantEnd(req, res, req.merchant, data, req.point)
        dataAccepted(res)
    }).catch((err) => {
        serverError(res, err)
    })
}

exports.list = async (req, res) => {
    const merchant = req.merchant.id
    const { page, size } = req.query;
    const { limit, offset } = await getPagination(page, size);
    await VoucherCategory.findAndCountAll({ where: { merchant_id: merchant, site: req.site }, limit: limit, offset: offset, order:[ ['updatedAt', 'DESC'] ]}).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch(async (err) => notFoundError(res, err))
}

exports.show = async (req, res) => {
    await VoucherCategory.findOne({ where: { id: req.params.id} }).then(async (e) => dataSuccess(res, e)).catch(async (err) => notFoundError(res, err))
}

exports.update = async (req, res) => {
    
}
exports.delete = async (req, res) => {
    let data = await VoucherCategory.findOne({ where: { id: req.params.id } })
    await data.destroy().then(() => blankSuccess(res)).catch(err => serverError(res, err))
}