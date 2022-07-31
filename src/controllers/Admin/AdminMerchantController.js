const { Merchant, createMerchant, } = require('../../models/Merchant')
const { generateId, generateCode, generateMerchantId } = require('../../utilities/random')
const { dataSuccess, notFoundError, serverError, dataAccepted } = require('../../utilities/responses')


exports.getMerchant = async (req, res) => {
    await Merchant.findAll().then(async (data) => dataSuccess(res, data)).catch(async (err) => notFoundError(res, err))
}

exports.showMerchant = async (req, res) => {
    const merchantId = req.params.id
    await Merchant.findOne({ where: { mercahnt_id: merchantId } }).then(async (data) => dataSuccess(res, data)).catch(async (err) => notFoundError(res, err))
}


exports.createMerchant = async (req, res) => {
    const body = req.body
    const merchant = await createMerchant(res, body)
}

exports.updateMercahnt = async (req, res) => {
    let merchant = new Merchant()
    merchant = req.body.Merchant
    await merchant.update().then(async (data) => dataAccepted(res)).catch((err) => serverError(res, err))

}
