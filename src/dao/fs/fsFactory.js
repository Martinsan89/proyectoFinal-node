class FsFactory {
  static async getService(service) {
    switch (service) {
      case "products":
        const { default: productService } = await import(
          "./products.service.js"
        );
        return productService;
      case "carts":
        const { default: cartsService } = await import("./carts.service.js");
        return cartsService;
      case "users":
        const { default: usersService } = await import("./users.service.js");
        return usersService;
      case "tickets":
        const { default: ticketsService } = await import(
          "./tickets.service.js"
        );
        return ticketsService;
      default:
        throw new Error("Wrong service");
    }
  }
}

export default FsFactory;
