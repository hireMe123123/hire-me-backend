const express = require("express");

const Router = express.Router();

const experienceController = require("../controllers/experience");
const authMiddleware = require("../middleware/auth");

Router.post(
  "/",
  authMiddleware.authentication,
  experienceController.createExperience
);

Router.get(
  "/user/:userId",
  authMiddleware.authentication,
  experienceController.getExperienceByUserId
);
Router.get(
  "/:portofolioId",
  authMiddleware.authentication,
  experienceController.getExperienceById
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  experienceController.deleteExperience
);
Router.patch(
  "/:id",
  authMiddleware.authentication,
  experienceController.updateExperience
);
module.exports = Router;
