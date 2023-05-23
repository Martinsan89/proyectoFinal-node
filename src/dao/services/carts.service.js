import { cartModel } from "../models/carts.models.js";

class CartsService {
  #model;
  constructor() {
    this.#model = cartModel;
  }

  async create(data) {
    return this.#model.create(data);
  }

  async find() {
    return this.#model.find();
  }

  async findById(id) {
    return this.#model.findOne({ _id: id }).lean();
  }

  async update(id, data) {
    await this.#model.updateOne({ _id: id }, { $set: data });
    const updateData = await this.#model.findOne({ _id: id });
    return updateData;
  }

  async delete(id) {
    return this.#model.findByIdAndDelete(id);
  }
}

export default CartsService;
