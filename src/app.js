import express from "express";
import session from "express-session";
import cors from "cors";
// Configurations
import config from "../config.js";
import passport from "passport";
import { configurePassport } from "./config/passport.config.js";
import fileDirName from "./utils/fileDirName.js";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
// Chat
import configureSocket from "./socket/configure-socket.js";
// Logger
import logger, { loggerMiddleware } from "./logger/winstom-custom-logger.js";
// Documentation
import swaggerUiExpress from "swagger-ui-express";
import spec from "./docs/swagger-options.js";
// Routes
import routes from "./routes/index.js";
import viewsRoute from "./routes/views.route.js";
// Middlewares
import configureHandlebars from "./lib/hbs.middleware.js";
import customResponseMiddleware from "./middlewares/custom-response.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// Configurations
const { PORT, mongo_url, cookie_secret, PERSISTENCE } = config;
const { __dirname } = fileDirName(import.meta);

const app = express();

// Handlebars
configureHandlebars(app);
// Documentation
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
// Cookies
app.use(cookieParser());
app.use(cors());
// Mongo
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

// Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(loggerMiddleware);
app.use(customResponseMiddleware);
app.use(express.static(__dirname + "/public"));

// Routes
app.use("/", viewsRoute);
app.use("/api", routes);

app.use(errorMiddleware);

const port = PORT || 8080;
const httpServer = app.listen(port, () =>
  logger.info(`servidor conectado desde el port numero ${port}`)
);

// Chat
configureSocket(httpServer);
