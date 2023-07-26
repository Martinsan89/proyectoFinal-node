import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth.controller.js";
import { passportCall } from "../utils/middlewares/auth.js";
import { validateBody } from "../middlewares/validator.middleware.js";
import { validator } from "../validator/validator.js";
import { UserDto } from "../dtos/post/user.dto.js";

const route = Router();

route.post(
  "/login",
  passportCall("login"),
  authController.login.bind(authController)
);

route.post(
  "/logout",
  passportCall("current"),
  authController.logout.bind(authController)
);

route.post(
  "/register",
  validateBody(validator(UserDto)),
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
