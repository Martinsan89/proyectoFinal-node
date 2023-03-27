import { Router } from "express";
import { BadRequestException } from "../classes/errors/bad-request-exception.js";
import { NotFoundException } from "../classes/errors/not-found-exception.js";
import { uploader } from "../utils/uploader.js";
import { productsManager } from "../dao/managers/products.manager.js";

const route = Router();

route.get("/", async (req, res, next) => {
  const { skip, limit, ...query } = req.query;

  try {
    const products = await productsManager.getAll(skip, limit, query);
    res.status(200).send({ products });
  } catch (error) {
    next(new BadRequestException());
  }
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

// route.patch("/:idProduct", async (req, res, next) => {
//   const idProd = req.params.idProduct;
//   const newData = req.body;

//   try {
//     const newProd = await productsManager.replace({ _id: idProd, newData });
//     res.status(202).send({ newProd });
//   } catch (error) {
//     next(new NotFoundException());
//   }
// });

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
