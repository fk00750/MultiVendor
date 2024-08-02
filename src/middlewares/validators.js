const PrimaryErrorHandler = require("../utils/primary.error.handler");

const validatePostRequest = (req, res, next) => {
    if (!req.body) return next(new PrimaryErrorHandler(400, "Invalid Request"));

    if (Object.keys(req.body).length === 0)
        return next(new PrimaryErrorHandler(400, "Invalid Request"));

    next();
};


/**
 * @function validateName
 * @description Validate the name in the request body.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {PrimaryErrorHandler} If the name is invalid.
 */
const validateName = (req, res, next) => {
    if (!req.body.name || req.body.name.length < 2)
        return next(new PrimaryErrorHandler(400, "Invalid Name **"));

    const regex = /^[a-zA-Z ]+$/;
    const result = regex.test(req.body.name);

    if (!result) return next(new PrimaryErrorHandler(400, "Invalid Name *"));

    next();
};


/**
* @function validateEmail
* @description Validate the email in the request body.
* @param {Request} req - The request object.
* @param {Response} res - The response object.
* @param {Function} next - The next middleware function.
* @throws {PrimaryErrorHandler} If the email is invalid.
*/
const validateEmail = (req, res, next) => {
    if (!req.body.email)
        return next(new PrimaryErrorHandler(400, "Invalid Email **"));

    const regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const result = regex.test(String(req.body.email).toLowerCase());

    if (!result) return next(new PrimaryErrorHandler(400, "Invalid Email"));

    next();
};


const validateTempMail = (req, res, next) => {
    if (!req.body.email)
        return next(new PrimaryErrorHandler(400, "Invalid Email **"));

    const providers = [
        "@gmail.com",
        "@outlook.com",
        "@yahoo.com",
        "@hotmail.com",
        "@aol.com",
        "@icloud.com",
        "@zoho.com",
        "@byom.de",
    ];

    const regex = /@(\w+)\.(\w+)$/;
    const domain = req.body.email.match(regex);

    if (!domain)
        return next(new PrimaryErrorHandler(400, "Invalid Email domain *"));

    if (!providers.includes(domain[0]))
        return next(new PrimaryErrorHandler(400, "Invalid Email domain **"));

    next();
};

const validatePassword = (req, res, next) => {
    if (!req.body.password)
        return next(new PrimaryErrorHandler(400, "Invalid Password"));

    const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{;,:'".<>/?]).{8,}$/;
    const result = regex.test(req.body.password);

    if (!result) return next(new PrimaryErrorHandler(400, "Invalid Password"));

    next();
};

module.exports = {
    validatePostRequest,
    validateName,
    validatePassword,
    validateEmail,
    validateTempMail,
};
