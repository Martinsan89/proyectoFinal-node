import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { uploader } from "../utils/uploader.js";

const route = Router();

route.get("/", productsController.aggregatePaginate.bind(productsController));

route.get("/:pid", productsController.findById.bind(productsController));

route.post(
  "/",
  uploader.single("file"),
  productsController.create.bind(productsController)
);

route.put(
  "/:pid",
  uploader.single("file"),
  productsController.update.bind(productsController)
);

route.delete("/:pid", productsController.delete.bind(productsController));

export default route;
