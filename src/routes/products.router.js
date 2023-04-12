import { Router } from "express";
import { BadRequestException } from "../classes/errors/bad-request-exception.js";
import { NotFoundException } from "../classes/errors/not-found-exception.js";
import { uploader } from "../utils/uploader.js";
import { productsManager } from "../dao/managers/products.manager.js";
import { productModel } from "../dao/models/products.models.js";

const route = Router();

route.get("/", async (req, res, next) => {
  const query = req.query;

  const options = {
    page: query.page ?? 1,
    limit: query.limit ?? 10,
    lean: true,
  };

  const myAggregate = query.status
    ? productModel.aggregate([
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
    : productModel.aggregate();

  await productModel
    .aggregatePaginate(myAggregate, options)
    .then(function (products) {
      const productsList = products.docs;

      if (productsList.length === 0) {
        next(new NotFoundException());
        return;
      } else {
        res.status(200).send({ productsList });
      }
    })
    .catch(function (err) {
      throw err;
    });
});

route.get("/:idProduct", async (req, res, next) => {
  const productId = req.params.idProduct;
  try {
    const product = await productsManager.findById(productId);
    res.status(200).send({ product });
  } catch (error) {
    next(new NotFoundException());
  }
});

route.post("/", uploader.single("file"), async (req, res, next) => {
  const product = req.body;

  try {
    const { _id } = await productsManager.create(product);
    res.status(201).send({ id: _id });
  } catch (error) {
    next(new BadRequestException());
  }
});

route.put("/:idProduct", uploader.single("file"), async (req, res, next) => {
  const idProd = req.params.idProduct;
  const newData = req.body;

  try {
    const newProd = await productsManager.update(idProd, newData);
    res.status(202).send({ newProd });
  } catch (error) {
    next(new NotFoundException());
  }
});

route.delete("/:idProduct", async (req, res, next) => {
  const idProduct = req.params.idProduct;
  try {
    await productsManager.delete({ _id: idProduct });
    res.status(200).send({ ok: true });
  } catch (error) {
    next(new NotFoundException());
  }
});

export default route;
