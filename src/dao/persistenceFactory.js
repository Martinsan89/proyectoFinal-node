import config from "../../config.js";
import mongoose from "mongoose";

class DaoFactory {
  static async getDao() {
    switch (config.PERSISTENCE) {
      case "MONGO":
        mongoose.connect(config.mongo_url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        const { default: MongoFactory } = await import(
          "./services/mongoFactory.js"
        );

        return MongoFactory;
      case "FS":
        const { default: FsFactory } = await import("./fs/fsFactory.js");
        return FsFactory;
      default:
        throw new Error("Wrong persistence config");
    }
  }
}

export default DaoFactory;
