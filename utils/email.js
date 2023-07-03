const nodemailer = require('nodemailer');
require('dotenv').config();
function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'gargr0109@gmail.com',
    to: '1914365.cse.coe@cgc.edu.in',
    subject: 'new shoe add',
    text: 'here is the new shoes',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { sendEmail };
