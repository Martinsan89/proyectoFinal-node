// const fs = require("fs");
import * as fs from "fs";
import { randomUUID } from "crypto";

export class CartsManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const cartsList = await fs.promises.readFile(this.path);
      return JSON.parse(cartsList);
    } catch (error) {
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
    const findCart = cartsList.find((p) => p?.id === id);
    return findCart?.products;
  }

  async addToCart(cId, pId) {
    const cartsList = await this.getCarts();
    const cart = cartsList.find((p) => p?.id === cId);
    const product = cart?.products.find((p) => p.pId === pId);

    if (!cart) {
      return "Carrito no encontrado";
    }

    if (cart?.products.length === 0) {
      cart.products.push({ pId, quantity: 1 });
    } else {
      if (product?.pId === pId) {
        product.quantity++;
      } else {
        cart?.products.push({ pId, quantity: 1 });
      }
    }
    const newCartsList = [...cartsList];
    const newCartListToString = JSON.stringify(newCartsList);
    await fs.promises.writeFile(this.path, newCartListToString);
    return cart;
  }
}
