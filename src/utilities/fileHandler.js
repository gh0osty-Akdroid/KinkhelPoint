const randomstring = require('randomstring');
const fs = require('fs')
const QRCode = require('qrcode')
const PDFDocument = require('pdfkit');
const { dataSuccess } = require('./responses');
const path = require('path');


exports.addImage = async (image) => {
    const location = 'src/public/Storage/Uploads'
    const filename = Date.now() + randomstring.generate('8')
    var data = image.replace(/^data:image\/\w+;base64,/, "")
    var fName = `${location}/${filename}.png`
    var dbLocation = `Uploads/${filename}.png`
    fs.writeFileSync(fName, data, { encoding: "base64" }, function (err) {
        console.log(err)
    })

    return dbLocation
}

exports.removeImage = async (url) => {
    var url = path.resolve(__dirname,`../public/Storage/${url}`)
    await fs.unlink(url, (err) => {
        if (err) {
            console.log(err)
        }
    })
}



const QrGenerator = async (data) => {
    return await QRCode.toDataURL(data)
}




exports.fileGenerator = async (res, data, batch, id) => {
    const doc = new PDFDocument();
    const location = 'src/public/Storage/Vouchers'
    const filename = Date.now() + randomstring.generate('12')
    var fName = `${location}/${id}${batch}.pdf`
    var dbLocation = `Vouchers/${id}${batch}.pdf`

    if (fs.existsSync(fName)) {
        fs.unlink(fName, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
    var writing = fs.createWriteStream(fName)
    doc.pipe(writing);
    for (var i = 0; i < data.length; i++) {
        const image = await QrGenerator(data[i].uid)
        if (i % 2 === 0) {
            doc.text(`id: ${i+1}`).moveDown().image(image, { fit: [200, 200], align: 'left', valign: 'center' }).text(`ID: ${data[i].id} , Unique-ID: ${data[i].uid}, Batch: ${data[i].batch}`, {
                width: 412,
                align: 'justify',
                indent: 30,
                height: 300,
                ellipsis: true
            }).save().moveDown()
        }
        else {
            doc.text(`id: ${i+1}`).moveDown().image(image, { fit: [200, 200], align: 'left', valign: 'center' }).text(`Voucher-ID: ${data[i].id} , Unique-ID: ${data[i].uid}, Batch: ${data[i].batch}`, {
                width: 412,
                align: 'justify',
                indent: 30,
                height: 300,
                ellipsis: true
            }).save().addPage()
        }
    }
    doc.on('end', function () {
        dataSuccess(res, dbLocation)
    })
    doc.end()

}
