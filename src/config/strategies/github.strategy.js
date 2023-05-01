import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import config from "../../config.js";

export function githubStrategy() {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: config.github_callback_url,
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email;
          const user = await userModel.findOne({ email });
          // console.log("----passport---", user);
          if (!user) {
            const newUser = await userModel.create({
              email,
              first_name: profile._json.name,
              last_name: "-",
              password: "",
              age: 18,
            });
            return done(null, newUser);
          }
          return done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
}
