import mongoose from "mongoose";

const cartCollections = "carts";

const cartSchema = mongoose.Schema({
  products: { type: Array, default: [] },
});

export const cartModel = mongoose.model(cartCollections, cartSchema);
