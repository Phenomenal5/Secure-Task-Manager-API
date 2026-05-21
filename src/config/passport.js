import passport from "passport";
import googleOauth from "passport-google-oauth20";
import User from "../models/User.js";

const { Strategy: GoogleStrategy } = googleOauth;

const hasGoogleCredentials =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

// Only register Google OAuth when credentials exist in .env.
if (hasGoogleCredentials) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0].value;

          if (!email) {
            return done(null, false, { message: "Google account has no email" });
          }

          // Find an existing user or create one from the Google profile.
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email });
          }

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save({ validateBeforeSave: false });
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

export { hasGoogleCredentials };
