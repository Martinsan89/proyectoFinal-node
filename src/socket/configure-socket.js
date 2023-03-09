import { Server } from "socket.io";
import { ProductsManager } from "../db/productsDB.js";
export let socketServer;

export default function configureSocket(httpServer) {
  socketServer = new Server(httpServer);
  // const ProductManager = new ProductsManager("./data/products.json");
}
