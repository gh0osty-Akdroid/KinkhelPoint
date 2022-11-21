const { Op } = require("sequelize")
const { Points } = require("../../models/Points")
const { User } = require("../../models/User")
const UserRoles = require("../../models/UserRoles")
const { getPagingData, getPagination } = require("../../utilities/paginator")
const { dataSuccess, notFoundError, serverError, blankSuccess } = require("../../utilities/responses")




exports.showUser = async (req, res) => {
    const userId = req.params.id
    const user = await User.findOne({ where: { id: userId }, include: { model: Points }, attributes: { exclude: ["password"] } }).then(async data => {
        if (!data) return notFoundError(res, "User does Not found.")
        dataSuccess(res, data)

    })
}

exports.point = async (req, res) => {
    const user = String(req.params.user)
    await User.findOne({ where: { phone: user }, include: { model: Points } }).then((data) =>
        dataSuccess(res, data)
    )
}


exports.showUsers = async (req, res) => {
    const { page, input } = req.query;
    const { limit, offset } = await getPagination(page, null);
    if(!input){
        await User.findAndCountAll({ where: { site: req.site }, offset: offset, limit: limit,order: [
            ['createdAt', 'DESC'],
            
        ],include: [{ model: UserRoles, where: { role: { [Op.like]: "Customer" } } }] , }).then(async e => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch((err) => notFoundError(res, err))
    }else{
        await User.findAndCountAll({ where: { site: req.site ,
            [Op.or]: [{
                    email: {
                        [Op.iLike]: `%${input}%`
                    }
                }, {
                    phone: {
                        [Op.iLike]: `%${input}%`
                    }
                }, {
                    name: {
                        [Op.iLike]: `%${input}%`
                    }
                }]
        }, offset: offset, limit: limit, include: [{ model: UserRoles, where: { role: { [Op.like]: "Customer" } } }] }).then(async e => {
        const data = await getPagingData(e, page, limit)
        dataSuccess(res, data)
    }).catch((err) => notFoundError(res, err))
    }
    
}

exports.update = async (req, res) => {
    const userId = req.params.id
    await User.findOne({ where: { id: userId } }).then(async data => {
        if (!data) return notFoundError(res, "User does Not found.")
        data.banned = req.body.banned
        data.save()
    })
    blankSuccess(res)
}