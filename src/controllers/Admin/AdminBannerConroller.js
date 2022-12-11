const { Banners } = require("../../models/Banners")
const { addImage, removeImage } = require("../../utilities/fileHandler")
const { getPagination, getPagingData } = require("../../utilities/paginator")
const { generateId } = require("../../utilities/random")
const { dataCreated, serverError, dataSuccess, notFoundError, blankSuccess } = require("../../utilities/responses")

exports.addBanner = async (req, res) => {
    const body = req.body
    const image = await addImage(body.image)
    const banner = await Banners.build({ index: body.index, image: image, text: body.text, link: body.link, other: body.other, site: req.site })
    banner.id = generateId()
    await banner.save().then((data) => {
        dataCreated(res, data)
    }).catch((err) => {
        serverError(res, err)
    })

}
exports.ShowBanner = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = await getPagination(page, size);
    await Banners.findAndCountAll({ limit: limit, offset: offset, where: { site: req.site } }).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch((err) => notFoundError(res, err))

}
exports.deleteBanner = async (req, res) => {
    const id = req.params.id
    const banner = await Banners.findByPk(id)
    await removeImage(banner.image)
    await banner.destroy().then(() => blankSuccess(res)).catch(err => serverError(err))
}
