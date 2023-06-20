import passport from "passport";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error);
      // if (!user) {
      //   res.status(401).send({ error: info.message });
      //   return;
      // }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send({ error: "User is not logged in" });

    const roleValid = role.find((rol) => rol === req.user.user.role);

    if (!roleValid)
      return res
        .status(403)
        .send({ error: `User does not have the role ${role}` });
    next();
  };
};
