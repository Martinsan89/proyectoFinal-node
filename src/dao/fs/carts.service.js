import * as fs from "fs";
import { randomUUID } from "crypto";
import fileDirName from "../../utils/fileDirName.js";

const { __dirname } = fileDirName(import.meta);

class CartsService {
  #path;
  constructor() {
    this.#path = __dirname + "/db/cartsDb.json";
  }

  async find() {
    try {
      const cartsList = await fs.promises.readFile(this.#path);
      return JSON.parse(cartsList);
    } catch (error) {
      return [];
    }
  }

  async create(products) {
    const id = randomUUID();
    const cartsList = await this.find();
    const newProductsList = [...cartsList, { id, products }];
    const newProductsListToString = JSON.stringify(newProductsList);
    await fs.promises.writeFile(this.#path, newProductsListToString);
    return id;
  }

  async findById(id) {
    const cartsList = await this.find();
    const findCart = cartsList.find((p) => p?.id === id);
    return findCart?.products;
  }

  async update(cId, pId) {
    const cartsList = await this.find();
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
    await fs.promises.writeFile(this.#path, newCartListToString);
    return cart;
  }

  async delete(id) {
    const productsList = await this.find();
    const findProd = productsList.find((p) => p.id === id);
    const filterProductsList = productsList.filter((p) => p.id !== id);
    const filterProductsListToString = JSON.stringify(filterProductsList);
    await fs.promises.writeFile(this.#path, filterProductsListToString);
    return findProd ? findProd : "id no encontrado";
  }
}

export default CartsService;
