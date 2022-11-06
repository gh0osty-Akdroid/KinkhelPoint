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

exports.generateSecretKey = () =>{
    return randomstring.generate({length: 20,
        charset: 'alphanumeric'})
}

exports.generateUId = () => {
    return parseInt(Math.floor(100000000000 + Math.random() * 900000000000))
}


exports.generateMerchantId = () => {
    return parseInt(Math.floor(100000000000 + Math.random() * 900000000000))
}

