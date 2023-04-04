import mongoose from "mongoose";
import { productCollection } from "./products.models.js";

const cartCollections = "carts";

const cartSchema = mongoose.Schema({
  products: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: productCollection,
        },
        quantity: {
          type: Number,
          require: true,
        },
      },
    ],
    default: [],
  },
});

cartSchema.pre("findOne", function () {
  this.populate("products.productId");
});

export const cartModel = mongoose.model(cartCollections, cartSchema);
