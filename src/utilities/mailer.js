const responses = require('./responses')
const nodemailer = require('nodemailer');
const { SiteSettings } = require('../models/SiteConfig');



exports.sendMail = async ({ user, data }) => {
    const site = await SiteSettings.findOne({ where: { id: user.site } })
    if (site){
        const transporter = nodemailer.createTransport({
            service: site.service_provider,
            host: site.host_provider,
            port: site.port,
            auth: {
                user: site.user_email,
                pass: site.user_password
            }
        });
    
    
        const mailOptions = {
            from: `"${site.sitename}" ${site.user_email}`,
            to: email,
            subject: subject,
            html: data
        }
    
        await transporter.sendMail(mailOptions, async (err, data) => {
            if (err) console.log(err);
            else console.log("sent")
        })
    }
   
}


