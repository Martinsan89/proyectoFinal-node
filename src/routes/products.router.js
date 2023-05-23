import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { uploader } from "../utils/uploader.js";
import { validateBody, validateParams } from "../middlewares/validators.js";
import { ProductDto } from "../dtos/post/product.dto.js";
import { Id } from "../dtos/post/id.param.dto.js";
import { validator } from "../validator/validator.js";
import { authorization, passportCall } from "../utils/middlewares/auth.js";

const route = Router();

route.get("/", productsController.getAll.bind(productsController));

route.get(
  "/:pid",
  validateParams(validator(Id)),
  productsController.findById.bind(productsController)
);

route.post(
  "/",
  uploader.single("file"),
  // passportCall("current"),
  // authorization("admin"),
  validateBody(validator(ProductDto)),
  productsController.create.bind(productsController)
);

route.put(
  "/:pid",
  uploader.single("file"),
  passportCall("current"),
  authorization("admin"),
  validateParams(validator(Id)),
  productsController.update.bind(productsController)
);

route.delete(
  "/:pid",
  // passportCall("current"),
  // authorization("admin"),
  validateParams(validator(Id)),
  productsController.delete.bind(productsController)
);

export default route;
