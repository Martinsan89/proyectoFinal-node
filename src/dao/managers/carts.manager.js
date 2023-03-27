import { MongoManager } from "./mongo.manager.js";
import { cartModel } from "../models/carts.models.js";

class CartsManager extends MongoManager {}

export const cartsManager = new CartsManager(cartModel);
