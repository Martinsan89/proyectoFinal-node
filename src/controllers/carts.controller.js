import { cartModel } from "../dao/models/carts.models.js";
import CartsService from "../services/carts.service.js";
import { BadRequestException } from "../classes/errors/bad-request-exception.js";
import { NotFoundException } from "../classes/errors/not-found-exception.js";

async function getCart(id) {
  const cart = await cartModel.findOne({ _id: id });
  return cart;
}

class CartsController {
  #service;
  constructor(service) {
    this.#service = service;
  }
  async get(req, res, next) {
    try {
      const carts = await this.#service.find();
      res.status(200).send({ carts });
    } catch (error) {
      next(new NotFoundException());
    }
  }

  async findById(req, res, next) {
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
  }

  async create(req, res, next) {
    try {
      const { _id } = await this.#service.create();
      res.status(201).send({ _id });
    } catch (error) {
      next(new BadRequestException());
    }
  }

  async update(req, res, next) {
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
          await this.#service.update(
            { _id: cart.id },
            { products: cart.products }
          );
          res.status(200).send({ cart });
        }
      }
    } catch (error) {
      next(new BadRequestException());
    }
  }

  async updateProdInCart(req, res, next) {
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
          : await this.#service.update(
              { _id: cart.id },
              { products: cart.products }
            );

        res.status(201).send({ ok: true });
      }
    } catch (error) {
      // throw error;
      next(new NotFoundException());
    }
  }

  async delete(req, res, next) {
    const cartId = req.params.cId;

    try {
      await this.#service.delete({ _id: cartId });
      res.status(200).send({ ok: true });
    } catch (error) {
      next(new NotFoundException());
    }
  }

  async deleteProdInCart(req, res, next) {
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
          await this.#service.update({ _id: cart.id }, { products: newCart });
        }
        res.status(200).send({ ok: true });
      }
    } catch (error) {
      next(new NotFoundException());
    }
  }
}

const controller = new CartsController(new CartsService());
export default controller;
