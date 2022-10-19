const express = require("express");

const Router = express.Router();

const userRoutes = require("./user");

const authRoutes = require("./auth");

Router.use("/user", userRoutes);
Router.use("/auth", authRoutes);

module.exports = Router;
