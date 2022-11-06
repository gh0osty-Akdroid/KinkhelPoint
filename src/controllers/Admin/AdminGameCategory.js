const { default: axios } = require("axios");
const { dataSuccess, serverError, validationError } = require("../../utilities/responses");
const { errorHandler } = require("../User/UserGameController");

const AdminGameUrl = axios.create({
    baseURL:process.env.GAMEURL
})

exports.show = async(req, res)=>{
    AdminGameUrl.get(`/categories?site=${req.site}`).then((data)=>{
        return dataSuccess(res, data?.data?.data)
    }).catch((err)=>{
        return errorHandler(res, err)
    })
}


exports.add = async(req, res)=>{
    const body = req.body
    const data = {site:req.site, ...body}
    AdminGameUrl.post(`/categories`, data).then((data)=>{
        return dataSuccess(res, data?.response)
    }).catch((err)=>{
        return errorHandler(res, err)
    })
}

exports.getCategory = async(req, res)=>{
    const id = req.params.id
    AdminGameUrl.get(`/category/${id}`).then((data)=>{
        return dataSuccess(res, data?.data?.data)
    }).catch((err)=>{
        return errorHandler(res, err)
    })
}

exports.updateCategory = async(req, res)=>{
    const id = req.params.id
    AdminGameUrl.put(`/categories`, req.body).then((data)=>{
        return dataSuccess(res, data?.data?.data)
    }).catch((err)=>{
       errorHandler(res, err)
    })
}

exports.deleteCategory = async(req, res)=>{

    AdminGameUrl.delete(`/categories`, {data:req.body}).then((data)=>{
        return dataSuccess(res, data?.data?.data)
    }).catch((err)=>{
       errorHandler(res, err)
    })
}