import { cartModel } from "../dao/models/carts.models.js";

class ProductsService {
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
    return this.#model.findById(id);
  }

  async update(id, data) {
    await this.#model.updateOne({ _id: id }, data);
    const updateData = await this.#model.findById(id);
    return updateData;
  }

  async delete(id) {
    return this.#model.findByIdAndDelete(id);
  }
}

export default ProductsService;
