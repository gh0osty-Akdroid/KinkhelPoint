const { dataSuccess, serverError, blankSuccess } = require("../../utilities/responses")
const { generateId } = require("../../utilities/random")
const { SiteSettings } = require("../../models/SiteConfig")
const { addImage } = require("../../utilities/fileHandler")


exports.show = async (req, res) => {
    await SiteSettings.findAll().then((data) => dataSuccess(res, data)).catch((err) => serverError(res, err))
}


exports.getSite = async (req, res) => {
    try {
    await SiteSettings.findOne({ where: { id: req.params.id } }).then((data) => dataSuccess(res, data)).catch((err) => serverError(res, err))
    } catch (error) {
        serverError(res, error)
    }
}


exports.store = async (req, res) => {
    const data = req.body
    const image = await addImage(data.logo)
    const body = {id:generateId(),...data}
    const siteConfig = await SiteSettings.build(body)
    siteConfig.logo= image
    await siteConfig.save().then(() => blankSuccess(res)).catch(async (err) => {
        console.log(err)
        serverError(res, err)})
}

exports.update = async (req, res) => {
    let siteConfig = new SiteSettings()
    siteConfig = req.body.SiteSettings
    await siteConfig.update(req.body).then((pc) => blankSuccess(res))
}

exports.destory = async (req, res) => {
    let siteConfig = new SiteSettings()
    siteConfig = req.body.SiteSettings
    await siteConfig.destroy().then(() => blankSuccess(res)).catch(err => serverError(res, err))
}
