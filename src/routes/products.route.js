import { Router } from "express";
import { ProductsManager } from "../db/productsDB.js";
import { validateProduct } from "../helpers/validation.js";
import { uploader } from "../utils/uploader.js";

const ProductManager = new ProductsManager("./data/products.json");
const route = Router();

route.get("/", async (req, res) => {
  const query = req.query;
  const limit = query.limit;
  const allProducts = await ProductManager.getProducts();
  if (limit) {
    const newArray = allProducts.slice(0, limit);
    res.send({ products: newArray });
    return;
  } else {
    res.send({ products: allProducts });
  }
});
route.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await ProductManager.getProductById(productId);
  if (!product) {
    res.status(404).send({ error: "producto no encontrado" });
  }
  res.status(200).send({ ...product });
});

route.post("/", uploader.single("file"), async (req, res) => {
  const product = req.body;
  product.thumbnail = [req.file?.path];
  const isValid = validateProduct(product);
  if (!isValid) {
    res.status(400).send({ error: "Datos inválidos" });
    return;
  }
  const id = await ProductManager.addProducts(product);
  res.status(201).send({ id });
});

route.put("/:idProduct", uploader.single("file"), async (req, res) => {
  const idProd = req.params.idProduct;
  const product = await ProductManager.getProductById(idProd);
  if (!product) {
    res.status(400).send({ error: "producto no encontrado" });
    return;
  }
  const newData = req.body;
  newData.thumbnail = [req.file?.path];

  const isValid = validateProduct(newData);
  if (!isValid) {
    res.status(400).send({ error: "Datos inválidos" });
    return;
  }
  await ProductManager.updateProduct(idProd, newData);
  res.status(202).send({ ok: true });
});

route.delete("/:idProduct", async (req, res) => {
  const idProduct = req.params.idProduct;
  const product = await ProductManager.getProductById(idProduct);
  if (!product) {
    res.status(404).send({ error: "producto no encontrado" });
    return;
  }
  await ProductManager.deleteProduct(idProduct);
  res.status(200).send({ ok: true });
});

export default route;
