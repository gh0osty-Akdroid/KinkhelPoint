const { Points } = require("../../models/Points")
const PointsDetail = require("../../models/PointsDetail");
const { getPagingData, getPagination } = require("../../utilities/paginator");
const { dataSuccess, serverError, notFoundError } = require("../../utilities/responses")


exports.PointDetails = async(req, res) => {
    try {
        const { page } = req.query;
        const { limit, offset } = await getPagination(page, null);
        await Points.findOne({ where: { user_id: req.user.phone } }).then(async (data) => {
            await PointsDetail.findAndCountAll({ where: { point_id: data.id }, limit: limit, offset: offset }).then(async (e) => { 
                dataSuccess(res, e) }).catch((err) => notFoundError(res, err))
        })
    } catch (error) {
        serverError(res, error)
    }

}


exports.Point = async(req, res) => {
    try {
        const { page } = req.query;
        const { limit, offset } = await getPagination(page, null);
        await Points.findOne({ where: { user_id: req.user.phone } }).then(async (data) => {
           
                dataSuccess(res, data) 
        }).catch((err) => notFoundError(res, err))
    } catch (error) {
        serverError(res, error)
    }

}