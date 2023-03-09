import { Router } from "express";
import { ProductsManager } from "../db/productsDB.js";
import { socketServer } from "../socket/configure-socket.js";

const ProductManager = new ProductsManager("./data/products.json");
const products = await ProductManager.getProducts();

const route = Router();

route.get("/", async (req, res) => {
  if (!products) {
    res.render("notFound", {
      title: "Products",
    });
    return;
  }
  res.render("home", { products });
});

route.get("/realtimeproducts", (req, res) => {
  res.render(
    "realtimeproducts",
    socketServer.on("connection", async (socket) => {
      console.log("socket conectado");
      socket.emit("products", { products });

      socket.on("toDelete", async (id) => {
        await ProductManager.deleteProduct(id);
        const products = await ProductManager.getProducts();
        socketServer.emit("products", { products });
      });

      await socket.on("toPost", async (product) => {
        await ProductManager.addProducts(product);
        const products = await ProductManager.getProducts();
        socketServer.emit("products", { products });
      });
    })
  );
});

export default route;
