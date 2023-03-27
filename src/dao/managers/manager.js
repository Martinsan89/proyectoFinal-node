export class Manager {
  #persistencia;

  constructor(persistencia) {
    this.#persistencia = persistencia;
  }

  async get() {
    return this.#persistencia.get();
  }

  async add(product) {
    return this.#persistencia.add(product);
  }

  async getById(id) {
    return this.#persistencia.getById(id);
  }

  async update(id, data) {
    return this.#persistencia.update(id, data);
  }

  async delete(id) {
    return this.#persistencia.delete(id);
  }
}
