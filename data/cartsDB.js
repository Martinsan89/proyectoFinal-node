// const fs = require("fs");
import * as fs from "fs";
import { randomUUID } from "crypto";

export class FileManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const cartsList = await fs.promises.readFile(this.path);
      return JSON.parse(cartsList);
    } catch (error) {
      // console.log(error);
      return [];
    }
  }

  async create(products) {
    const id = randomUUID();
    const cartsList = await this.getCarts();
    const newProductsList = [...cartsList, { id, products }];
    const newProductsListToString = JSON.stringify(newProductsList);
    await fs.promises.writeFile(this.path, newProductsListToString);
    return id;
  }

  async getById(id) {
    const cartsList = await this.getCarts();
    const findCart = cartsList.find((p) => p.id === id);
    return findCart.products;
  }

  async addToCart(cId, pId) {
    const cartsList = await this.getCarts();
    const cart = cartsList.find((p) => p.id === cId);

    if (cart.products.length === 0) {
      cart.products.push({ pId, quantity: 1 });
    } else {
      const product = cart.products.find((p) => p.pId === pId);

      if (!product) {
        cart.products.push({ pId, quantity: 1 });
      }
      if (product?.pId === pId) {
        product.quantity++;
      }
    }
    const deleteCartArray = cartsList.filter((c) => c.id !== cId);
    const newCartsList = [...deleteCartArray, cart];
    const newCartListToString = JSON.stringify(newCartsList);
    await fs.promises.writeFile(this.path, newCartListToString);
    return cart;
  }
}
