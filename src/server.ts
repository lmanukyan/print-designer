import express from "express";
import payload from "payload";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import transport from "./email/config";

const app = express();
app.use(cors());
app.use("/", express.static(__dirname + "/app/dist"));

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    email: {
      transport,
      fromName: process.env.SMTP_NAME,
      fromAddress: process.env.SMTP_USER,
      logMockCredentials: true,
      transportOptions: {
        managerEmail: process.env.MANAGER_EMAIL,
      },
    },
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.listen(3050);
};

start();
