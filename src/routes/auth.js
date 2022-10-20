const express = require("express");

const Router = express.Router();

const authController = require("../controllers/auth");

Router.post("/register", authController.register);
Router.get("/verify/:OTP", authController.verify);
Router.post("/login", authController.login);
Router.post("/logout", authController.logout);
Router.post("/refresh", authController.refresh);
Router.post("/forgotPassword", authController.forgotPassword);
Router.patch("/resetPassword/:OTPReset", authController.resetPassword);
module.exports = Router;
