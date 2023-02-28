// const fs = require("fs");
import * as fs from "fs";
import { randomUUID } from "crypto";

export class ProductManager {
  // static incrementId() {
  //   if (!this.id) {
  //     this.id = 1;
  //   } else {
  //     this.id++;
  //   }
  //   return this.id;
  // }
  constructor(path) {
    this.path = path;
    this.id = randomUUID();
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
    const keys = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
    ];

    const productsList = await this.getProducts();

    const productKeys = JSON.stringify(Object.keys(product));

    if (productKeys === JSON.stringify(keys)) {
      const findProd = productsList.find((p) => p.code === product.code);

      if (findProd) {
        return console.log("Producto no agregado... mismo code", product);
      } else {
        const newProductsList = [...productsList, { id: this.id, product }];
        const newProductsListToString = JSON.stringify(newProductsList);
        return await fs.promises.writeFile(this.path, newProductsListToString);
      }
    } else {
      console.log("Producto no agregado... faltan campos", product);
    }
  }

  async getProductById(id) {
    const productsList = await this.getProducts();
    const findProd = productsList.find((p) => p.id === id);
    return findProd ? findProd : "no encontrado";
  }

  // async updateProduct(id, keyProduct, value) {
  //   const productsList = await this.getProducts();
  //   const findProd = productsList.find((p) => p.id === id);
  //   if (findProd) {
  //     findProd.product[keyProduct] = value;
  //     const newProductsList = [...productsList];
  //     const newProductsListToString = JSON.stringify(newProductsList);
  //     await fs.promises.writeFile(this.path, newProductsListToString);
  //   }

  //   return findProd ? findProd : "id no encontrado";
  // }

  // async deleteProduct(id) {
  //   const productsList = await this.getProducts();
  //   const findProd = productsList.find((p) => p.id === id);
  //   const filterProductsList = productsList.filter((p) => p.id !== id);
  //   const filterProductsListToString = JSON.stringify(filterProductsList);
  //   await fs.promises.writeFile(this.path, filterProductsListToString);
  //   return findProd ? findProd : "id no encontrado";
  // }
}

// module.exports = {
//   ProductManager,
// };
