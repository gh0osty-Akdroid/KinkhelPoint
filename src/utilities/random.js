const randomstring = require('randomstring')
exports.generateId = () => {
    return parseInt(randomstring.generate({charset: 'numeric', length: 9}))
}


exports.generateUId = () => {
    return parseInt(randomstring.generate({charset: 'numeric', length: 12}))
}


exports.generateMerchantId = () => {
    return parseInt(randomstring.generate({charset: 'numeric', length: 9}))
}

