import { Router } from "express";
import { passportCall } from "../utils/middlewares/auth.js";
import sessionController from "../controllers/session.controller.js";

const route = Router();

route.get("/", sessionController.get.bind(sessionController));

route.get(
  "/current",
  passportCall("current"),
  sessionController.current.bind(sessionController)
);

export default route;
