const express = require("express");

const Router = express.Router();

const experienceController = require("../controllers/experience");

Router.post("/", experienceController.createExperience);

Router.get("/user/:userId", experienceController.getExperienceByUserId);
Router.get("/:portofolioId", experienceController.getExperienceById);
Router.delete("/:id", experienceController.deleteExperience);
Router.patch("/:id", experienceController.updateExperience);
module.exports = Router;
