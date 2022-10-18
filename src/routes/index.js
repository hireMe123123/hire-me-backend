const express = require("express");

const Router = express.Router();

const userRoutes = require("./user");

Router.use("/user", userRoutes);

module.exports = Router;
