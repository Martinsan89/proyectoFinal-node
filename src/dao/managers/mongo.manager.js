export class MongoManager {
  constructor(model) {
    this.model = model;
  }

  async getAll(query, skip, limit) {
    try {
      const entidades = await this.model
        .find(query)
        .skip(Number(skip ?? 0))
        .limit(Number(limit ?? 10));
      return entidades.map((e) => e.toObject());
    } catch (e) {
      throw e;
    }
  }

  async findById(id) {
    try {
      const product = await this.model.findOne({ _id: id });
      return product;
    } catch (error) {
      throw error;
    }
  }

  async create(entity) {
    try {
      const newEntity = await this.model.create(entity);
      return newEntity;
    } catch (e) {
      throw e;
    }
  }

  async update(id, entity) {
    try {
      const newEntity = await this.model.updateOne(id, entity, {
        returnOriginal: false,
      });
      return newEntity;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.model.deleteOne(id);
      return;
    } catch (error) {
      throw error;
    }
  }
}
