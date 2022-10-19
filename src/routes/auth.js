const express = require("express");

const Router = express.Router();

const authController = require("../controllers/auth");

Router.post("/register", authController.register);
Router.get("/user", authController.getAllUser);

module.exports = Router;
