const express = require('express');
const payload = require('payload');
const cors = require('cors');

require('dotenv').config();
const app = express();

app.use(cors());

app.use('/', express.static(__dirname + '/app/dist'));

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  express: app,
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
  },
});

// Add your own express routes here

app.listen(3050);
