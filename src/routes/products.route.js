import { Router } from "express";
import { FileManager } from "../../data/productsDB.js";
import { validateProduct } from "../../data/validation.js";
const ProductManager = new FileManager("./data/products.json");
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

  res.send({ ...product });
});

route.post("/", async (req, res) => {
  const product = req.body;
  const isValid = validateProduct(product);
  console.log(isValid);
  if (!isValid) {
    res.status(404).send({ error: "Datos inválidos" });
    return;
  }
  const id = await ProductManager.addProducts(...product);
  res.status(201).send({ id });
});

route.put("/:idProduct", async (req, res) => {
  const idProd = req.params.idProduct;
  const product = await ProductManager.getProductById(idProd);
  if (!product) {
    res.status(404).send({ error: "producto no encontrado" });
    return;
  }
  const newData = req.body;
  const isValid = validateProduct(newData);
  if (!isValid) {
    res.status(404).send({ error: "Datos inválidos" });
    return;
  }
  await ProductManager.updateProduct(idProd, ...newData);
  res.status(200).send({ ok: true });
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
