const express = require('express');
const payload = require('payload');
const cors = require('cors');


require('dotenv').config();
const app = express();
const transport = require('./email/config')

app.use(cors());

app.use('/', express.static(__dirname + '/app/dist'));

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  express: app,
  email: {
    fromName: process.env.SMTP_NAME,
    fromAddress: process.env.SMTP_USER,
    managerEmail: process.env.MANAGER_EMAIL,
    logMockCredentials: true,
    transport,
  },
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
  },
});

// Add your own express routes here
app.listen(3050);
