const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');

// Email config
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  secure: process.env.SMTP_PORT == 465,
  tls: {
    rejectUnauthorized: false,
  },
});

nunjucks.configure('email/templates', {
  noCache: true
});

transport.use('compile', (mail, callback) => {

  if(mail.data.template){
    mail.data.html = nunjucks.render(`${mail.data.template}.njk`, mail.data.context);
  }
  
  callback();
})

module.exports = transport;