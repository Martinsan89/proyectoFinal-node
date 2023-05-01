import { userModel } from "../../dao/models/user.model.js";
import passport from "passport";

export const authenticated = async (req, res, next) => {
  const email = req.session.user;
  if (email) {
    if (email !== "adminCoder@coder.com") {
      const user = await userModel.findOne({ email });
      req.user = { ...user._doc, rol: "usuario" };
      next();
    } else {
      const user = {
        name: "Mail",
        apellido: "de Administadores",
        rol: "Admnistrador",
      };
      req.user = user;
      next();
    }
  } else {
    res.redirect("/login");
  }
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error);
      if (!user) {
        // console.log(info);
        return res.status(401).send({ error: info.message });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (rol) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send({ error: "User is not logged in" });
    if (req.user.user.role !== rol)
      return res
        .status(403)
        .send({ error: `User does not have the role ${rol}` });
    next();
  };
};
