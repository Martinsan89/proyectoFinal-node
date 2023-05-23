import { userModel } from "../models/user.model.js";

class UsersService {
  #model;
  constructor() {
    this.#model = userModel;
  }

  async create(data) {
    return this.#model.create(data);
  }

  async find(query, { skip, limit }) {
    return this.#model.paginate(query, { skip, limit });
  }

  async findById(id) {
    return this.#model.findById(id);
  }

  async findOne(email) {
    return this.#model.findOne({ email: email });
  }

  async update(id, data) {
    await this.#model.updateOne({ _id: id }, { $set: data });
    const updateData = await this.#model.findOne(id);
    return updateData;
  }

  async delete(id) {
    return this.#model.findByIdAndDelete(id);
  }
}

export default UsersService;
