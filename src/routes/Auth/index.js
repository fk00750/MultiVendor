const express = require("express");
const { Register, Login, GoogleLogin } = require("../../controllers/Auth");
const { validatePostRequest, validateName, validateEmail, validateTempMail, validatePassword } = require("../../middlewares/validators");
const Router = express.Router();

Router.post(
  "/register",
  validatePostRequest,
  validateName,
  validateEmail,
  validateTempMail,
  validatePassword,
  Register
).post(
  "/login",
  validatePostRequest,
  validateEmail,
  validateTempMail,
  validatePassword,
  Login
).post(
  '/google-login',
  validatePostRequest,
  GoogleLogin
);

module.exports = Router;
