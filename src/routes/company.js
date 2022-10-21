const express = require("express");
const companyMiddleware = require("../middleware/upload");

const Router = express.Router();
const companyController = require("../controllers/company");

Router.post("/", companyController.createCompany);
Router.get("/:id", companyController.getCompanyById);
Router.patch(
  "/:id",
  companyMiddleware.uploadImage,
  companyController.updateCompany
);
Router.delete("/:id", companyController.deleteCompany);

module.exports = Router;
