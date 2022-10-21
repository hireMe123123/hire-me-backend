const express = require("express");

const Router = express.Router();

const authCompanyController = require("../controllers/authCompany");

Router.post("/register", authCompanyController.register);
Router.get("/verify/:OTP", authCompanyController.verify);
Router.post("/login", authCompanyController.login);
Router.post("/logout", authCompanyController.logout);
Router.post("/refresh", authCompanyController.refresh);
Router.post("/forgotPassword", authCompanyController.forgotPassword);
Router.patch("/resetPassword/:OTPReset", authCompanyController.resetPassword);

module.exports = Router;
