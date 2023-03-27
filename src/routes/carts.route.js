import { Router } from "express";
import { cartsManager } from "../dao/managers/carts.manager.js";
import { BadRequestException } from "../classes/errors/bad-request-exception.js";
import { NotFoundException } from "../classes/errors/not-found-exception.js";

const route = Router();

route.post("/", async (req, res, next) => {
  try {
    const { _id } = await cartsManager.create();
    res.status(201).send({ _id });
  } catch (error) {
    next(new BadRequestException());
  }
});

route.get("/:cId", async (req, res, next) => {
  const { cId } = req.params;
  try {
    const products = await cartsManager.findById(cId);
    res.status(200).send({ products });
  } catch (error) {
    next(new NotFoundException());
  }
});

route.put("/:cId/product/:pId", async (req, res, next) => {
  const cartId = req.params.cId;
  const productId = req.params.pId;

  try {
    const cart = await cartsManager.findById(cartId);
    cart.products.push(productId);
    const result = await cartsManager.update(
      { _id: cart.id },
      { products: cart.products }
    );
    res.status(201).send({ cart });
  } catch (error) {
    next(new BadRequestException());
  }
});

export default route;
