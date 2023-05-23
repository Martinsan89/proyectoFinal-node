import { smsService } from "../../external-services/sms.service.js";

export class RegisterUserSmsObserver {
  #smsService;
  constructor() {
    this.#smsService = smsService;
  }

  async update(user) {
    await this.#smsService.sendSms({
      to: user.phone,
      body: `<h1>Hello ${user.name} </h1>`,
    });
  }
}
