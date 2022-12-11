const { body } = require("express-validator")
const { Merchant } = require("../../models/Merchant")
const RedeemedVoucher = require("../../models/RedeemedVoucher")
const { User } = require("../../models/User")
const { UserVoucherList } = require("../../models/UserVoucherList")
const { VoucherCategory } = require("../../models/VoucherCategory")
const { VoucherList } = require("../../models/VoucherList")
const { fileGenerator } = require("../../utilities/fileHandler")
const { getPagination, getPagingData } = require("../../utilities/paginator")
const { generateId, generateUId } = require("../../utilities/random")
const { dataAccepted, serverError, dataSuccess, notFoundError, dataCreated } = require("../../utilities/responses")





exports.VoucherStore = async (req, res, body) => {
    const value = (parseFloat(body.total_point) / parseFloat(body.total_vouchers)).toFixed(2)
    let i;
    try {
        for (i = 1; i <= body.total_vouchers; i++) {
            const a = await VoucherList.build({
                "id": generateId(),
                "uid": generateUId(),
                "value": value,
                "merchant_id": body.merchant_id,
                "category_id": body.id,
                "by_admin": true,
                "site": req.site,
                "index": i
            }).save()
        }
        dataCreated(res, "The Voucher List has been created.")
    } catch (err) {
        serverError(res, err)
    }
}

exports.list = async (req, res) => {
    const merchant = req.params.merchant_id
    const { page, size, enable, batch } = req.query;
    const { limit, offset } = await getPagination(page, size);
    var null_ = batch === "null" ? null : batch
    await VoucherList.findAndCountAll({
        order: [
            ['index', 'DESC'],
        ], where: { merchant_id: merchant, category_id: req.params.id, active: enable, batch: null_ }, limit: limit, offset: offset, include: [{ model: RedeemedVoucher, include: [{ model: User }, { model: Merchant }] }]
    }).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch((err) => {
        notFoundError(res, err)
    })
}

exports.Adminlist = async (req, res) => {
    const { page, size, enable, batch } = req.query;
    const { limit, offset } = await getPagination(page, size);
    var null_ = batch === "null" ? null : batch
    await VoucherList.findAndCountAll({
        order: [
            ['index', 'DESC'],
        ], where: { category_id: req.params.id, active: enable, batch: null_ }, limit: limit, offset: offset, include: [{ model: RedeemedVoucher, include: [{ model: User }, { model: Merchant }] }]
    }).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch((err) => {
        notFoundError(res, err)
    })


}


exports.UpdateVoucherList = async (req, res) => {
    const body = req.body
    var item, merchant_id
    merchant_id = req.body.merchant_id === "null" ? null : req.body.merchant_id
    try {
        if (body.from) {
            if (parseInt(body.from) > parseInt(body.to)) {
                for (item = parseInt(body.from); item >= parseInt(body.to); item--) {
                    await VoucherList.findOne({ where: { merchant_id: merchant_id, index: item, category_id: req.body.id } }).then(async (e) => {
                        e.update({ active: req.body.active, batch: req.body.batch })
                    })
                }
            }
            else {
                for (item = parseInt(body.from); item <= parseInt(body.to); item++) {
                    await VoucherList.findOne({ where: { merchant_id: merchant_id, index: item, category_id: req.body.id } }).then(async (e) => {
                        e.update({ active: req.body.active, batch: req.body.batch })
                    })
                }
            }
        }
        else {
            if (req.query.status) {
                const data = await VoucherList.findAll({ where: { merchant_id: merchant_id, category_id: req.query.id } })
                data.forEach(async (e) => {
                    await VoucherCategory.findOne({ where: { merchant_id: merchant_id, batch: req.query.batch } }).then((e) => e.update({ active: req.query.status }))
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
        dataSuccess(res, "Your vouchers has been Updated.")        
    } catch (error) {
        serverError(res, "Something went wrong.")
    }

}

exports.deleteVoucher = async (req, res) => {
    const body = req.body
    const merchant = req.params.merchant
}

exports.download = async (req, res) => {
    const { batch, merchant } = req.query;
    var merchant_id = merchant === "null" ? null : merchant
    try {
        const data = await VoucherList.findAndCountAll({ where: { category_id: req.params.id, batch: batch, merchant_id:merchant_id } })
        const response = await fileGenerator(res, data["rows"], batch, req.params.id)
    } catch (error) {
        serverError(res, error)
    }
}
exports.search = async (req, res) => {
    const uid = req.query.UID
    await VoucherList.findOne({ where: { uid: uid } }).then(data => dataSuccess(res, data)).catch(err => notFoundError(res, err))
}