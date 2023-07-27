import { createHash } from "../utils/crypto.js";
import DaoFactory from "../dao/persistenceFactory.js";
import Subject from "../utils/subject.js";
import { RegisterUserMailObserver } from "../dao/observers/register-user.mail.observer.js";
import { emailService } from "../external-services/email.service.js";
import UserDto from "../dtos/get/user.dto.js";
import config from "../../config.js";

class UsersController {
  #registerSubject = new Subject();
  #usersService;
  #emailService;
  constructor(usersService, cartsService) {
    this.#usersService = usersService;
    this.#emailService = emailService;
    this.#configureObservers();
  }

  async get(req, res, next) {
    try {
      const { skip, limit, ...query } = req.query;
      const usuarios = await this.#usersService.find(query, {
        skip: Number(skip ?? 0),
        limit: Number(limit ?? 10),
      });

      const userWithDto = await new UserDto(usuarios.docs).all();

      res.okResponse("Todos los usuarios", userWithDto);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    const usersLastConnection = [];
    try {
      const { skip, limit, ...query } = req.query;
      // Get all users
      const usuarios = await this.#usersService.find(query, {
        skip: Number(skip ?? 0),
        limit: Number(limit ?? 10),
      });
      // Define array users _id with last_connection in minutes
      usersLastConnection.push(
        usuarios.docs.map((e) => {
          return {
            id: e._id,
            email: e.email,
            last_connection: e.last_connection,
          };
        })
      );
      // Filter users by last_connection / get deprecated_users
      const { DEPRECATED_USERS } = config;

      const userToDelete = usersLastConnection[0].filter(
        (e) => +e.last_connection > +DEPRECATED_USERS
      );

      // Delete users
      userToDelete.map(async (e) => await this.#usersService.delete(e.id));

      // Send email
      userToDelete.map(
        async (e) =>
          await this.#emailService.sendEmail({
            to: e.email,
            subject: "Your account has beend deleted",
            html: `<h1>Su cuenta ha sido borrada</h1>
            <button> <a href="https://proyectofinal-node-production.up.railway.app/register">Click para reestablecer la contrasena</a></button>`,
          })
      );

      res.okResponse("Usuarios eliminados");
    } catch (error) {
      next(error);
    }
  }

  async find(req, res, next) {
    const { skip, limit, ...query } = req.query;

    try {
      const usuarios = await this.#usersService.find(query, {
        skip: Number(skip ?? 0),
        limit: Number(limit ?? 10),
      });

      const userWithDto = await new UserDto(usuarios.docs).all();

      res.send({
        usuarios: userWithDto,
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
      const idUsuario = req?.params.uid;

      const usuario = await this.#usersService.findById({ _id: idUsuario });
      if (!usuario) {
        res
          .status(404)
          .send({ error: `Usuario con id ${idUsuario} no encontrado` });
        return;
      }
      const userWithDto = await new UserDto(usuario).one();
      res.send({ user: userWithDto });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const usuario = req.body;
    // const createCart = await this.#cartsService.create();
    const newUser = { ...usuario, password: createHash(usuario.password) };

    try {
      const { _id } = await this.#usersService.create(newUser);
      this.#registerSubject.notify({ _id, ...newUser });

      res.status(201).send({ id: _id });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    const idUsuario = req.params.idUsuario;

    try {
      const usuario = await this.#usersService.find({ _id: idUsuario });
      if (!usuario) {
        res
          .status(404)
          .send({ error: `Usuario con id ${idUsuario} no encontrado` });
        return;
      }
      const nuevosDatos = req.body;

      await this.#usersService.update(
        { _id: idUsuario },
        { ...usuario, ...nuevosDatos }
      );
      res.send({ ok: true });
    } catch (error) {
      next(error);
    }
  }

  async deleteOne(req, res, next) {
    try {
      const idUsuario = req.params.idUsuario;
      await this.#usersService.delete({ _id: idUsuario });
      res.send({ ok: true });
    } catch (error) {
      next(error);
    }
  }

  async documents(req, res, next) {
    try {
      res.okResponse("Documento agregado");
    } catch (error) {
      next(error);
    }
  }

  #configureObservers() {
    this.#registerSubject.suscribe(new RegisterUserMailObserver());
    // this.#registerSubject.suscribe(new RegisterUserSmsObserver());
  }
}

const DaoService = await DaoFactory.getDao();
const usersService = await DaoService.getService("users");

const controller = new UsersController(new usersService());
export default controller;
