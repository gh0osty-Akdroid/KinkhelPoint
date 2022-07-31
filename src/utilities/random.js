const randomstring = require('randomstring')
exports.generateId = () => {
    return parseInt(randomstring.generate({charset: 'numeric', length: 9}))
}

exports.generateToken = () =>{
    return Math.random().toString().substring(2, 8)
}

exports.generateCode =() =>{
    return randomstring.generate(126)
}

exports.generateUId = () => {
    return parseInt(randomstring.generate({charset: 'numeric', length: 12}))
}


exports.generateMerchantId = () => {
    return parseInt(randomstring.generate({charset: 'numeric', length: 12}))
}

