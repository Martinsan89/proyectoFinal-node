import express from "express";

export class Router {
  #router;
  #path;

  constructor(path) {
    this.#router = express.Router();
    this.#path = path;
    this.init();
  }

  init() {}

  get path() {
    return this.#path;
  }
  get router() {
    return this.#router;
  }

  get(path, ...callbacks) {
    this.#router.get(path, ...callbacks);
  }
  post(path, ...callbacks) {
    this.#router.post(path, ...callbacks);
  }
  put(path, ...callbacks) {
    this.#router.put(path, ...callbacks);
  }
  delete(path, ...callbacks) {
    this.#router.delete(path, ...callbacks);
  }
}
