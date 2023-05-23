import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import { authorization, passportCall } from "../utils/middlewares/auth.js";

const route = Router();

route.post("/", cartsController.create.bind(cartsController));

route.get("/", cartsController.get.bind(cartsController));

route.get("/:cId", cartsController.findById.bind(cartsController));

route.put(
  "/:cId",
  passportCall("current"),
  authorization("user"),
  cartsController.update.bind(cartsController)
);

route.post(
  "/:cId/product/:pId",
  passportCall("current"),
  authorization("user"),
  cartsController.updateProdInCart.bind(cartsController)
);

route.delete("/:cId", cartsController.delete.bind(cartsController));

route.delete(
  "/:cId/product/:pId",
  cartsController.deleteProdInCart.bind(cartsController)
);

route.post(
  "/:cId/purchase",
  passportCall("current"),
  authorization("user"),
  cartsController.purchase.bind(cartsController)
);

export default route;
