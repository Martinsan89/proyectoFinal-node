import DaoFactory from "../dao/persistenceFactory.js";
import config from "../../config.js";
import TicketsService from "../dao/services/tickets.service.js";

const { PERSISTENCE, FETCH_URL } = config;

class ViewsController {
  #userService;
  #cartService;
  #productService;
  #ticketService;

  constructor(userService, cartService, productService) {
    this.#userService = userService;
    this.#cartService = cartService;
    this.#productService = productService;
    this.#ticketService = new TicketsService();
  }

  async getCart(id) {
    const cart = await this.#cartService.findById(id).lean();
    return cart;
  }

  async getProducts(query, redirection, res, user) {
    const options = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      lean: true,
    };

    const myAggregate = query
      ? this.#productService.aggregate([
          {
            $sort: {
              price: query.sort ? (query.sort === "asc" ? 1 : -1) : 1,
            },
          },
          {
            $match: {
              $or: [
                {
                  status: query.status ?? "true",
                },
                {
                  category: query.category ?? "all",
                },
              ],
            },
          },
        ])
      : this.#productService.aggregate();

    await this.#productService
      .find(myAggregate, options)
      .then(function (products) {
        const productsList = PERSISTENCE === "MONGO" ? products.docs : products;
        if (productsList?.length === 0) {
          res.render("notFound", { title: "Producto no encontrado" });
          return;
        } else {
          return res.render(redirection, {
            products: productsList,
            nombre: user?.first_name,
            apellido: user?.last_name,
            rol: user?.role,
            cartId: user?.cart._id,
            pages: products.totalPages,
            page: products.page,
            prev: products.prevPage,
            next: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: query.sort
              ? `${FETCH_URL}?page=${products.prevPage}&sort=${
                  query.sort
                }&status=${query.status ?? "true"}`
              : `${FETCH_URL}?page=${products.prevPage}&limit=${
                  query.limit ?? "10"
                }`,
            nextLink: query.sort
              ? `${FETCH_URL}?page=${products.nextPage}&sort=${
                  query.sort
                }&status=${query.status ?? "true"}`
              : `${FETCH_URL}?page=${products.nextPage}&limit=${
                  query.limit ?? "10"
                }`,
          });
        }
      })
      .catch(function (err) {
        throw err;
      });
  }

  async home(req, res) {
    const query = req.query;
    const id = req.user?.user?.id;
    if (!id) {
      return res.redirect(`${FETCH_URL}login`);
    }
    const user = await this.#userService.findById(id);
    const redirection = "home";
    await this.getProducts(query, redirection, res, user, FETCH_URL);
  }

  async realtimeProducts(req, res) {
    const products = await this.#productService.getAll();
    res.render("realtimeproducts", { products });
  }

  async chat(req, res) {
    res.render("chat");
  }

  async products(req, res) {
    const query = req.query;
    const user = req.user;
    const redirection = "products";

    await this.getProducts(query, redirection, res, user);
  }

  async productDetail(req, res) {
    const pId = req.params.pId;
    const cart = req.user.user.cart;

    const {
      _id,
      title,
      description,
      price,
      stock,
      category,
      thumbnail,
      owner,
    } = await this.#productService.findById(pId);

    if (!_id) {
      res.render("notFound", { title: "Producto no encontrado" });
    } else {
      res.render("productDetail", {
        _id,
        title,
        description,
        price,
        stock,
        category,
        thumbnail,
        owner,
        cart,
      });
    }
  }

  async carts(req, res) {
    const cId = req.params.cId;

    try {
      const cart = await this.#cartService.findById(cId);

      if (!cart) {
        res.render("notFound", { title: "Carrito no encontrado" });
      } else {
        const products = cart.products.map((e) => ({
          product: e.product,
          quantity: e.quantity,
        }));

        res.render("carts", { products, cId });
        return;
      }
    } catch (error) {
      res.render("notFound", { title: "Carrito no encontrado" });
    }
  }

  async register(req, res) {
    const email = req.session.user;
    if (email) {
      return res.redirect("/products");
    }
    res.render("register");
  }

  async login(req, res) {
    res.render("login");
  }

  async perfil(req, res) {
    const id = req.user.user.id;
    const user = await this.#userService.findById(id);

    res.render("perfil", {
      nombre: user.first_name,
      apellido: user.last_name,
      rol: user.role,
    });
  }

  async forgotPassword(req, res) {
    const user = req.user;
    if (!user) {
      res.redirect("/login");
      return;
    }
    res.render("forgotPassword");
  }

  async failureLogin(req, res) {
    res.render("failureLogin");
  }

  async notFound(req, res) {
    res.render("notFound");
  }

  async getUsers(query, res) {
    const options = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      lean: true,
    };

    const myAggregate = query
      ? this.#userService.aggregate([
          {
            $sort: {
              role: query.sort ? (query.sort === "asc" ? 1 : -1) : 1,
            },
          },
        ])
      : this.#userService.aggregate();

    await this.#userService
      .find(myAggregate, options)
      .then(function (users) {
        const usersList = users.docs;
        if (usersList?.length === 0) {
          res.render("notFound", { title: "Usuarios no encontrado" });
          return;
        } else {
          return res.render("editUsers", {
            users: usersList,
          });
        }
      })
      .catch(function (err) {
        throw err;
      });
  }

  async editUsers(req, res) {
    const query = req.query;

    await this.getUsers(query, res);
  }

  async ticket(req, res) {
    const idT = req.params.idT;
    const { _id, amount, code } = await this.#ticketService.findById(idT);
    res.render("ticket", { _id, amount, code });
  }
}

const DaoService = await DaoFactory.getDao();
const productsService = await DaoService.getService("products");
const usersService = await DaoService.getService("users");
const cartsService = await DaoService.getService("carts");

const controller = new ViewsController(
  new usersService(),
  new cartsService(),
  new productsService()
);
export default controller;
