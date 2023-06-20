import winston from "winston";
import config from "../../config.js";

const { NODE_ENV } = config;

const cumstomLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
};

const logger = winston.createLogger({
  levels: cumstomLevelOptions.levels,
  timestamp: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "./logsFiles/errors.log",
      level: "error",
    }),
  ],
});

if (NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
if (NODE_ENV === "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "info",
    })
  );
}

export const loggerMiddleware = (req, res, next) => {
  req.logger = logger;
  // req.logger.info(`${req.method} in ${req.url}`);
  next();
};

export default logger;
