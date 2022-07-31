const responses = require('./responses')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.SERVICES,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});


exports.sendEmail = async (email, subject, data) => {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: data
    }
    
    await transporter.sendMail(mailOptions, async (err, data) => {
        if (err) console.log(err);
    })
}