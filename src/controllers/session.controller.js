import DaoFactory from "../dao/persistenceFactory.js";
import UserDto from "../dtos/get/user.dto.js";

class SessionController {
  #service;
  constructor(service) {
    this.#service = service;
  }

  async get(req, res, next) {
    const { nombre } = req.query;
    try {
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
    } catch (error) {
      next(error);
    }
  }

  async current(req, res, next) {
    try {
      const user = await this.#service.findById(req.user.user.id);
      if (!user) {
        return res.send({ user: "User not found" });
      }
      const userToSend = new UserDto(user);
      res.send(userToSend);
    } catch (error) {
      next(error);
    }
  }
}

const DaoService = await DaoFactory.getDao();
const productsService = await DaoService.getService("users");

const controller = new SessionController(new productsService());
export default controller;
