import { userModel } from "../dao/models/user.model.js";

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

  async update(id, data) {
    await this.#model.updateOne({ _id: id }, data);
    const updateData = await this.findById(id);
    return updateData;
  }

  async delete(id) {
    return this.#model.findByIdAndDelete(id);
  }
}

export default UsersService;
