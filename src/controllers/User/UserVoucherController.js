const { Points, userPointTransfer } = require("../../models/Points")
const RedeemedVoucher = require("../../models/RedeemedVoucher")
const { createUserVoucherList } = require("../../models/UserVoucherList")
const { VoucherList } = require("../../models/VoucherList")
const { generateId } = require("../../utilities/random")
const { blankSuccess, serverError, dataSuccess } = require("../../utilities/responses")



const OtherEnd = async(req, res, user, voucher)=>{
    try {
        const values = {
            "id":generateId(),
            "token": null,
            "user_id": user.id,
            "voucher_id": voucher?.id,
            "merchant_id": voucher?.Merchant?.id,
            "points": voucher.value,
            "remarks": `Your voucher of ${voucher.value} points has been redeemed by ${user.phone}`,
            "other": `Your voucher of ${voucher.value} points has been redeemed by ${user.phone}`,
        }
        const data = await RedeemedVoucher.build(values)
        await data.save()
        if (voucher.by_admin === false){
            await Points.findOne({where:{user_id:voucher?.Merchant?.User?.phone}}).then(async (e) => {
                e.update({ points: (parseFloat(e.points) - parseFloat(voucher.value)) })
            })
        }
        return true
    } catch (error) {
        return false
    }
}


const UserEnd = async (req, res, user, voucher) => {
    try {
        await Points.findOne({ where: { user_id: user.phone } }).then(async (e) => {
            e.update({ points: (parseFloat(e.points) + parseFloat(voucher.value)) })
            const values = {
                "token": null,
                "point_id": e.id,
                "merchant_id": voucher?.Merchant?.id,
                "points": voucher.value,
                "remarks": `You received ${voucher.value} points from redeeming ${voucher.VoucherCategory.name}`,
                "other": `You received ${voucher.value} points from redeeming ${voucher.VoucherCategory.name}`,
            }
            await userPointTransfer(req, res, values)
            await createUserVoucherList(req, res, user, voucher)
        }).catch((err) => { return err })
        return true
    } catch (error) {
        return false
    }


}


exports.redeem = async (req, res) => {
    const user = req.user
    const voucher = req.voucher
    const a = await UserEnd(req, res, user, voucher)  // user,  voucher
    const b = await OtherEnd(req, res, user, voucher)
    if (a && b)return dataSuccess(res, voucher)
    else return serverError(res, "dsk")

} 