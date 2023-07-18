import { Router } from "express";
import { passportCall } from "../utils/middlewares/auth.js";
import premiumController from "../controllers/premium.controller.js";

const route = Router();

route.post(
  "/:uid",
  passportCall("current"),
  premiumController.changeUserRole.bind(premiumController)
);

export default route;
