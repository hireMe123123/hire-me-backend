const express = require("express");

const Router = express.Router();

const portfolioController = require("../controllers/portfolio");
const uploadMiddleware = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");

Router.post(
  "/",
  authMiddleware.authentication,
  uploadMiddleware.uploadDocument,
  portfolioController.createPortfolio
);

Router.get(
  "/user/:userId",
  authMiddleware.authentication,
  portfolioController.getPortfolioByUserId
);
Router.get(
  "/:portofolioId",
  authMiddleware.authentication,
  portfolioController.getPortfolioById
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  uploadMiddleware.uploadDocument,
  portfolioController.deletePortfolio
);
Router.patch(
  "/:id",
  authMiddleware.authentication,
  uploadMiddleware.uploadDocument,
  portfolioController.updatePortfolio
);
module.exports = Router;
