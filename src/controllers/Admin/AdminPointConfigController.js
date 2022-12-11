const { BIGINT } = require("sequelize")
const sequelize = require("sequelize")
const PointConfig = require("../../models/PointConfig")
const { Points } = require("../../models/Points")
const PointsDetail = require("../../models/PointsDetail")
const { SiteSettings } = require("../../models/SiteConfig")
const { getPagination, getPagingData } = require("../../utilities/paginator")
const { generateId } = require("../../utilities/random")
const responses = require('../../utilities/responses')

exports.show = async (req, res) => {
    await PointConfig.findOne({ where: { id: req.params.site }, attributes: ['site', 'value', 'login_points', 'register_points', 'price'] }).then(pc => {
        if (pc) responses.dataSuccess(res, pc)
        else responses.notFoundError(res, `No Information Regarding ${req.params.site}.`)
    })
}

exports.get = async (req, res) => {
    await PointConfig.findAndCountAll({ where: { site: req.site }}).then(pc => {
        return responses.dataSuccess(res, pc)
    }).catch(err => {responses.notFoundError(res, `Nothing found.`)})
}

exports.store = async (req, res) => {
    const body = req.body
    const data = { site: req.site, ...body }
    const pointConfig = await PointConfig.build(data)
    pointConfig.id = generateId()
    await pointConfig.save().then(() => responses.blankSuccess(res))
}

exports.destroy = async (req, res) => {
    let pointConfig = new PointConfig()
    pointConfig = req.body.PointConfig
    await pointConfig.destroy().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
}

exports.update = async (req, res) => {
    let pointConfig = new PointConfig()
    pointConfig = req.body.PointConfig
    await pointConfig.update(req.body).then((pc) => responses.blankSuccess(res))
}


exports.getAllHistory = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = await getPagination(page, size);
    await Points.findOne({ where: { user_id: req.user?.phone } }).then(async (r) => {
        const data = await PointsDetail.findAndCountAll({ where:{point_id:r.id}, limit: limit, offset: offset , order:[["createdAt","DESC"]]})
        const allData = await getPagingData(data, page, limit)
        responses.dataSuccess(res, allData)
    }).catch((err) => responses.notFoundError(res, "Point detail not found."))
}