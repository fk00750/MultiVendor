const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const AuthRouter = require("./routes/Auth/");
const ProfileRouter = require("./routes/Profile/");
const errorHandler = require("./middlewares/error.handler");
const { passportConfig } = require("./config/passport.config");
const passport = require("passport");
const session = require("express-session");

const app = express();

/**
 * Define allowed origins for CORS (Cross-Origin Resource Sharing) policy.
 */
const allowedOrigins = [""];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors({ origin: "*" }))

/**
 * Log HTTP requests to the console.
 */
app.use(morgan("dev"));

/**
 * Parse incoming request bodies in JSON format.
 */
app.use(express.json());

/**
 * Parse incoming request bodies in URL-encoded format.
*/
app.use(express.urlencoded({ extended: false }));

/**
 * Initialize Passport.js for authentication.
 */
passportConfig(passport);

/**
 * Configure express-session middleware.
 */
app.use(
    session({
        secret: "YOUR_SECRET_KEY",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }, // for demo purpose only, set to true in a production environment
    })
);

/**
 * Route for authentication-related endpoints.
 */
app.use("/api/auth", AuthRouter);
app.use("/api/profile", ProfileRouter);

// Home route
app.get("/", (req, res, next) => {
    res.status(200).json({ message: "Welcome !!!" });
});


/**
 * Error handling middleware.
 */
app.use(errorHandler);

module.exports = app;