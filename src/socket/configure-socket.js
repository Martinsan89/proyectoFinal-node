import { Server } from "socket.io";

import { productsManager } from "../dao/managers/products.manager.js";
import { messagesManager } from "../dao/managers/messages.manager.js";
import logger from "../logger/winstom-custom-logger.js";

class SocketManager {
  #io;
  #sockets = [];
  constructor(httpServer) {
    this.#io = new Server(httpServer);
    this.#configure();
  }

  #configure() {
    this.#io.on("connection", (socket) => this.#confiogureSocket(socket));
    logger.info("socket conectado");
  }

  #confiogureSocket(socket) {
    let credencial = `socket-${socket.id}`;
    this.#sockets.push({ socket, credencial });
    socket.on("toDelete", async (id) => {
      await productsManager.delete(id);

      const products = await productsManager.getAll();
      this.#io.emit("products", products);
    });
    socket.on("toPost", async (product) => {
      await productsManager.create(product);
      const products = await productsManager.getAll();
      this.#io.emit("products", products);
    });
    socket.on("new_msg", async (message) => {
      const { _id } = await messagesManager.create(message);
      if (_id) {
        const chatMsgs = await messagesManager.getAll();
        this.#io.emit("confirmMsg", chatMsgs);
      }
    });
  }

  getSocketServer() {
    return this.#io;
  }
  getSocket(credencial) {
    return this.#sockets.find((c) => c.credencial === credencial);
  }
}

export let socketManager = undefined;

export default function configureSocket(httpServer) {
  if (socketManager === undefined) {
    socketManager = new SocketManager(httpServer);
  }

  return socketManager;
}
