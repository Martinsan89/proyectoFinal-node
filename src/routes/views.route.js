import { Router } from "express";
import viewsController from "../controllers/views.controller.js";
import { passportCall, authorization } from "../utils/middlewares/auth.js";

const route = Router();

route.get(
  "/",
  passportCall("current"),
  viewsController.home.bind(viewsController)
);

route.get(
  "/realtimeproducts",
  viewsController.realtimeProducts.bind(viewsController)
);

route.get(
  "/chat",
  passportCall("current"),
  authorization("user"),
  viewsController.chat.bind(viewsController)
);

route.get("/products", viewsController.products.bind(viewsController));

route.get(
  "/productDetail/:pId",
  passportCall("current"),
  authorization("user"),
  viewsController.productDetail.bind(viewsController)
);

route.get("/carts/:cId", viewsController.carts.bind(viewsController));

route.get("/register", viewsController.register.bind(viewsController));

route.get(
  "/login",
  passportCall("current"),
  viewsController.login.bind(viewsController)
);

route.get(
  "/perfil",
  passportCall("current"),
  viewsController.perfil.bind(viewsController)
);

route.get(
  "/forgot-password",
  viewsController.forgotPassword.bind(viewsController)
);

route.get("/failureLogin", viewsController.failureLogin.bind(viewsController));

export default route;
