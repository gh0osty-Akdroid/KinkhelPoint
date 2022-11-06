const { Banners } = require("../../models/Banners")
const Clients = require("../../models/Clients")
const PointBadge = require("../../models/PointBadge")
const { Points } = require("../../models/Points")
const { dataSuccess, serverError } = require("../../utilities/responses")


exports.getDashboard = async(req, res)=>{
    try {
         
        const point = await Points.findOne({where:{user_id: req.user.phone}})
        const clients = await Clients.findAll({where:{site:req.site}})
        const banner = await Banners.findAll({where:{site:req.site}})
        const badge = await PointBadge.findAll({where:{site:req.site}})

        // const winners  TODO::Winners
        return dataSuccess(res, {"point":point, "clients":clients, "banner":banner, "badge":badge})
    } catch (err) {
        serverError(res, err)
    }
    // Point
    // Clients
    // winners top 5
    // Banner
    // 

}