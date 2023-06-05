import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("-m, --mode <mode>", "Select persistence", "mongo");
program.parse(process.argv);

const daoPersistence = program.opts().mode;

dotenv.config({
  path: `./.env.${daoPersistence}`,
});

const env = process.env;

export default {
  NODE_ENV: env.NODE_ENV,
  PERSISTENCE: env.PERSISTENCE,
  PORT: env.PORT,
  mongo_url: env.MONGO_URL,
  cookie_secret: env.COOKIE_SECRET,
  jwt_token: env.JWT_TOKEN,
  github_client_id: env.GITHUB_CLIENT_ID,
  github_client_secret: env.GITHUB_CLIENT_SECRET,
  github_callback_url: env.GITHUB_CALLBACK_URL,
  twilio: {
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    phoneNumber: env.TWILIO_PHONE_NUMBER,
  },
  mail: {
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  },
};
