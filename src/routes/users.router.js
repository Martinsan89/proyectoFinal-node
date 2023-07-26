import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import premiumRoute from "./premium.router.js";
import {
  documentsMulter,
  profilesMulter,
  uploader,
  pathDir,
} from "../utils/uploader.js";
import { authorization, passportCall } from "../utils/middlewares/auth.js";

const route = Router();

// Rutas admin

route.get(
  "/get",
  // passportCall("current"),
  // authorization(["admin"]),
  usersController.find.bind(usersController)
);
route.delete(
  "/delete",
  // passportCall("current"),
  // authorization(["admin"]),
  usersController.delete.bind(usersController)
);

// Rutas users

route.get("/", usersController.find.bind(usersController));

route.get("/:uid", usersController.findById.bind(usersController));

route.post(
  "/",
  uploader(pathDir.profiles).array("files"),
  profilesMulter,
  usersController.create.bind(usersController)
);

route.post(
  "/:uid/documents",
  uploader(pathDir.documents).array("files"),
  documentsMulter,
  usersController.documents.bind(usersController)
);

route.use("/premium", premiumRoute);

route.put("/:idUsuario", usersController.update.bind(usersController));

route.delete("/:idUsuario", usersController.deleteOne.bind(usersController));

export default route;
