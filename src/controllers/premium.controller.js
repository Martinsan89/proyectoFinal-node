import DaoFactory from "../dao/persistenceFactory.js";
// import CustomError from "../errors/custom.errors.js";
import ErrorEnum from "../errors/errors.enum.js";

class PremiumController {
  #usersService;
  constructor(usersService) {
    this.#usersService = usersService;
  }

  async changeUserRole(req, res, next) {
    const userId = req.params.uid;
    const userRole = req.user?.user.role;

    try {
      const usuario = await this.#usersService.findById(userId);
      if (!userRole) {
        // res.send({ error: "Usuario no logueado" });
        res.userErrorResponse(
          "Documents not complete",
          ErrorEnum.INVALID_PRODUCT_ERROR
        );
      }
      if (userRole === "premium") {
        usuario.role = "user";
      }
      if (userRole === "user") {
        const { Identification, AddressProoftment, AccountStatus } = {
          ...usuario.documents[0].toObject(),
        };
        if ((Identification, AddressProoftment, AccountStatus)) {
          usuario.role = "premium";
          await this.#usersService.update({ _id: userId }, { ...usuario });
          res.send({ ok: true });
          return;
        }
        res.userErrorResponse(
          "Documents not complete",
          ErrorEnum.INVALID_PRODUCT_ERROR
        );
      }
    } catch (error) {
      console.log(error);
      // next(error);
    }
  }
}

const DaoService = await DaoFactory.getDao();
const usersService = await DaoService.getService("users");

const controller = new PremiumController(new usersService());
export default controller;
