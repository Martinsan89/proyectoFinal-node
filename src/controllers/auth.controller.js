import ProductsService from "../services/products.service.js";
import { createHash } from "../utils/crypto.js";
import jwt from "jsonwebtoken";
import config from "../../config.js";

const SECRET = config.jwt_token;

function generateToken(user) {
  const token = jwt.sign({ user }, SECRET, { expiresIn: "24h" });
  return token;
}

class AuthController {
  #service;
  constructor(service) {
    this.#service = service;
  }

  async login(req, res) {
    const user = req.user;
    const token = generateToken({
      id: user._id,
      email: user.email,
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000,
    });
    // res.send({ user: req.user });
    res.redirect("/");
  }

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.redirect("/login");
      }
    });
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

const controller = new AuthController(new ProductsService());
export default controller;
