import passport from "passport";
import { userModel } from "../dao/models/user.model.js";
import { localStrategy } from "./strategies/local.strategy.js";
import { githubStrategy } from "./strategies/github.strategy.js";
import { jwtStrategy } from "./strategies/jwt.strategy.js";

export function configurePassport() {
  localStrategy();
  githubStrategy();
  jwtStrategy();

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findOne({ _id: id });
    done(null, user);
  });
}
