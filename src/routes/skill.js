const express = require("express");

const Router = express.Router();
const skillController = require("../controllers/skill");

Router.get("/:id", skillController.getDataBySkillId);
Router.get("/user/:id", skillController.getDataByUserId);
Router.post("/createdata", skillController.createDataSkill);
Router.delete("/:id", skillController.deleteSKill);
Router.patch("/update/:id", skillController.updateSkill);

module.exports = Router;
