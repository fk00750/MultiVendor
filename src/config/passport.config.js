/**
 * @file passport.config.js
 * @fileoverview Configuration file for passport.js and jwt authentication.
 * Handle access and refresh token strategies
 */

const path = require("path");
const fs = require("fs");
const { Strategy, ExtractJwt } = require("passport-jwt");

const User = require("../models/user.model");

const pathToAccessTokenKey = path.join(
    __dirname,
    "../../keys/",
    "AccessTokenPublicKey.pem"
);
const AccessTokenPublicKey = fs.readFileSync(pathToAccessTokenKey, "utf-8");

const pathToRefreshTokenKey = path.join(
    __dirname,
    "../../keys/",
    "RefreshTokenPublicKey.pem"
);
const RefreshTokenPublicKey = fs.readFileSync(pathToRefreshTokenKey, "utf-8");



/**
 * @function passportStrategy - configure jwt authentication using passport
 * @param {Object} passport - passport instance
 * @param {string} usageName - name of the strategy (ex: jwt-access)
 * @param {string} KEY - public key to verify jwt
 */
const passportStrategy = (passport, usageName, KEY) => {
    passport.use(
        usageName,
        new Strategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: KEY,
                algorithms: ["RS256"],
            },
            async (jwtPayload, done) => {
                try {
                    const userId = jwtPayload.sub;
                    const result = await User.findOne({ userId: userId })

                    if (result) {
                        return done(null, result);
                    } else {
                        return done(null, false);
                    }
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );
};

/**
 * @function passportConfig - jwt strategies for access and refresh tokens with passport.
 * @param {Object} passport - passport instance
 */
const passportConfig = (passport) => {
    /**
     * JWT authentication strategy for access tokens and refresh tokens using the passportStrategy function.
     * It passes the passport instance, the usageName string (either "jwt-access" or "jwt-refresh"), and the public key (either ACCESS_PUB_KEY or Refresh_PUB_KEY) as arguments to the passportStrategy function.
     * If an error occurs while registering the strategy, it is logged to the console.
     */
    try {
        passportStrategy(passport, "jwt-access", AccessTokenPublicKey);
    } catch (error) {
        console.log(error.message);
    }

    try {
        passportStrategy(passport, "jwt-refresh", RefreshTokenPublicKey);
    } catch (error) {
        console.log(error.message);
    }


    /**
     * @method passport.serializeUser - Serialize user information in the session
     * @param {Object} user - user object
     * @param {function} done - The callback function to be called when serialization is completed.
     */
    passport.serializeUser((user, done) => {
        done(null, JSON.stringify(user));
    });

    /**
     * @method passport.deserializeUser - Deserialize user information from session
     * @param {Object} user - user object
     * @param {function} done - The callback function to be called when deserialization is completed.
     */
    passport.deserializeUser((user, done) => {
        done(null, JSON.parse(user));
    });
};

module.exports = { passportConfig };
