import * as fs from "fs";
import { randomUUID } from "crypto";
import fileDirName from "../../utils/fileDirName.js";

const { __dirname } = fileDirName(import.meta);

class UsersService {
  #path;
  constructor() {
    this.#path = __dirname + "/db/usersDb.json";
  }

  async find() {
    try {
      const productList = await fs.promises.readFile(this.#path);

      return JSON.parse(productList);
    } catch (error) {
      return [];
    }
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

  async findById(_id) {
    const productsList = await this.find();
    const findProd = productsList.find((p) => p._id === _id);
    return findProd;
  }

  async findOne(email) {
    const productsList = await this.find();
    if (productsList) {
      const findProd = productsList.find((p) => p.email === email);
      return findProd;
    } else {
      return [];
    }
  }

  async update(_id, data) {
    const product = await this.findById(_id);
    if (!product) {
      return new Error("Producto no encontrado");
    }
    const productsList = await this.find();
    const productModify = { ...product, ...data };
    const deleteProdFromList = productsList.filter((e) => e._id !== _id);
    const newList = [...deleteProdFromList, productModify];
    const newProductsListToString = JSON.stringify(newList);
    await fs.promises.writeFile(this.#path, newProductsListToString);
  }

  async delete(_id) {
    const productsList = await this.find();
    const findProd = productsList.find((p) => p._id === _id);
    const filterProductsList = productsList.filter((p) => p._id !== _id);
    const filterProductsListToString = JSON.stringify(filterProductsList);
    await fs.promises.writeFile(this.#path, filterProductsListToString);
    return findProd ? findProd : "id no encontrado";
  }
}

export default UsersService;
