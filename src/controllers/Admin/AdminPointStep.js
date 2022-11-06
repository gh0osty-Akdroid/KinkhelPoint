const PointBadge = require("../../models/PointBadge")
const { addImage, removeImage } = require("../../utilities/fileHandler")
const { getPagination, getPagingData } = require("../../utilities/paginator")
const { generateId } = require("../../utilities/random")
const { dataCreated, serverError, dataSuccess, notFoundError, blankSuccess } = require("../../utilities/responses")

exports.addBadge = async (req, res) => {
    const body = req.body
    const check = await PointBadge.build({ name: body.name, points: body.points, other: body.other, site: req.site })
    check.id = generateId()
    await check.save().then((data) => {
        dataCreated(res, data)
    }).catch((err) => {
        console.log(err);
        serverError(res, err)
    })

}
exports.ShowBadge = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = await getPagination(page, size);
    console.log(req.site)
    await PointBadge.findAndCountAll({ limit: limit, offset: offset, where: { site: req.site } }).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch((err) => console.log(err))

}
exports.deleteBadge = async (req, res) => {
    const id = req.params.id
    const check = await PointBadge.findByPk(id)
    await check.destroy().then(() => blankSuccess(res)).catch(err => serverError(err))
}
