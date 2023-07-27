import { createHash, isValidPassword } from "../utils/crypto.js";
import jwt from "jsonwebtoken";
import config from "../../config.js";
import DaoFactory from "../dao/persistenceFactory.js";
import logger from "../logger/winstom-custom-logger.js";
import { emailService } from "../external-services/email.service.js";

const SECRET = config.jwt_token;

function generateToken(user) {
  const token = jwt.sign({ user }, SECRET, { expiresIn: "24h" });
  return token;
}

class AuthController {
  #cartService;
  #emailService;
  #usersService;
  constructor(cartService, usersService) {
    this.#cartService = cartService;
    this.#emailService = emailService;
    this.#usersService = usersService;
  }

  async login(req, res) {
    const user = req.user;
    try {
      const { _id } = await this.#cartService.create();
      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
        cart: _id,
        phone: user.phone,
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3600000,
      });
      res.send({ user: req.user });
      // Update Last Connection
      const date = new Date();
      const dateInMs = date.getMilliseconds();
      let lastConnection = {
        last_connection: dateInMs,
      };
      const updateLastConnection = await this.#usersService.update(
        user._id,
        lastConnection
      );
    } catch (error) {
      logger.info("authcontroller", error);
    }
  }

  async logout(req, res) {
    res.clearCookie("jwt");
    res.okResponse("Logout success");
    // Update Last Connection
    const user = req.user;
    let lastConnection = {
      last_connection: new Date().toLocaleString(),
    };
    const updateLastConnection = await this.#usersService.update(
      user._id,
      lastConnection
    );
  }

  async register(req, res) {
    res.status(201).send({ message: "Usuario creado" });
  }

  async failureRegister(req, res) {
    res.send({ error: "Error en el registro" });
  }

  async failureLogin(req, res) {
    res.send({ error: "Usuario o contraseña incorrectos" });
  }

  async restorePassword(req, res, next) {
    const { email } = req.body;

    try {
      const user = await this.#usersService.findOne(email);
      if (!user) {
        res.status(404).send({ message: "usuario no encontrado" });
        return;
      }
      await this.#emailService.sendEmail({
        to: email,
        subject: "Welcome to Shoes-Ecommerce",
        html: `<h1>Reestablezca la contraseña</h1>
          <button> <a href="http://proyectofinal-node-production.up.railway.app/forgotPassword">Click para reestablecer la contrasena</a></button>`,
      });
      const token = generateToken({
        id: user._id,
        email: user.email,
        password: user.password,
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3600000,
      });
      res.send({ ok: true });
    } catch (error) {
      next(error);
    }
  }

  async setNewPassword(req, res, next) {
    const newPassword = req.body.password;
    const oldPassword = req.user.user.password;
    const userId = req.user.user.id;

    if (isValidPassword(newPassword, oldPassword)) {
      res.status(400).send({ error: "Misma contraseña" });
      return;
    }

    const hashedPassword = createHash(newPassword);

    await this.#usersService.update(
      { _id: userId },
      { password: hashedPassword }
    );
    res.clearCookie("jwt");
    res.send({ message: "Password changed" });
  }

  async callbackGithub(req, res) {
    req.session.user = req.user.email;
    res.redirect("/");
  }
}

const DaoService = await DaoFactory.getDao();
const cartsService = await DaoService.getService("carts");
const usersService = await DaoService.getService("users");

const controller = new AuthController(new cartsService(), new usersService());
export default controller;
