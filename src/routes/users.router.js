import { Router } from "express";
import usersController from "../controllers/users.controller.js";
const route = Router();

route.get("/", usersController.paginate.bind(usersController));

route.get("/:idUsuario", usersController.findById.bind(usersController));

route.post("/", usersController.create.bind(usersController));

route.put("/:idUsuario", usersController.update.bind(usersController));

route.delete("/:idUsuario", usersController.delete.bind(usersController));

export default route;
