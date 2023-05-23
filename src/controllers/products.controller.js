import { BadRequestException } from "../classes/errors/bad-request-exception.js";
import { NotFoundException } from "../classes/errors/not-found-exception.js";
import DaoFactory from "../dao/persistenceFactory.js";
import config from "../../config.js";

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
        console.log(err);
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

    try {
      const { _id } = await this.#service.create(product);
      console.log(_id);
      res.status(201).send({ id: _id });
    } catch (error) {
      console.log(error);
      next(new BadRequestException());
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
    const idProduct = req.params.pid;
    try {
      await this.#service.delete({ _id: idProduct });
    } catch (error) {
      next(new NotFoundException());
    }
    res.status(200).send({ ok: true });
  }
}

const DaoService = await DaoFactory.getDao();
const productsService = await DaoService.getService("products");

const controller = new ProductsController(new productsService());

export default controller;
