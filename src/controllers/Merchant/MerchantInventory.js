const { Products, ProductImage } = require('../../models/Inventory')
const { ProductVariation } = require('../../models/InventoryVariations')
const { addImage } = require("../../utilities/fileHandler")
const { generateId } = require("../../utilities/random")
const { dataCreated, serverError, dataSuccess, notFoundError } = require("../../utilities/responses")

exports.AddInventory = async (req, res) => {
    const body = req.body
    try{
        const data = await Products.build({
            id: generateId(),
            name: body.name,
            merchant_id: req.merchant.id
        })
        await data.save().then(()=>{
             body?.images.forEach(async e => {
            var img = await addImage(e)
            var image = await ProductImage.build({ product_id: data.id, image: img })
            await image.save()
        });
        body?.variation.forEach(async e => {
            var variation = await ProductVariation.build({
                product_id: data.id,
                size: e["size"],
                price: e["price"],
            })
            await variation.save()
        });
        })
        return dataCreated(res, data)
    }
    catch(err){
        serverError(res, err)
    }
}


exports.getAllInventory = async (req, res) => {
    try {
        await Products.findAll({ where: { merchant_id: req.merchant.id }, include: [{ model: ProductImage }, { model: ProductVariation }] }).then(data => {
            data.length >0 ? dataSuccess(res, data) : notFoundError(res, null)
            
        }).catch(err=>{
            return notFoundError(res, err)
        })
    } catch (err) {
        return serverError(res, err)
    }
    
}


exports.getSingleInventory= async(req, res)=>{
    await Products.findOne({ where : { id : req.params.id }, include: [{ model: ProductImage }, { model: ProductVariation }] }).then((data)=>{
        return dataSuccess(res, data)
    }).catch(err=>{
        serverError(res, err)
    })
}