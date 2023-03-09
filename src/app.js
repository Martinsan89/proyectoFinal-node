import express from "express";
import productsRoute from "./routes/products.route.js";
import cartsRoute from "./routes/carts.route.js";
import viewsRoute from "./routes/views.route.js";
import configureHandlebars from "./lib/hbs.middleware.js";
import configureSocket from "./socket/configure-socket.js";
import fileDirName from "./utils/fileDirName.js";

const { __dirname } = fileDirName(import.meta);

const app = express();

configureHandlebars(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use("/", viewsRoute);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);

const port = 8080;
const httpServer = app.listen(port, () =>
  console.log(`servidor conectado desde el port numero ${port}`)
);

configureSocket(httpServer);
