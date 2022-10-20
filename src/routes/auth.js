const express = require("express");

const Router = express.Router();

const authController = require("../controllers/auth");

Router.post("/register", authController.register);
<<<<<<< HEAD
=======
Router.get("/verify", authController.verify);
Router.post("/login", authController.login);
Router.post("/logout", authController.logout);
Router.post("/refresh", authController.refresh);
Router.post("/forgotPassword", authController.forgotPassword);
Router.patch("/resetPassword/:OTPReset", authController.resetPassword);
>>>>>>> 9e92a2c013bfc0be182a25ecb65cda3b7f89e400

module.exports = Router;
