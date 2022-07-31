const PointConfig = require("../../models/PointConfig")
const { generateId } = require("../../utilities/random")
const responses = require('../../utilities/responses')

exports.show = async (req,res) => {
    await PointConfig.findOne({where: {site: req.params.site}, attributes: ['site','value','login_points','register_points']}).then(pc=>{
        if(pc) responses.dataSuccess(res,pc)
        else responses.notFoundError(res,`No Information Regarding ${req.params.site}.`)
    }).catch(err=>responses.serverError(res,err))
}

exports.store = async(req,res) => {
    const body = req.body
    const pointConfig = await PointConfig.build(body)
    pointConfig.id = generateId()
    await pointConfig.save().catch(err=>responses.serverError(res,err)).then(()=>responses.blankSuccess(res))
}

exports.destroy = async (req,res) => {
    let pointConfig = new PointConfig()
    pointConfig = req.body.PointConfig 
    await pointConfig.destroy().then(()=>responses.blankSuccess(res)).catch(err=>responses.serverError(res,err))
}

exports.update = async (req,res) => {
    let pointConfig = new PointConfig()
    pointConfig = req.body.PointConfig
    // return res.send(pointConfig)
    await pointConfig.update(req.body).then((pc)=>responses.blankSuccess(res)).catch(err=>responses.serverError(res,err))
}
