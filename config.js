import dotenv from "dotenv";
dotenv.config();

const env = process.env;

export default {
  PORT: env.PORT,
  mongo_url: env.MONGO_URL,
  cookie_secret: env.COOKIE_SECRET,
  jwt_token: env.JWT_TOKEN,
  github_client_id: env.GITHUB_CLIENT_ID,
  github_client_secret: env.GITHUB_CLIENT_SECRET,
  github_callback_url: env.GITHUB_CALLBACK_URL,
};
