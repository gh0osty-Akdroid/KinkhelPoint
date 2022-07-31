const PointBonus = require("../../models/PointBonus")
const { generateId } = require("../../utilities/random")
const { dataSuccess, serverError, blankSuccess } = require("../../utilities/responses")



exports.store = async (req,res) => {
    const body = req.body
    const pointConfig = await PointBonus.build(body)
    pointConfig.id = generateId()
    await pointConfig.save().then(()=>blankSuccess(res)).catch(async(res)=>serverError(res,"Something went wrong."))  
}

exports.update = async (req,res) => {
    let pointBonus = new PointBonus()
    pointBonus = req.body.PointBonus
    await PointBonus.update(req.body).then((pc)=>blankSuccess(res))
}   

exports.destory = async (req,res) => {
    let pointBonus = new PointBonus()
    pointBonus = req.body.PointBonus 
    await pointBonus.destroy().then(()=>blankSuccess(res)).catch(err=>serverError(res,err))
}

exports.show = async (req,res) => {
    await PointBonus.findAll().then((data)=>dataSuccess(res, data)).catch((err)=>serverError(res))
}