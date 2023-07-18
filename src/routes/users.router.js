import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import premiumRoute from "./premium.router.js";
import {
  documentsMulter,
  profilesMulter,
  uploader,
  pathDir,
} from "../utils/uploader.js";

const route = Router();

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

route.delete("/:idUsuario", usersController.delete.bind(usersController));

export default route;
