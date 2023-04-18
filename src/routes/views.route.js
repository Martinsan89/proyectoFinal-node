import { Router } from "express";
import { productsManager } from "../dao/managers/products.manager.js";
import { cartModel } from "../dao/models/carts.models.js";
import { productModel } from "../dao/models/products.models.js";
import { userModel } from "../dao/models/user.model.js";
import { authenticated } from "../utils/middlewares/auth.js";

const route = Router();

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
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol,
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

route.get("/", authenticated, async (req, res) => {
  const query = req.query;
  const user = req.user;
  const redirection = "home";

  await getProducts(query, redirection, res, user);
});

route.get("/realtimeproducts", async (req, res) => {
  const products = await productsManager.getAll();
  res.render("realtimeproducts", { products });
});

route.get("/chat", async (req, res) => {
  res.render("chat");
});

route.get("/products", authenticated, async (req, res) => {
  const query = req.query;
  const user = req.user;
  const redirection = "products";

  await getProducts(query, redirection, res, user);
});

route.get("/productDetail/:pId", async (req, res) => {
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
});

route.get("/carts/:cId", async (req, res) => {
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
});

route.get("/register", (req, res) => {
  const email = req.session.user;
  if (email) {
    return res.redirect("/products");
  }
  res.render("register");
});

route.get("/login", (req, res) => {
  res.render("login");
});

route.get("/perfil", authenticated, async (req, res) => {
  const user = req.user;

  res.render("perfil", {
    nombre: user.name,
    apellido: user.apellido,
    rol: user.rol,
  });
});

route.get("/forgot-password", async (req, res) => {
  res.render("forgot-password");
});

route.get("/failureLogin", (req, res) => {
  res.render("failureLogin");
});

export default route;
