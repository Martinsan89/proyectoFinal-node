import * as fs from "fs";
import { randomUUID } from "crypto";
import fileDirName from "../../utils/fileDirName.js";

const { __dirname } = fileDirName(import.meta);

class ProductsService {
  #path;
  constructor() {
    this.#path = __dirname + "/db/productsDb.json";
  }

  async create(product) {
    const _id = randomUUID();
    const productsList = await this.find();

    if (productsList?.length > 0) {
      const newProductsList = [...productsList, { _id, ...product }];
      const newProductsListToString = JSON.stringify(newProductsList);
      await fs.promises.writeFile(this.#path, newProductsListToString);
    } else {
      const newProductsList = [{ _id, ...product }];
      const newProductsListToString = JSON.stringify(newProductsList);
      await fs.promises.writeFile(this.#path, newProductsListToString);
    }

    return { _id: _id };
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

  async findById(_id) {
    const productsList = await this.find();
    const findProd = productsList.find((p) => p._id === _id);
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

  async delete(_id) {
    const productsList = await this.find();
    const findProd = productsList.find((p) => p._id === _id._id);
    const filterProductsList = productsList.filter((p) => p._id !== _id._id);
    const filterProductsListToString = JSON.stringify(filterProductsList);
    await fs.promises.writeFile(this.#path, filterProductsListToString);
    return findProd ? findProd : "id no encontrado";
  }
}

export default ProductsService;
