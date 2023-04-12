import { Router } from "express";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import sessionRouter from "./session.router.js";
import usersRouter from "./users.router.js";
import authRouter from "./auth.router.js";

const route = Router();

route.use("/products", productsRouter);
route.use("/carts", cartsRouter);
route.use("/session", sessionRouter);
route.use("/users", usersRouter);
route.use("/auth", authRouter);

export default route;
