const express = require("express");

const Router = express.Router();

const portfolioController = require("../controllers/portfolio");
const uploadMiddleware = require("../middleware/upload");

Router.post(
  "/",
  uploadMiddleware.uploadDocument,
  portfolioController.createPortfolio
);

Router.get("/user/:userId", portfolioController.getPortfolioByUserId);
Router.get("/:portofolioId", portfolioController.getPortfolioById);
Router.delete(
  "/:id",
  uploadMiddleware.uploadDocument,
  portfolioController.deletePortfolio
);
Router.patch(
  "/:id",
  uploadMiddleware.uploadDocument,
  portfolioController.updatePortfolio
);
module.exports = Router;
