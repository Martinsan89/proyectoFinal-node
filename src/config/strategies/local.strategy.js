import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../../dao/models/user.model.js";
import { createHash, isValidPassword } from "../../utils/crypto.js";

export function localStrategy() {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { age, email, last_name, first_name } = req.body;
          const userExists = await userModel.findOne({ email: username });
          if (userExists) {
            return done(null, false);
          }
          const newUser = await userModel.create({
            first_name,
            age,
            last_name,
            email: username,
            password: createHash(password),
          });
          return done(null, newUser);
        } catch (error) {
          done(error, false, { message: "Could not create user" });
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            // console.log("Usuario no existente en el login");
            return done(null, false, { message: "User or password incorrect" });
          }
          if (!isValidPassword(password, user.password)) {
            // console.log("Contraseña incorrecta");
            return done(null, false, { message: "User or password incorrect" });
          }
          return done(null, user._doc);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
}
