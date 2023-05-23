import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { cartCollections } from "./carts.models.js";

export const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: Number, required: true },
  age: { type: Number, required: true },
  password: { type: String },
  cart: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: cartCollections,
        default: null,
      },
    ],
  },
  role: { type: String, default: "user" },
});
userSchema.plugin(mongoosePaginate);

userSchema.pre("findOne", function () {
  this.populate("cart.id");
});

export const userModel = mongoose.model(userCollection, userSchema);
