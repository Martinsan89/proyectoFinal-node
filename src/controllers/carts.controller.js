import { BadRequestException } from "../classes/errors/bad-request-exception.js";
import { NotFoundException } from "../classes/errors/not-found-exception.js";
import DaoFactory from "../dao/persistenceFactory.js";
import jwt from "jsonwebtoken";
import config from "../../config.js";

const SECRET = config.jwt_token;

function generateToken(user) {
  const token = jwt.sign({ user }, SECRET, { expiresIn: "24h" });
  return token;
}

class CartsController {
  #service;
  #ticketService;
  #productsService;
  #usersService;

  constructor(service, ticketService, productsService, usersService) {
    this.#service = service;
    this.#ticketService = ticketService;
    this.#productsService = productsService;
    this.#usersService = usersService;
  }

  async getCart(id) {
    const cart = await this.#service.findById(id);
    return cart;
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
      const cart = await this.getCart(cId);
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
      res.userErrorResponse("Fallo al crear un nuevo carrito", 105);
    }
  }

  async update(req, res, next) {
    const cartId = req.params.cId;
    const productsInCart = req.body;

    try {
      if (!productsInCart.product) {
        next(new BadRequestException());
        return;
      } else {
        const cart = await this.getCart(cartId);
        if (!cart) {
          next(new NotFoundException());
        } else {
          const sameProd = cart.products.find(
            (e) => e.product._id.toString() == productsInCart.product
          );
          if (sameProd) {
            sameProd.quantity =
              Number(sameProd.quantity) + Number(productsInCart.quantity);
          } else {
            cart.products.push({
              product: productsInCart.product,
              quantity: productsInCart.quantity,
            });
          }

          const newCartRes = await this.#service.update(cartId, {
            ...cart,
          });
          res.status(200).send({ newCartRes });
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
      const cart = await this.getCart(cartId);
      if (!cart) {
        next(new BadRequestException());
        return;
      } else {
        const newProduct = cart.products.find((e) => {
          if (e.product._id.toString() === pId) {
            e.quantity = +newQuantity.quantity;
            return cart;
          } else {
            [];
          }
        });

        newProduct.length === 0
          ? next(NotFoundException)
          : await this.#service.update(
              { _id: cartId },
              { products: cart.products }
            );

        res.status(201).send({ ok: true });
      }
    } catch (error) {
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
      const cart = await this.getCart(cartId);
      if (!cart) {
        next(new BadRequestException());
      } else {
        const newCart = cart.products.filter((e) => {
          return e.product._id.toString() != productId;
        });

        if (newCart.length == cart.products.length) {
          next(new NotFoundException());
          return;
        } else {
          await this.#service.update({ _id: cartId }, { products: newCart });
        }
        res.status(200).send({ ok: true });
      }
    } catch (error) {
      next(new NotFoundException());
    }
  }

  async purchase(req, res, next) {
    const cartId = req.params.cId;
    const cart = await this.getCart(cartId);
    const prodOk = [];
    const prodFail = [];
    const userEmail = req.user.user.email;
    const userId = req.user.user.id;
    const date = new Date().toLocaleString();

    if (cart) {
      cart.products.map((e) => {
        e.product.stock >= e.quantity ? prodOk.push(e) : prodFail.push(e);
      });
    }

    if (prodOk.length > 0) {
      const totalProd = [];
      prodOk.map(async (e) => {
        totalProd.push(e.product.price * e.quantity);
        const newQty = e.product.stock - e.quantity;
        const prodStockUpdated = await this.#productsService.update(
          e.product._id,
          { stock: newQty }
        );
      });
      const ticket = {
        code: cartId,
        purchase_datetime: date,
        amount: totalProd.reduce((acc, num) => acc + num),
        purchaser: userEmail,
      };
      const { _id } = await this.#ticketService.create(ticket);
      const prodFailIDs = prodFail.map((e) => e.product._id);

      // Scope comentado para no borrar el cart luego de finalizar la compra
      // const updateCart = await this.#service.update(cartId, {
      //   products: prodFail,
      // });

      // actualizar el cart del usuario
      const user = await this.#usersService.findById(userId);
      user.cart.push(cartId);
      await this.#usersService.update(userId, { ...user });

      res.send({ ProductsFail: prodFailIDs, ticket, _id });
    }
    return;
  }
}

const DaoService = await DaoFactory.getDao();
const cartsService = await DaoService.getService("carts");
const ticketService = await DaoService.getService("tickets");
const productsService = await DaoService.getService("products");
const usersService = await DaoService.getService("users");

const controller = new CartsController(
  new cartsService(),
  new ticketService(),
  new productsService(),
  new usersService()
);
export default controller;
