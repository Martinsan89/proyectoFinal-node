import * as fs from "fs";
import { randomUUID } from "crypto";
import fileDirName from "../../utils/fileDirName.js";

const { __dirname } = fileDirName(import.meta);

class TicketsService {
  #path;
  constructor() {
    this.#path = __dirname + "/db/ticketsDb.json";
  }

  async create(data) {
    const id = randomUUID();
    const productsList = await this.get();
    const newProductsList = [...productsList, { id, ...product }];
    const newProductsListToString = JSON.stringify(newProductsList);
    await fs.promises.writeFile(this.#path, newProductsListToString);
    return id;
  }

  async find(myAggregate, options) {
    try {
      const productList = await fs.promises.readFile(this.#path);
      return JSON.parse(productList);
    } catch (error) {
      return error;
    }
  }

  async aggregate(aggregateSearch) {
    return [];
  }

  async findById(id) {
    const productsList = await this.find();
    const findProd = productsList.find((p) => p.id === id);
    return findProd;
  }

  async update(id, data) {
    const product = await this.findById(id);
    if (!product) {
      return new Error("Producto no encontrado");
    }
    const productsList = await this.find();
    const productModify = { ...product, ...data };
    const deleteProdFromList = productsList.filter((e) => e.id !== id);
    const newList = [...deleteProdFromList, productModify];
    const newProductsListToString = JSON.stringify(newList);
    await fs.promises.writeFile(this.#path, newProductsListToString);
  }

  async delete(id) {
    const productsList = await this.getProducts();
    const findProd = productsList.find((p) => p.id === id);
    const filterProductsList = productsList.filter((p) => p.id !== id);
    const filterProductsListToString = JSON.stringify(filterProductsList);
    await fs.promises.writeFile(this.#path, filterProductsListToString);
    return findProd ? findProd : "id no encontrado";
  }
}

export default TicketsService;
