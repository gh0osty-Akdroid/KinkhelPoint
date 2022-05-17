const randomstring = require('randomstring');


exports.addImage = async (image) => {
    const location = 'src/public/Storage/Uploads'
    const filename = Date.now() + randomstring.generate('16')
    var data = image.replace(/^data:image\/\w+;base64,/, "")
    var fName = `${location}/${filename}.png`
    var dbLocation = `Uploads/${filename}.png`

    fs.writeFileSync(fName, data, { encoding: "base64" }, function (err) {
        responses.serverError(res, err)
    })
    return dbLocation
}

exports.removeImage = async (url) => {
    var url = `${__dirname}/../public/Storage/${url}`
    await fs.unlink(url, (err) => {
        if (err) {
            console.log(err)
        }
    })
}
