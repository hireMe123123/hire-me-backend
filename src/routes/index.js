const express = require("express");

const Router = express.Router();

const userRoutes = require("./user");
const authRoutes = require("./auth");
const skillRoutes = require("./skill");

Router.use("/user", userRoutes);
Router.use("/auth", authRoutes);
Router.use("/skill", skillRoutes);

module.exports = Router;
