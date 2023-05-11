import { cartModel } from "../dao/models/carts.models.js";
import { productModel } from "../dao/models/products.models.js";
import { productsManager } from "../dao/managers/products.manager.js";
import { userModel } from "../dao/models/user.model.js";

async function getCart(id) {
  const cart = await cartModel.findOne({ _id: id }).lean();
  return cart;
}

async function getProducts(query, redirection, res, user) {
  const options = {
    page: query.page ?? 1,
    limit: query.limit ?? 10,
    lean: true,
  };

  const myAggregate = query.status
    ? productModel.aggregate([
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
    : productModel.aggregate();

  await productModel
    .aggregatePaginate(myAggregate, options)
    .then(function (products) {
      const productsList = products.docs;
      if (productsList.length === 0) {
        res.render("notFound", { title: "Producto no encontrado" });
        return;
      } else {
        return res.render(redirection, {
          products: products.docs,
          nombre: user.first_name,
          apellido: user.last_name,
          rol: user.role,
          pages: products.totalPages,
          page: products.page,
          prev: products.prevPage,
          next: products.nextPage,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: query.sort
            ? `http://localhost:8080/?page=${products.prevPage}&sort=${
                query.sort
              }&status=${query.status ?? "true"}`
            : `http://localhost:8080/?page=${products.prevPage}&limit=${
                query.limit ?? "10"
              }`,
          nextLink: query.sort
            ? `http://localhost:8080/?page=${products.nextPage}&sort=${
                query.sort
              }&status=${query.status ?? "true"}`
            : `http://localhost:8080/?page=${products.nextPage}&limit=${
                query.limit ?? "10"
              }`,
        });
      }
    })
    .catch(function (err) {
      throw err;
    });
}

class ViewsController {
  async home(req, res) {
    const query = req.query;
    const id = req.user.user.id;
    const user = await userModel.findById(id);
    const redirection = "home";

    await getProducts(query, redirection, res, user);
  }

  async realtimeProducts(req, res) {
    const products = await productsManager.getAll();
    res.render("realtimeproducts", { products });
  }

  async chat(req, res) {
    res.render("chat");
  }

  async products(req, res) {
    const query = req.query;
    const user = req.user;
    const redirection = "products";

    await getProducts(query, redirection, res, user);
  }

  async productDetail(req, res) {
    const pId = req.params.pId;
    const { _id, title, description, price, stock, category, thumbnail } =
      await productsManager.findById(pId);
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
      });
    }
  }

  async carts(req, res) {
    const cId = req.params.cId;

    try {
      const cart = await getCart(cId);

      if (!cart) {
        res.render("notFound", { title: "Carrito no encontrado" });
      } else {
        const products = cart.products.reverse();

        res.render("carts", { products, cId });
      }
    } catch (error) {
      // throw error;
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
    const user = await userModel.findById(id);

    res.render("perfil", {
      nombre: user.first_name,
      apellido: user.last_name,
      rol: user.role,
    });
  }

  async forgotPassword(req, res) {
    res.render("forgot-password");
  }

  async failureLogin(req, res) {
    res.render("failureLogin");
  }
}

const controller = new ViewsController();
export default controller;
