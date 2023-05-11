import { Router } from "express";
import { authenticated } from "../utils/middlewares/auth.js";
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

route.get("/chat", viewsController.chat.bind(viewsController));

route.get(
  "/products",
  authenticated,
  viewsController.products.bind(viewsController)
);

route.get(
  "/productDetail/:pId",
  viewsController.productDetail.bind(viewsController)
);

route.get("/carts/:cId", viewsController.carts.bind(viewsController));

route.get("/register", viewsController.register.bind(viewsController));

route.get("/login", viewsController.login.bind(viewsController));

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
