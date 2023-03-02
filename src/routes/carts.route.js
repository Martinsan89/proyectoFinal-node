import { Router } from "express";
import { CartsManager } from "../db/cartsDB.js";

const CartManager = new CartsManager("./data/carts.json");
const route = Router();

route.post("/", async (req, res) => {
  const products = [];
  const id = await CartManager.create(products);
  if (!id) {
    res.status(404).send({ error: "Ruta inválida" });
  }
  res.status(201).send({ id });
});

route.get("/:cId", async (req, res) => {
  const { cId } = req.params;
  const products = await CartManager.getById(cId);
  if (products) {
    res.status(200).send({ products });
  } else {
    res.status(404).send({ Error: "Carrito no encontrado" });
  }
});

route.post("/:cId/product/:pId", async (req, res) => {
  const cartId = req.params.cId;
  const productId = req.params.pId;
  const cart = await CartManager.addToCart(cartId, productId);

  if (cart === "Carrito no encontrado") {
    res.status(400).send({ cart });
  } else {
    res.status(201).send({ cart });
  }
});

export default route;
