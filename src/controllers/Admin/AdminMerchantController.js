const { Merchant, createMerchant, } = require('../../models/Merchant')
const { Points, userPointTransfer } = require('../../models/Points')
const { User, createUser } = require('../../models/User')
const { generateId, generateCode, generateMerchantId, generateUId, generateSecretKey } = require('../../utilities/random')
const { dataSuccess, notFoundError, serverError, dataAccepted } = require('../../utilities/responses')
const bcrypt = require('bcrypt');
const { addImage } = require('../../utilities/fileHandler')
const UserRoles = require('../../models/UserRoles')
const { getPagingData, getPagination } = require('../../utilities/paginator')
const { Op } = require('sequelize')
const MerchantPointConfig = require('../../models/MerchantPointConfig')


exports.getMerchant = async (req, res) => {
    const { page, size, site , input} = req.query;
    const { limit, offset } = await getPagination(page, size);
    if (!input) {
        await Merchant.findAndCountAll({ limit: limit, offset: offset, where: { site: req.site } }).then(async (e) => {
            const data = await getPagingData(e, page, limit)
            dataSuccess(res, data)
        }).catch(async (err) => notFoundError(res, err))
    }
    else {
        await Merchant.findAndCountAll({
            limit: limit, offset: offset, where: {
                site: req.site,
                [Op.or]: [
                    { parent_company: {[Op.iLike]: `%${input}%`}},
                    {merchant_code: {[Op.iLike]: `%${input}%`}}, 
                    {store_phone: {[Op.iLike]: `%${input}%`}}
                    ]
            },
        }).then(async (e) => {
            const data = await getPagingData(e, page, limit)
            dataSuccess(res, data)
        }).catch(async (err) => notFoundError(res, err))
    }
}

exports.showMerchant = async (req, res) => {
    const merchantId = req.params.id
    await Merchant.findOne({
        where: { id: merchantId }, include: {
            model: User,
            include: { model: Points },
            attributes: {
                exclude: ['password'],
            }
        }
    }).then(async (data) => { dataSuccess(res, data) }).catch(async (err) => notFoundError(res, err))
}


exports.createMerchants = async (req, res) => {
    const body = req.body
    var img
    if (body.user_id) {
        const merchant = await createMerchant(res, body)
    }
    else {
        var hash = await bcrypt.hash(body.password, 10)
        if(body.image !== "") {
            img = await addImage(body.image) 
        }
        const user = await User.build({
            "id": generateId(),
            'name': body.name,
            'phone': body.phone,
            'email': body.email,
            "image": img,
            'uid': generateUId(),
            'password': hash,
            "site":req.site
        })
        await user.save().then(async ()=>{
           const merchant=  await Merchant.build({
                id : generateId(),
                user_id: user.id,
                parent_company: body.parent_company,
                merchant_code: generateMerchantId(),
                store_address: body.store_address,
                store_phone: body.store_phone,
                pan_number: body.pan_number,
                region: body.region,
                site: req.site
            })
            await merchant.save().then(async ()=>{
                try{
                    await MerchantPointConfig.create({ merchant_id: merchant.id, id: generateId()})
                    const userRoles = await UserRoles.create({user_id:user.id, role:body.role, id:generateId()})
                    return dataAccepted(res)
                }
                catch(err){
                    console.log(err)
                }
            
            }).catch((err)=>{
                return serverError(res, err)
        }).catch((err)=>{
            return serverError(res, err)
        })
    })
    }
    
}

exports.updateMercahnt = async (req, res) => {
    let merchant = new Merchant()
    const body = req.body
    merchant = req.body.Merchant
    try {
        if (body.secret_key === true) {
            merchant.update({ secret_key: generateSecretKey()})
            dataSuccess(res,"Secret key Generated.")
        }
        else if (body.verified!== null) {
            merchant.update({ verified: body.verified })
            dataSuccess(res,"Verification Updated.")
        } 
        else{
            dataSuccess(res, "Nothing updated.")
        }
    } catch (err) {
        serverError(res, err)
    }
}

exports.sendPoint = async (req, res) => {
    const merchantId = req.params.id
    const body = req.body
    await Merchant.findOne({
        where: { id: merchantId }, include: {
            model: User,
            include: { model: Points },
            attributes: {
                exclude: ['password'],
            }
        }
    }).then(async (data) => {
        const admin = await Points.findOne({where: {user_id : req.user?.phone}})
        const point = await Points.findOne({ where: { user_id: data?.User?.phone } })
        point.points += parseFloat(body.points)
        const values = {
            token: null,
            point_id: point.id,
            merchant_id: null,
            points: parseFloat(body.points),
            remarks: `${body.remarks}`,
            other: `You received ${parseFloat(body.points)} points from Purchase`,
        }
        const adminValues = {
            token: null,
            point_id: admin.id,
            merchant_id: null,
            points: parseFloat(body.points),
            remarks: `${body.remarks}`,
            other: `You sent ${parseFloat(body.points)} points to ${data.parent_company}`,
        }
        await point.save()
        await userPointTransfer(req, res, values)
        await userPointTransfer(req, res, adminValues)

        dataSuccess(res, data)
    })
}
