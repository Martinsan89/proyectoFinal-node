import { Router } from "express";
// import { cartsManager } from "../dao/managers/carts.manager.js";
// import { cartModel } from "../dao/models/carts.models.js";
import cartsController from "../controllers/carts.controller.js";

const route = Router();

route.post("/", cartsController.create.bind(cartsController));

route.get("/", cartsController.get.bind(cartsController));

route.get("/:cId", cartsController.findById.bind(cartsController));

route.put("/:cId", cartsController.update.bind(cartsController));

route.post(
  "/:cId/product/:pId",
  cartsController.updateProdInCart.bind(cartsController)
);

route.delete("/:cId", cartsController.delete.bind(cartsController));

route.delete(
  "/:cId/product/:pId",
  cartsController.deleteProdInCart.bind(cartsController)
);

export default route;
