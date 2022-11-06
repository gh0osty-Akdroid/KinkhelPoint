const Clients = require("../../models/Clients")
const { addImage, removeImage } = require("../../utilities/fileHandler")
const { getPagination, getPagingData } = require("../../utilities/paginator")
const { generateId } = require("../../utilities/random")
const { dataCreated, serverError, dataSuccess, notFoundError, blankSuccess } = require("../../utilities/responses")

exports.addClient = async (req, res) => {
    const body = req.body
    const image = await addImage(body.image)
    const client = await Clients.build({ name: body.name, image: image, site: req.site })
    client.id = generateId()
    await client.save().then((data) => {
        dataCreated(res, data)
    }).catch((err) => {
        serverError(res, err)
    })

}
exports.ShowClient = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = await getPagination(page, size);
    await Clients.findAndCountAll({ limit: limit, offset: offset, where: { site: req.site } }).then(async (e) => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch((err) => notFoundError(res, err))

}
exports.deleteClient = async (req, res) => {
    const id = req.params.id
    const client = await Clients.findByPk(id)
    await removeImage(client.image)
    await client.destroy().then(() => blankSuccess(res)).catch(err => serverError(err))
}
