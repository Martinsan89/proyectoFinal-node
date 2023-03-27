import { MongoManager } from "./mongo.manager.js";
import { productModel } from "../models/products.models.js";

class ProductsManager extends MongoManager {}

export const productsManager = new ProductsManager(productModel);
