import { BadRequestException } from "../classes/errors/bad-request-exception.js";
import { NotFoundException } from "../classes/errors/not-found-exception.js";
import DaoFactory from "../dao/persistenceFactory.js";
import config from "../../config.js";
import CustomError from "../errors/custom.errors.js";
import { ValidatorError } from "../validator/validator.error.js";
import ErrorEnum from "../errors/errors.enum.js";
import logger from "../logger/winstom-custom-logger.js";

const { PERSISTENCE } = config;

class ProductsController {
  #service;
  constructor(service) {
    this.#service = service;
  }
  async getAll(req, res, next) {
    const query = req.query;

    const options = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      lean: true,
    };

    const myAggregate = query
      ? this.#service.aggregate([
          {
            $sort: {
              price: query.sort ? (query.sort === "asc" ? 1 : -1) : 1,
            },
          },
          {
            $match: {
              $or: [
                {
                  status: query.status ?? "true",
                },
                {
                  category: query.category ?? "all",
                },
              ],
            },
          },
        ])
      : this.#service.aggregate();

    await this.#service
      .find(myAggregate, options)
      .then(function (products) {
        const productsList = PERSISTENCE === "MONGO" ? products.docs : products;

        if (productsList?.length === 0) {
          next(new NotFoundException());
          return;
        } else {
          res.status(200).send({ productsList });
        }
      })
      .catch(function (err) {
        logger.info(err);
      });
  }

  async findById(req, res, next) {
    const productId = req.params.pid;
    try {
      const product = await this.#service.findById(productId);
      res.status(200).send({ product });
    } catch (error) {
      next(new NotFoundException());
    }
  }

  async create(req, res, next) {
    const product = req.body;
    const errors = await ValidatorError.message;
    const role = req.user.user.role;
    const email = req.user.user.email;

    try {
      if (email) {
        product.owner = email;
      }
      const { _id } = await this.#service.create(product);
      res.status(201).send({ id: _id });
    } catch (error) {
      CustomError.createError({
        name: "ValidationError",
        cause: "Prueba",
        message: errors,
        code: ErrorEnum.INVALID_PRODUCT_ERROR,
      });
      next();
    }
  }

  async update(req, res, next) {
    const idProd = req.params.pid;
    const newData = req.body;

    try {
      const newProd = await this.#service.update(idProd, newData);
      res.status(202).send({ newProd });
    } catch (error) {
      next(new NotFoundException());
    }
  }

  async delete(req, res, next) {
    const idProduct = req.params.id;
    const role = req.user.user.role;
    const email = req.user.user.email;

    try {
      const product = await this.#service.findById(idProduct);
      if (!product?.owner) {
        res.send({ error: "not authorized" });
        return;
      }
      if (role === "premium") {
        if (product.owner === email) {
          await this.#service.delete(idProduct);
          res.send({ ok: true });
          return;
        }
      }
      if (role === "admin") {
        await this.#service.delete(idProduct);
        res.send({ ok: true });
      }
      res.send({ error: "not authorized" });
    } catch (error) {
      console.log(error);
      // res.send({ false: "no no no" });
      // next(new NotFoundException());
    }
  }
}

const DaoService = await DaoFactory.getDao();
const productsService = await DaoService.getService("products");

const controller = new ProductsController(new productsService());

export default controller;
