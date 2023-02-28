import express from "express";
import productsRoute from "./routes/products.route.js";
import cartsRoute from "./routes/carts.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);

const port = 8080;
app.listen(port, () => console.log(`servidor desde el port numero ${port}`));
