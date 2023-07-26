import multer from "multer";
import * as path from "path";
import fileDirName from "./fileDirName.js";
import usersService from "../dao//services/users.service.js";
import productsService from "../dao//services/products.service.js";

const { __dirname } = fileDirName(import.meta);

const usersController = new usersService();
const productsController = new productsService();

export const pathDir = {
  profiles: "/profiles",
  documents: "/documents",
  products: "/products",
};

const storage = (pathDir) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname + pathDir));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

export const uploader = (pathDir) => multer({ storage: storage(pathDir) });

export const documentsMulter = async (req, res, next) => {
  if (req.files.length < 1) {
    res.userErrorResponse("Document not loaded", { code: "102" });
    return;
  }
  const userId = req?.params.uid;
  const user = await usersController.findById(userId);
  user.documents = {
    name: "Identification",
    reference: req.files.filename,
  };
  const updatedUser = await usersController.update(user._id, user);
  next();
};

export const profilesMulter = async (req, res, next) => {
  if (req.file?.length < 1) {
    res.userErrorResponse("Document not loaded", { code: "102" });
    return;
  }
  // const userId = req.params?.uid;
  // const user = await usersController.findById(userId);
  // user.documents = {
  //   name: "Profile",
  //   reference: req.file?.filename,
  // };
  // const updatedUser = await usersController.update(user._id, user);
  next();
};
export const productsMulter = async (req, res, next) => {
  if (req.files.length < 1) {
    res.userErrorResponse("Document not loaded", { code: "102" });
    return;
  }
  const userId = req?.params.uid;
  const products = await productsController.findById(userId);
  products.thumbnail = req.files.path;
  const updatedUser = await productsController.update(products._id, products);
  next();
};

// export const uploader = multer({ storage });
