import * as fs from "fs";
import { randomUUID } from "crypto";
import fileDirName from "../../utils/fileDirName.js";

const { __dirname } = fileDirName(import.meta);

class CartsService {
  #path;
  #productsPath;
  constructor() {
    this.#path = __dirname + "/db/cartsDb.json";
    this.#productsPath = __dirname + "/db/productsDb.json";
  }

  async find() {
    try {
      const cartsList = await fs.promises.readFile(this.#path);
      return JSON.parse(cartsList);
    } catch (error) {
      return [];
    }
  }

  async create() {
    const _id = randomUUID();
    const products = [];
    const cartsList = await this.find();
    const newProductsList = [...cartsList, { _id, products }];
    const newProductsListToString = JSON.stringify(newProductsList);
    await fs.promises.writeFile(this.#path, newProductsListToString);
    return { _id: _id };
  }

  async findById(_id) {
    const cartsList = await this.find();
    const findCart = cartsList.find((p) => p?._id === _id);
    // console.log("findCart", findCart);

    if (findCart?.products.length >= 1) {
      const products = await fs.promises.readFile(this.#productsPath);
      const prodList = JSON.parse(products);
      const prodCart = findCart.products.map((e) => {
        const prod = prodList.find((p) => p._id === e.product);
        return prod;
      });

      // console.log("cart service,js", prodCart);
      return { _id: findCart._id, products: [{ product: { ...prodCart } }] };
    }
    return findCart;
  }

  async update(cId, pId) {
    const cartsList = await this.find();
    const cart = cartsList.find((p) => p?._id === cId);
    const product = cart?.products.find((p) => p._id === pId.products.product);
    if (!cart) {
      return "Carrito no encontrado";
    }

    if (cart?.products.length === 0) {
      cart.products.push(...pId.products);
    } else {
      if (product?._id === pId.products.product) {
        product.quantity = +product.quantity + +pId.products.at(-1).quantity;
      } else {
        cart?.products.push(...pId.products);
      }
    }
    const newCartsList = [...cartsList];
    const newCartListToString = JSON.stringify(newCartsList);
    // console.log("cartsservice.js", pId.products);
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
