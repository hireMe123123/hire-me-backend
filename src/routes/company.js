const express = require("express");

const Router = express.Router();
const companyController = require("../controllers/company");

Router.post("/", companyController.createCompany);
Router.get("/:id", companyController.getCompanyById);
Router.patch("/:id", companyController.updateCompany);

module.exports = Router;
