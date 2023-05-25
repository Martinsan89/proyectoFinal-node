import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import config from "../../../config.js";

export function jwtStrategy() {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          cookieExtractor,
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: config.jwt_token,
      },
      (payload, done) => {
        console.log("jwt.js", payload);
        try {
          return done(null, payload);
        } catch (error) {
          done(err, false);
        }
      }
    )
  );

  function cookieExtractor(req) {
    return req?.cookies?.["jwt"];
  }
}
