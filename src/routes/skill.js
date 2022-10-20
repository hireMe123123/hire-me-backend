const express = require("express");

const Router = express.Router();
const skillController = require("../controllers/skill");

Router.get("/", skillController.getDataBySkillId);
Router.get("/skillsearch", skillController.getDataSkillFromSeacrh);

module.exports = Router;
