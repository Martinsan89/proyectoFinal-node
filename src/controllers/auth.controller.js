import { createHash } from "../utils/crypto.js";
import jwt from "jsonwebtoken";
import config from "../../config.js";
import DaoFactory from "../dao/persistenceFactory.js";

const SECRET = config.jwt_token;

function generateToken(user) {
  const token = jwt.sign({ user }, SECRET, { expiresIn: "24h" });
  return token;
}

class AuthController {
  #service;
  #cartService;
  constructor(service, cartService) {
    this.#service = service;
    this.#cartService = cartService;
  }

  async login(req, res) {
    try {
      const user = req.user;
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
    } catch (error) {
      console.log("authcontroller", error);
    }
  }

  async logout(req, res) {
    res.clearCookie("jwt");
    res.redirect("/login");
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

  async restorePassword(req, res) {
    const { email, newPassword } = req.body;
    const user = await this.#service.findOne({ email });
    if (!user) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    const hashedPassword = createHash(newPassword);
    await this.#service.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
    res.send({ message: "Password changed" });
  }

  async callbackGithub(req, res) {
    req.session.user = req.user.email;
    res.redirect("/");
  }
}

const DaoService = await DaoFactory.getDao();
const productsService = await DaoService.getService("products");
const cartsService = await DaoService.getService("carts");

const controller = new AuthController(
  new productsService(),
  new cartsService()
);
export default controller;
