const { default: axios } = require("axios")
const AuthManager = require("../../utils/auth.manager")
const IssueAccessAndRefreshToken = require("../../utils/jwt/issue.jwt.token")
const PrimaryErrorHandler = require("../../utils/primary.error.handler")
const TokenManager = require("../../utils/token.manager")
const axios = require('axios')

const authManager = new AuthManager()
const tokenManager = new TokenManager()

/**
 * @async
 * @function Register
 * @description Handle user registration process
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {Function} next - next middleware function.
 * @throws {Error} In case of any error during registration.
 * @returns {Response} returns a JSON response with status and message.
 */
exports.Register = async (req, res, next) => {
    try {
        // get name, phone and password from req.body
        const { name, email, password, city, pincode } = req.body

        if (!name || !email || !password || !city || !pincode) return next(new PrimaryErrorHandler(400, "Invalid request"))

        // check if user already exists in the database
        const user = await authManager.findByEmail(email)

        // if user already exists in the database, response with an error that user already exists
        if (user) return next(PrimaryErrorHandler.alreadyExist("user already exist"))

        // create new user with name, phone and password
        const isUserCreated = await authManager.createUser(name, email, password, city, pincode)

        // If user creation fails, response with an error that something went wrong 
        if (!isUserCreated) return next(PrimaryErrorHandler.somethingWentWrong())

        // if user creation successfull, response with status code 200 and success message
        return res.status(200).json({
            status: 200,
            message: "success"
        })
    } catch (error) {
        // log the error and pass it to error handler middleware
        console.log(`Error: src > controllers > Auth > index.js > Register - ${error.message}`)
        next(error)
    }
}

exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return next(PrimaryErrorHandler(400, "Invalid request"));

        const user = await authManager.findByEmail(email);

        if (!user) return next(PrimaryErrorHandler.notFound("user not found"));

        const isPasswordValid = await authManager.verifyPassword(
            password,
            user.password
        );

        if (!isPasswordValid)
            return next(PrimaryErrorHandler.wrongCredentials("Invalid Password"));

        // find and delete existing refresh token
        const existingRefreshToken = await tokenManager.findRefreshTokenById(
            user.userId
        );
        if (existingRefreshToken)
            await tokenManager.deleteExistingRefreshTokens(user.userId);

        const accessToken = await IssueAccessAndRefreshToken.issueAccessToken(
            user.userId
        );
        const refreshToken = await IssueAccessAndRefreshToken.issueRefreshToken(
            user.userId
        );

        if (!accessToken || !refreshToken)
            return next(PrimaryErrorHandler.somethingWentWrong());

        const decode = await tokenManager.decodeToken(refreshToken);

        if (!decode)
            return next(
                PrimaryErrorHandler.somethingWentWrong("unable to refresh the token")
            );

        const { exp: expiresAt } = decode;

        // store new refresh token
        const storeNewRefreshToken = await tokenManager.storeRefreshToken(
            refreshToken,
            user.userId,
            expiresAt
        );

        if (!storeNewRefreshToken)
            return next(
                PrimaryErrorHandler.somethingWentWrong("unable to refresh the token")
            );

        return res.status(200).json({
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            message: "Login Successfully",
        });
    } catch (error) {
        console.log(
            `Error: src > controllers > Auth > index.js > Login - ${error.message}`
        );
        next(error);
    }
}


exports.GoogleLogin = async (req, res, next) => {
    try {
        const { access_token } = req.body;

        if (!accessToken)
            return next(PrimaryErrorHandler(400, "Invalid request"));

        const result = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json',
            },
        });

        let data = await result.json();

        if (!data) return next(PrimaryErrorHandler.somethingWentWrong())

        const user = await authManager.findByEmail(data.email);

        if (!user) return next(PrimaryErrorHandler.notFound("user not found"));

        // find and delete existing refresh token
        const existingRefreshToken = await tokenManager.findRefreshTokenById(
            user.userId
        );
        if (existingRefreshToken)
            await tokenManager.deleteExistingRefreshTokens(user.userId);

        const accessToken = await IssueAccessAndRefreshToken.issueAccessToken(
            user.userId
        );
        const refreshToken = await IssueAccessAndRefreshToken.issueRefreshToken(
            user.userId
        );

        if (!accessToken || !refreshToken)
            return next(PrimaryErrorHandler.somethingWentWrong());

        const decode = await tokenManager.decodeToken(refreshToken);

        if (!decode)
            return next(
                PrimaryErrorHandler.somethingWentWrong("unable to refresh the token")
            );

        const { exp: expiresAt } = decode;

        // store new refresh token
        const storeNewRefreshToken = await tokenManager.storeRefreshToken(
            refreshToken,
            user.userId,
            expiresAt
        );

        if (!storeNewRefreshToken)
            return next(
                PrimaryErrorHandler.somethingWentWrong("unable to refresh the token")
            );

        return res.status(200).json({
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            message: "Login Successfully",
        });
    } catch (error) {
        console.log(
            `Error: src > controllers > Auth > index.js > GoogleLogin - ${error.message}`
        );
        next(error);
    }
}