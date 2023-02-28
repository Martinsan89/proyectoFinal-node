// const fs = require("fs");
import * as fs from "fs";
import { randomUUID } from "crypto";

export class FileManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const productList = await fs.promises.readFile(this.path);
      return JSON.parse(productList);
    } catch (error) {
      // console.log(error);
      return [];
    }
  }

  async addProducts(product) {
    const id = randomUUID();
    const productsList = await this.getProducts();
    const newProductsList = [...productsList, { id, ...product }];
    const newProductsListToString = JSON.stringify(newProductsList);
    await fs.promises.writeFile(this.path, newProductsListToString);
    return id;
  }

  async getProductById(id) {
    const productsList = await this.getProducts();
    const findProd = productsList.find((p) => p.id === id);
    return findProd;
  }

  async updateProduct(id, data) {
    const product = await this.getProductById(id);
    if (!product) {
      return new Error("Producto no encontrado");
    }
    const productsList = await this.getProducts();
    const productModify = { ...product, ...data };
    const deleteProdFromList = productsList.filter((e) => e.id !== id);
    const newList = [...deleteProdFromList, productModify];
    const newProductsListToString = JSON.stringify(newList);
    await fs.promises.writeFile(this.path, newProductsListToString);
  }

  async deleteProduct(id) {
    const productsList = await this.getProducts();
    const findProd = productsList.find((p) => p.id === id);
    const filterProductsList = productsList.filter((p) => p.id !== id);
    const filterProductsListToString = JSON.stringify(filterProductsList);
    await fs.promises.writeFile(this.path, filterProductsListToString);
    return findProd ? findProd : "id no encontrado";
  }
}

// module.exports = {
//   ProductManager,
// };
