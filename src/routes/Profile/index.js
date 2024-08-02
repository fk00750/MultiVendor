const express = require("express");
const {
    Profile,
} = require("../../controllers/Profile");
const passport = require("passport");
const Router = express.Router();

Router.get("/view-profile", passport.authenticate("jwt-refresh"), Profile)

module.exports = Router;
