import { Router } from "express";
import { productsManager } from "../dao/managers/products.manager.js";

const route = Router();

route.get("/", async (req, res) => {
  const products = await productsManager.getAll();

  if (!products) {
    res.render("notFound", {
      title: "Products",
    });
    return;
  }
  res.render("home", { products });
});

route.get("/realtimeproducts", async (req, res) => {
  const products = await productsManager.getAll();
  res.render("realtimeproducts", { products });
});

route.get("/chat", async (req, res) => {
  res.render("chat");
});

export default route;
