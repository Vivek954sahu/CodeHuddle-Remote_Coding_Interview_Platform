import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { ApiError } from "../utils/ApiError.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                if (!profile.emails || profile.emails.length === 0) {
                    return done(
                        new ApiError(400, "Google account has no email"),
                        null
                    );
                }

                const email = profile.emails[0].value;

                return done(null, {
                    id: profile.id,
                    email,
                    name: profile.displayName
                });
            } catch (error) {
                done(error, null);
            }
        }
    )
);

export default passport;