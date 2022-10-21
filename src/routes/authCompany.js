const express = require("express");

const Router = express.Router();

const authCompanyController = require("../controllers/authCompany");

Router.post("/register", authCompanyController.register);
Router.get("/verify/:OTP", authCompanyController.verify);
Router.post("/login", authCompanyController.login);

module.exports = Router;
