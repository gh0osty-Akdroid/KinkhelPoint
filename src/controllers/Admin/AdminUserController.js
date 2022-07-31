const { User } = require("../../models/User")
const { dataSuccess, notFoundError, serverError } = require("../../utilities/responses")




exports.showUser = async(req, res)=>{
    const userId = req.params.id
    const user= await User.findOne({where:{id:userId}}).then(async data=>{
        if(!data) return notFoundError(res, "User does Not found.")
        dataSuccess(res, data)

    }).catch(async err=>serverError(res,err))
}


exports.showUsers = async(req, res)=>{
    await User.findAll({where:{role:"Customer"}}).then(async data=>dataSuccess(res, data)).catch(async err=>notFoundError(res,err))
}

exports.update = async(req, res)=>{
    let user = new User()
    user = req.body.User
    await user.update().then(async()=>dataAccepted(res)).catch((err)=>serverError(res, err))
}