const { User } = require("../../models/User")
const { dataSuccess } = require("../../utilities/responses")

exports.getProfile = async (req, res) => {
    const uid = req.params.uid
    User.findOne({ where: { uid: uid } }).then(async(data)=>{
         dataSuccess(res, data)
    })
}


exports.updateProfile = async(req, res) =>{
    const uid = req.params.uid
    const body = req.body
    User.findOne({where:{uid:uid}}).then(async(data)=>{
        await data.update({
            "name":body.name,
            "image":body.image,
        }).then(()=>dataSuccess(res, "Updated."))
    })
}