import { Router } from "express";
import passport from "passport";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import { authenticated } from "../utils/middlewares/auth.js";

const route = Router();

route.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/failureLogin",
  }),
  async (req, res) => {
    // const alreadyEmail = req.session.user;
    // if (alreadyEmail) {
    //   return res.redirect("/perfil");
    // }
    // const { email, password } = req.body;

    // if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    //   req.session.user = email;
    //   return res.redirect("/perfil");
    // } else {
    //   const user = await userModel.findOne({ email });
    //   // console.log(user);
    //   if (!user || !isValidPassword(password, user.password)) {
    //     return res.status(401).send({
    //       error: "email o contraseña incorrectos",
    //     });
    //   }
    // console.log("auth router", req.session.user);

    req.session.user = req.user.email;
    // console.log(req.session.user);

    res.redirect("/products");
    // }
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
    // try {
    //   const usuario = req.body;
    //   const hashedPassword = createHash(usuario.password);
    //   const { _id } = await userModel.create({
    //     ...usuario,
    //     password: hashedPassword,
    //   });
    res.status(201).send({ message: "Usuario creado" });
    // } catch (error) {
    //   res.status(500).send({ error });
    // }
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
