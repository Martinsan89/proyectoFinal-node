import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { productCollection } from "./products.models.js";

export const cartCollections = "carts";

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
cartSchema.plugin(mongoosePaginate);

cartSchema.pre("findOne", function () {
  this.populate("products.productId");
});

export const cartModel = mongoose.model(cartCollections, cartSchema);
