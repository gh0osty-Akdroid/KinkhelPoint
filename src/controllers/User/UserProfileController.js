const { User } = require("../../models/User")
const { addImage, removeImage } = require("../../utilities/fileHandler")
const { dataSuccess } = require("../../utilities/responses")

exports.getProfile = async (req, res) => {
    const user = req.user
    User.findOne({ where: { uid: user.uid } }).then(async (data) => {
        dataSuccess(res, data)
    })
}


exports.updateProfile = async (req, res) => {
    const user = req.user
    const body = req.body
    const image = await addImage(body.image)
    if (user.image){
        await removeImage(user.image)
        await user.update({
            "name": body.name,
            "image": image,
        }).then(() => dataSuccess(res, "Updated."))
    }
    else{
        await user.update({
            "name": body.name,
            "image": image,
        }).then(() => dataSuccess(res, "Updated."))
    }
}