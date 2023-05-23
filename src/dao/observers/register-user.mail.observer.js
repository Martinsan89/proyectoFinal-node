import { emailService } from "../../external-services/email.service.js";

export class RegisterUserMailObserver {
  #emailService;
  constructor() {
    this.#emailService = emailService;
  }

  async update(user) {
    await this.#emailService.sendEmail({
      to: user.email,
      subject: "Welcome to Shoes-Ecommerce",
      html: `<h1>Hello ${user.name} </h1>`,
    });
  }
}
