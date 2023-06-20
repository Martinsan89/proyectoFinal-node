import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth.controller.js";
import { passportCall } from "../utils/middlewares/auth.js";

const route = Router();

route.post(
  "/login",
  passportCall("login"),
  authController.login.bind(authController)
);

route.post("/logout", authController.logout.bind(authController));

route.post(
  "/register",
  passportCall("register"),
  authController.register.bind(authController)
);

route.get(
  "/failureRegister",
  authController.failureRegister.bind(authController)
);

route.get("/failureLogin", authController.failureLogin.bind(authController));

route.post(
  "/restorePassword",
  authController.restorePassword.bind(authController)
);

route.post(
  "/setNewPassword",
  passportCall("current"),
  authController.setNewPassword.bind(authController)
);

route.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  (req, res) => {}
);

route.get(
  "/callback-github",
  passport.authenticate("github", { failureRedirect: "/login" }),
  authController.callbackGithub.bind(authController)
);

export default route;
