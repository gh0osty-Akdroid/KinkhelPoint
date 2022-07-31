const { dataSuccess } = require('./responses');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const sendOTP =async (res, phone, message) => {
dataSuccess(res,message )
    // await client.messages
    //   .create({
    //      body: message,
    //      from: process.env.TWILIO_PHONE_NUMBER,
    //      to: `+977${phone}`
    //    })
    //   .then(message => console.log(res, message.sid)).catch(err=>console.log(err))
  }

  module.exports = sendOTP

