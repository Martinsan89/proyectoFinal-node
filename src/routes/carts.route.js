import { Router } from "express";
import { FileManager } from "../../data/cartsDB.js";
const CartManager = new FileManager("./data/carts.json");
const route = Router();

route.post("/", async (req, res) => {
  const products = [];
  const id = await CartManager.create(products);
  res.status(200).send({ id });
});

route.get("/:cId", async (req, res) => {
  const { cId } = req.params;
  const products = await CartManager.getById(cId);

  res.status(200).send({ products });
});

route.post("/:cId/product/:pId", async (req, res) => {
  const cId = req.params.cId;
  const pId = req.params.pId;
  const cart = await CartManager.addToCart(cId, pId);
  res.status(200).send({ ok: true });
});

export default route;
