import { Router } from "express";
import { cartsManager } from "../dao/managers/carts.manager.js";
import { cartModel } from "../dao/models/carts.models.js";
import { BadRequestException } from "../classes/errors/bad-request-exception.js";
import { NotFoundException } from "../classes/errors/not-found-exception.js";

const route = Router();

async function getCart(id) {
  const cart = await cartModel.findOne({ _id: id });
  return cart;
}

route.post("/", async (req, res, next) => {
  try {
    const { _id } = await cartsManager.create();
    res.status(201).send({ _id });
  } catch (error) {
    next(new BadRequestException());
  }
});

route.get("/", async (req, res, next) => {
  try {
    const carts = await cartsManager.getAll();
    res.status(200).send({ carts });
  } catch (error) {
    next(new NotFoundException());
  }
});

route.get("/:cId", async (req, res, next) => {
  const cId = req.params.cId;
  try {
    const cart = await getCart(cId);
    if (!cart) {
      next(new BadRequestException());
      return;
    } else {
      res.status(200).send({ cart });
    }
  } catch (error) {
    next(new NotFoundException());
  }
});

route.put("/:cId", async (req, res, next) => {
  const cartId = req.params.cId;
  const productsInCart = req.body;

  try {
    if (!productsInCart.productId) {
      next(new BadRequestException());
      return;
    } else {
      const cart = await getCart(cartId);
      if (!cart) {
        next(new NotFoundException());
      } else {
        cart.products.push(productsInCart);
        await cartsManager.update(
          { _id: cart.id },
          { products: cart.products }
        );
        res.status(200).send({ cart });
      }
    }
  } catch (error) {
    next(new BadRequestException());
  }
});

route.post("/:cId/product/:pId", async (req, res, next) => {
  const cartId = req.params.cId;
  const pId = req.params.pId;
  const newQuantity = req.body;

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      next(new BadRequestException());
      return;
    } else {
      const newProduct = cart.products.find((e) => {
        if (e.productId._id.toString() === pId) {
          e.quantity = newQuantity.quantity;
          return cart;
        } else {
          [];
        }
      });

      newProduct.length == 0
        ? next(NotFoundException)
        : await cartsManager.update(
            { _id: cart.id },
            { products: cart.products }
          );

      res.status(201).send({ ok: true });
    }
  } catch (error) {
    // throw error;
    next(new NotFoundException());
  }
});

route.delete("/:cId", async (req, res, next) => {
  const cartId = req.params.cId;

  try {
    await cartsManager.delete({ _id: cartId });
    res.status(200).send({ ok: true });
  } catch (error) {
    next(new NotFoundException());
  }
});

route.delete("/:cId/product/:pId", async (req, res, next) => {
  const cartId = req.params.cId;
  const productId = req.params.pId;

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      next(new BadRequestException());
    } else {
      const newCart = cart.products.filter((e) => {
        return e.productId._id.toString() != productId;
      });

      if (newCart.length == cart.products.length) {
        next(new NotFoundException());
        return;
      } else {
        await cartsManager.update({ _id: cart.id }, { products: newCart });
      }
      res.status(200).send({ ok: true });
    }
  } catch (error) {
    next(new NotFoundException());
  }
});

export default route;
