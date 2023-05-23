import twilio from "twilio";
import config from "../../config.js";

class SmsService {
  #client;
  constructor() {
    this.#client = twilio(config.twilio.accountSid, config.twilio.authToken);
  }

  async sendSms({ to, body }) {
    await this.#client.messages.create({
      body,
      from: config.twilio.phoneNumber,
      to,
    });
  }
}

export const smsService = new SmsService();
