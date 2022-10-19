const express = require("express");

const Router = express.Router();
const companyController = require("../controllers/company");

Router.post("/", companyController.createCompany);

module.exports = Router;
