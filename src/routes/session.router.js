import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import { passportCall } from "../utils/middlewares/auth.js";

const route = Router();

// const auth = (req, res, next) => {
//     const admin = req.session.admin;
//     if (admin) {
//       next();
//     } else {
//       res.status(401).send({ error: "No autorizado" });
//     }
//   };

// const auth = (rol) => {
//   return async (req, res, next) => {
//   const admin = req.session.admin;
//   const userID = req.session.user;
//   const user = await userManeger.findOne({_id: userID})
//   if(!user){
//     res.status(401).send({error: 'No autorizado'})
//   } else {
//     req.user = user;
//     next()
//   }
//   }

// }

route.get("/", (req, res) => {
  const { nombre } = req.query;
  req.session.nombre = req.session.nombre ?? nombre;
  req.session.cantidadVisitas = req.session.cantidadVisitas
    ? req.session.cantidadVisitas + 1
    : 1;
  const mensaje =
    req.session.cantidadVisitas === 1
      ? `Bienvenido ${req.session.nombre ?? ""}`
      : `${req.session.nombre ?? ""} visitaste el sitio ${
          req.session.cantidadVisitas
        } veces`;
  res.send(mensaje);
});

route.get(
  "/current",
  passportCall("current"),
  // authorization("ADMIN"),
  async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.user.user.email });
      res.send(user);
    } catch (error) {
      res.send(error);
    }
  }
);

//   app.get("/session", (req, res) => {
//     if (req.session.counter) {
//       req.session.counter++;
//       res.send({ counter: req.session.counter });
//     } else {
//       req.session.counter = 1;
//       req.send({ counter: req.session.counter, primeraVez: true });

//       re;
//     }
//   });

//   app.get("/loguot", (req, res) => {
//     req.session.destroy((err) => {
//       if (err) {
//         res.status(500).send({ error: err });
//       } else {
//         res.send({ logout: "ok" });
//       }
//     });
//   });

//   app.get("/login", (req, res) => {
//     const { username, password } = req.query;
//     if (username !== "admin" || password !== "admin") {
//       res.status(401).send({ error: "Usuario o password incorrectos" });
//       return;
//     }
//     req.session.user = username;
//     req.session.admin = true;
//     res.send({ login: "ok" });
//   });
//   app.get("/autorizado", auth, (req, res) => {
//     res.send({ autorizado: "ok" });
//   });

export default route;
