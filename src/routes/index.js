const express = require("express");

const Router = express.Router();

const userRoutes = require("./user");
const companyRoutes = require("./company");
const authRoutes = require("./auth");
const skillRoutes = require("./skill");
const portfolioRoutes = require("./portfolio");

Router.use("/portfolio", portfolioRoutes);
Router.use("/user", userRoutes);
Router.use("/company", companyRoutes);
Router.use("/auth", authRoutes);
Router.use("/skill", skillRoutes);

module.exports = Router;
