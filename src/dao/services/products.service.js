import { productModel } from "../models/products.models.js";

class ProductsService {
  #model;
  constructor() {
    this.#model = productModel;
  }

  async create(data) {
    return this.#model.create(data);
  }

  async find(myAggregate, options) {
    return this.#model.aggregatePaginate(myAggregate, options);
  }

  async aggregate(aggregateSearch) {
    return this.#model.aggregate(aggregateSearch);
  }

  async findById(id) {
    return this.#model.findById(id);
  }

  async update(id, data) {
    await this.#model.updateOne({ _id: id }, { $set: data });
    const updateData = await this.findById(id);
    return updateData;
  }

  async delete(id) {
    return this.#model.findByIdAndDelete({ _id: id });
  }
}

export default ProductsService;
