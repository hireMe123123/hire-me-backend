const express = require("express");

const Router = express.Router();

const userRoutes = require("./user");
const companyRoutes = require("./company");

const authRoutes = require("./auth");

Router.use("/user", userRoutes);
<<<<<<< HEAD
Router.use("/company", companyRoutes);
=======
Router.use("/auth", authRoutes);
>>>>>>> 623a27e778139686b28b0011f5a8443827fdaa28

module.exports = Router;
