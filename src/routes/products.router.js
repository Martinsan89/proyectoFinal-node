import { Router } from "express";
import productsController from "../controllers/products.controller.js";
// import { uploader } from "../utils/uploader.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validator.middleware.js";
import { ProductDto } from "../dtos/post/product.dto.js";
import { Id } from "../dtos/post/id.param.dto.js";
import { validator } from "../validator/validator.js";
import { authorization, passportCall } from "../utils/middlewares/auth.js";
import { productsMulter, uploader, pathDir } from "../utils/uploader.js";

const route = Router();

route.get("/", productsController.getAll.bind(productsController));

route.get(
  "/:pid",
  passportCall("current"),
  // validateParams(validator(Id)),
  productsController.findById.bind(productsController)
);

route.post(
  "/",
  // uploader.single("file"),
  passportCall("current"),
  authorization(["admin", "premium"]),
  validateBody(validator(ProductDto)),
  productsController.create.bind(productsController)
);

route.put(
  "/:pid",
  // uploader.single("file"),
  uploader(pathDir.products).array("files"),
  productsMulter,
  passportCall("current"),
  authorization(["admin", "premium"]),
  validateParams(validator(Id)),
  productsController.update.bind(productsController)
);

route.delete(
  "/:id",
  passportCall("current"),
  authorization(["admin", "premium"]),
  validateParams(validator(Id)),
  productsController.delete.bind(productsController)
);

export default route;
