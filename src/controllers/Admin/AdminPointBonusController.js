const PointBonus = require("../../models/PointBonus")
const { dataSuccess, serverError, blankSuccess } = require("../../utilities/responses")



exports.store = async (req,res) => {
    const body = req.body
    const pointConfig = PointConfig.build(body)
    pointConfig.id = generateId()
    await pointConfig.save().catch(err=>serverError(res)).then(()=>blankSuccess(res))  
}

exports.update = async (req,res) => {
    let pointBonus = new PointBonus()
    pointBonus = req.body.PointBonus
    await pointConfig.update().then((pc)=>responses.blankSuccess(res)).catch(err=>serverError(res,err))
}   

exports.destory = async (req,res) => {
    let pointBonus = new PointBonus()
    pointBonus = req.body.PointBonus 
    await pointBonus.destroy().then(()=>responses.blankSuccess(res)).catch(err=>serverError(res,err))
}

exports.show = async (req,res) => {
    await PointBonus.findAll().then((data)=>dataSuccess(res, data)).catch((err)=>serverError(res))
}