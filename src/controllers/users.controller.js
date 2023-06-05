import { createHash } from "../utils/crypto.js";
import DaoFactory from "../dao/persistenceFactory.js";
import Subject from "../utils/subject.js";
import { RegisterUserMailObserver } from "../dao/observers/register-user.mail.observer.js";
import { RegisterUserSmsObserver } from "../dao/observers/register-user.sms.observer.js";

class UsersController {
  #registerSubject = new Subject();
  #service;
  #cartsService;
  constructor(service, cartsService) {
    this.#service = service;
    this.#cartsService = cartsService;
    this.#configureObservers();
  }
  async find(req, res, next) {
    const { skip, limit, ...query } = req.query;

    try {
      const usuarios = await this.#service.find(query, {
        skip: Number(skip ?? 0),
        limit: Number(limit ?? 10),
      });

      res.send({
        usuarios: usuarios.docs,
        total: usuarios.totalDocs,
        totalPages: usuarios.totalPages,
        hasNextPage: usuarios.hasNextPage,
        hasPrevPage: usuarios.hasPrevPage,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const idUsuario = req.params.idUsuario;

      const usuario = await this.#service.findById({ _id: idUsuario });
      if (!usuario) {
        res
          .status(404)
          .send({ error: `Usuario con id ${idUsuario} no encontrado` });
        return;
      }
      res.send({ usuario });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const usuario = req.body;
    const createCart = await this.#cartsService.create();
    const newUser = { ...usuario, password: createHash(usuario.password) };

    try {
      const { _id } = await this.#service.create(newUser);
      this.#registerSubject.notify({ _id, ...newUser });

      res.status(201).send({ id: _id });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    const idUsuario = req.params.idUsuario;

    try {
      const usuario = await this.#service.find({ _id: idUsuario });
      if (!usuario) {
        res
          .status(404)
          .send({ error: `Usuario con id ${idUsuario} no encontrado` });
        return;
      }
      const nuevosDatos = req.body;

      await this.#service.update(
        { _id: idUsuario },
        { ...usuario, ...nuevosDatos }
      );
      res.send({ ok: true });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const idUsuario = req.params.idUsuario;
      await this.#service.delete({ _id: idUsuario });
      res.send({ ok: true });
    } catch (error) {
      next(error);
    }
  }

  #configureObservers() {
    this.#registerSubject.suscribe(new RegisterUserMailObserver());
    this.#registerSubject.suscribe(new RegisterUserSmsObserver());
  }
}

const DaoService = await DaoFactory.getDao();
const productsService = await DaoService.getService("users");
const cartsService = await DaoService.getService("carts");

const controller = new UsersController(
  new productsService(),
  new cartsService()
);
export default controller;
