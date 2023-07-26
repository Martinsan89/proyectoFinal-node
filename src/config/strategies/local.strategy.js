import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from "../../utils/crypto.js";
import DaoFactory from "../../dao/persistenceFactory.js";

const DaoService = await DaoFactory.getDao();
const usersService = await DaoService.getService("users");
const usersController = new usersService();

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
          const { age, email, last_name, first_name, phone, role } = req.body;
          const userExists = await usersController.findOne(email);
          if (userExists) {
            return done(null, false);
          }

          const newUser = await usersController.create({
            first_name,
            age,
            last_name,
            phone,
            email: username,
            role: role ?? "user",
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
        const user = await usersController.findOne(username);
        try {
          if (!user) {
            return done(null, false, { message: "User or password incorrect" });
          }
          if (!isValidPassword(password, user.password)) {
            return done(null, false, { message: "User or password incorrect" });
          }

          return done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
}
