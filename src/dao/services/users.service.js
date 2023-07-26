import { userModel } from "../models/user.model.js";

class UsersService {
  #model;
  constructor() {
    this.#model = userModel;
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

  async findOne(email) {
    return this.#model.findOne({ email: email });
  }

  async update(id, data) {
    return this.#model.updateOne({ _id: id }, { $set: data });
  }

  async delete(id) {
    return this.#model.findByIdAndDelete(id);
  }
}

export default UsersService;
