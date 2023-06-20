import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { passportCall } from "../utils/middlewares/auth.js";
const route = Router();

route.get("/", usersController.find.bind(usersController));

route.get("/:idUsuario", usersController.findById.bind(usersController));

route.post("/", usersController.create.bind(usersController));

route.post(
  "/premium/:uid",
  passportCall("current"),
  usersController.changeUserRole.bind(usersController)
);

route.put("/:idUsuario", usersController.update.bind(usersController));

route.delete("/:idUsuario", usersController.delete.bind(usersController));

export default route;
