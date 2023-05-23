import nodemailer from "nodemailer";
import config from "../../config.js";

class EmailService {
  #transporter;

  constructor() {
    this.#transporter = nodemailer.createTransport(config.mail);
  }

  async sendEmail({ to, subject, html, attachments = [] }) {
    await this.#transporter.sendMail({
      from: `'CoderBack' <${config.mail.auth.user}`,
      to,
      subject,
      html,
      attachments,
    });
  }
}

export const emailService = new EmailService();
