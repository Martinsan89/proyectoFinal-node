import { ticketModel } from "../models/ticket.model.js";

class TicketsService {
  #model;
  constructor() {
    this.#model = ticketModel;
  }

  async create(data) {
    return this.#model.create(data);
  }

  async find(myAggregate, options) {
    return this.#model.find();
  }

  async aggregate(aggregateSearch) {
    return this.#model.aggregate(aggregateSearch);
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

export default TicketsService;
