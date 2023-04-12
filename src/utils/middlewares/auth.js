import { userModel } from "../../dao/models/user.model.js";
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
