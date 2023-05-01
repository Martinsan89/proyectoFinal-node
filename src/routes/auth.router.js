import { Router } from "express";
import passport from "passport";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import { authenticated, passportCall } from "../utils/middlewares/auth.js";
import jwt from "jsonwebtoken";

const route = Router();

const SECRET = "CODER_SUPER_SECRETO";
function generateToken(user) {
  const token = jwt.sign({ user }, SECRET, { expiresIn: "24h" });
  return token;
}

route.post(
  "/login",
  passportCall("login"),
  // passport.authenticate("login", {
  //   failureRedirect: "/failureLogin",
  // }),
  async (req, res) => {
    const user = req.user;
    const token = generateToken({
      id: user._id,
      email: user.email,
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000,
    });
    res.send({ user: req.user });

    // res.redirect("/products");
  }
);

route.post("/logout", authenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      res.redirect("/login");
    }
  });
});

route.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failureLogin",
  }),
  async (req, res) => {
    res.status(201).send({ message: "Usuario creado" });
  }
);

route.get("/failureRegister", (req, res) => {
  res.send({ error: "Error en el registro" });
});

route.get("/failureLogin", (req, res) => {
  res.send({ error: "Usuario o contraseña incorrectos" });
});

route.post("/restore-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404).send({ error: "User not found" });
    return;
  }
  const hashedPassword = createHash(newPassword);
  await userModel.updateOne({ email }, { $set: { password: hashedPassword } });
  res.send({ message: "Password changed" });
});

route.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  (req, res) => {}
);

route.get(
  "/callback-github",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user.email;
    res.redirect("/");
  }
);

export default route;
