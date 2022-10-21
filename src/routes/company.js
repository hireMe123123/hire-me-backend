const express = require("express");
const companyMiddleware = require("../middleware/upload");

const Router = express.Router();
const companyController = require("../controllers/company");
const authMiddleware = require("../middleware/auth");

Router.post("/", companyController.createCompany);
Router.get(
  "/:id",
  authMiddleware.authentication,
  companyController.getCompanyById
);
Router.patch(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  companyMiddleware.uploadImage,
  companyController.updateCompany
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  companyController.deleteCompany
);

module.exports = Router;
