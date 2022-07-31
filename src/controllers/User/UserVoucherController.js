const { createUserVoucherList } = require("../../models/UserVoucherList")
const { VoucherList } = require("../../models/VoucherList")
const { notFoundError } = require("../../utilities/responses")








exports.redeem = async (req, res) => {
    const user = req.user
    const body = req.body
    await VoucherList.findOne({ where: { uid: body.token } , include:{model:'merchants'}}).then(async(voucher)=>{
        await createUserVoucherList(req, res, user, voucher)
    }).catch(async(err)=>notFoundError(res, "The given voucher code is not available."))
} 