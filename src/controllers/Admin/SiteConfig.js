const { dataSuccess, serverError, blankSuccess, notFoundError } = require("../../utilities/responses")
const { generateId } = require("../../utilities/random")
const { SiteSettings } = require("../../models/SiteConfig")
const { addImage, removeImage } = require("../../utilities/fileHandler")


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
    const body = { id: generateId(), ...data }
    const siteConfig = await SiteSettings.build(body)
    siteConfig.logo = image
    await siteConfig.save().then(() => blankSuccess(res)).catch(async (err) => {
        console.log(err)
        serverError(res, err)
    })
}

exports.update = async (req, res) => {
    try {
        var body = req.body
        var site = await SiteSettings.findOne({ where: { id: req.params.id } })
        if (site) {
            if (req.body.logo) {
                await removeImage(site.logo)
                const image = await addImage(body.logo)
                body = { ...body, logo: image }
            }
            await site.update(req.body).then((data) => {
                dataSuccess(res, data)
            }).catch((err) => {
                serverError(res, err)
            })
        }
        else {
            notFoundError(res, "The site with given Id does not found.")
        }

    } catch (err) {
        serverError(res, err)
    }

}

exports.destory = async (req, res) => {
    let siteConfig = new SiteSettings()
    siteConfig = req.body.SiteSettings
    await siteConfig.destroy().then(() => blankSuccess(res)).catch(err => serverError(res, err))
}
