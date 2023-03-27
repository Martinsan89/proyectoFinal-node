import express from "express";
import productsRoute from "./routes/products.route.js";
import cartsRoute from "./routes/carts.route.js";
import viewsRoute from "./routes/views.route.js";
import configureHandlebars from "./lib/hbs.middleware.js";
import configureSocket from "./socket/configure-socket.js";
import fileDirName from "./utils/fileDirName.js";
import { ValidationError } from "./classes/errors/validation-error.js";
import mongoose from "mongoose";
import config from "./data.js";

const { PORT, MONGO_URL } = config;

const { __dirname } = fileDirName(import.meta);

const app = express();

configureHandlebars(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use("/", viewsRoute);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);

app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }
  res.status(500).json({ error });
});

const port = PORT;
const httpServer = app.listen(port, () =>
  console.log(`servidor conectado desde el port numero ${port}`)
);

configureSocket(httpServer);

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
