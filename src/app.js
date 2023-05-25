import express from "express";
import routes from "./routes/index.js";
import viewsRoute from "./routes/views.route.js";
import configureHandlebars from "./lib/hbs.middleware.js";
import configureSocket from "./socket/configure-socket.js";
import fileDirName from "./utils/fileDirName.js";
import { ValidationError } from "./classes/errors/validation-error.js";
import config from "../config.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { configurePassport } from "./config/passport.config.js";
import passport from "passport";
import cors from "cors";
import cookieSession from "cookie-session";

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
        name: "Session FileSystem",
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
app.use(express.static(__dirname + "/public"));

app.use("/", viewsRoute);
app.use("/api", routes);

app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }
  console.log(error);
  res.status(500).json({ error });
});

const port = PORT;
const httpServer = app.listen(port, () =>
  console.log(`servidor conectado desde el port numero ${port}`)
);

configureSocket(httpServer);
