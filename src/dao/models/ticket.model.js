import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";

export const ticketCollection = "ticket";

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: String, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

ticketSchema.plugin(mongoosePaginate);
ticketSchema.plugin(aggregatePaginate);

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
