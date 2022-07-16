const { Merchant, } = require('../../models/Merchant')
const { dataSuccess, notFoundError, serverError } = require('../../utilities/responses')


exports.getMerchant = async (req, res) => {
    try {
        const merchantId = req.body.merchantId
        const merchant = Merchant.findOne({ where: { id: merchantId } }).catch(err => {
            notFoundError(res, err)
        })
        dataSuccess(res, merchant)
    } catch (err) {
        serverError(res, err)
    }
}


exports.updateMercahnt = async (req, res) => {

}
