import express from "express";
import { ProductManager } from "./ProductManager.js";

const newManager = new ProductManager("./data/products.json");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const query = req.query;
  const limit = query.limit;
  const allProducts = await newManager.getProducts();
  if (limit) {
    const newArray = allProducts.slice(0, limit);
    res.send({ newArray });
    return;
  } else {
    res.send({ products: allProducts });
  }
});
app.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await newManager.getProductById(+productId);

  res.send({ product });
});

const port = 8080;
app.listen(port, () => console.log(`servidor desde el port numero ${port}`));
