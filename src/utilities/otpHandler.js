const { dataSuccess, serverError } = require('./responses');
var aws = require('aws-sdk')

const { SNSClient, SetSMSAttributesCommand } = require("@aws-sdk/client-sns");


aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY, region: process.env.AWS_ACCESS_REGION
})


const sns= new aws.SNS({ apiVersion: '2010-03-31' })



const sendOTP = async (res, phone, message) => {
  var params = {
    Message: message,
    PhoneNumber: phone,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        'DataType': 'String',
        'StringValue': "Test"
      }
    }
  };
  console.log(message)
  var publishTextPromise = sns.publish(params).promise();

  publishTextPromise.then(
    function (data) {
      dataSuccess(res, "You will receive a verificaion code soon.")
    }).catch(
      function (err) {
        serverError(res, err)
      });
}

module.exports = sendOTP

