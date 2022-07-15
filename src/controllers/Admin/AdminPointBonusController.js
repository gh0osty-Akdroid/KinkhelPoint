const PointBonus = require("../../models/PointBonus")



exports.store = async (req,res) => {
    const body = req.body
    const pointConfig = PointConfig.build(body)
    pointConfig.id = generateId()
    await pointConfig.save().catch(err=>responses.serverError(res,err)).then(()=>responses.blankSuccess(res))  
}

exports.update = async (req,res) => {
    let pointBonus = new PointBonus()
    pointBonus = req.body.PointBonus
    await pointConfig.update().then((pc)=>responses.blankSuccess(res)).catch(err=>responses.serverError(res,err))
}   

exports.destory = async (req,res) => {
    let pointBonus = new PointBonus()
    pointBonus = req.body.PointBonus 
    await pointBonus.destroy().then(()=>responses.blankSuccess(res)).catch(err=>responses.serverError(res,err))
}

exports.show = async (req,res) => {
    const body = req.body 
    const pointBonus = await PointBonus.build(body)
    pointBonus.id = generateId()
    await pointBonus.save().catch(err=>responses.serverError(res,err)).then(()=>responses.blankSuccess(res))
}