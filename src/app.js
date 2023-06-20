import express from "express";
import routes from "./routes/index.js";
import viewsRoute from "./routes/views.route.js";
import configureHandlebars from "./lib/hbs.middleware.js";
import configureSocket from "./socket/configure-socket.js";
import fileDirName from "./utils/fileDirName.js";
import config from "../config.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { configurePassport } from "./config/passport.config.js";
import passport from "passport";
import cors from "cors";
import { generateUser } from "../mock.js";
import customResponseMiddleware from "./middlewares/custom-response.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import logger, { loggerMiddleware } from "./logger/winstom-custom-logger.js";

const { PORT, mongo_url, cookie_secret, PERSISTENCE } = config;

const { __dirname } = fileDirName(import.meta);

const app = express();

configureHandlebars(app);

app.use(cookieParser());
app.use(cors());

PERSISTENCE === "MONGO"
  ? app.use(
      session({
        store: MongoStore.create({
          mongoUrl: mongo_url,
          mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
          ttl: 15,
        }),
        secret: cookie_secret,
        resave: true,
        saveUninitialized: true,
      })
    )
  : app.use(
      session({
        secret: cookie_secret,
        resave: true,
        saveUninitialized: true,
      })
    );
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(customResponseMiddleware);
app.use(express.static(__dirname + "/public"));

app.use("/", viewsRoute);
app.use("/api", routes);
app.use("/mockingproducts", (req, res) => {
  const products = Array.from({ length: 100 }, () => generateUser());
  res.send({ status: "ok", payload: products });
});
// app.use("/loggerTest", (req, res) => {
//   // req.logger.fatal({ message: "Log test fatal", code: 500 });
//   // req.logger.error("Log Error", { message: "Log test error" });
//   // req.logger.warning("Log test warning");
//   // req.logger.http("Log test http");
//   // req.logger.debug("Log test debug");
//   res.send({ ok: true });
// });

app.use(errorMiddleware);

const port = PORT;
const httpServer = app.listen(port, () =>
  logger.info(`servidor conectado desde el port numero ${port}`)
);

configureSocket(httpServer);
