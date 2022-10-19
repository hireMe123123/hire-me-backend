const express = require("express");

const Router = express.Router();
const userController = require("../controllers/user");

Router.get("/test", userController.greetings);
Router.get("/getalluser", userController.getAllDataUser);
Router.get("/:id", userController.getUserById);
Router.delete("/delete/:id", userController.deleteDataUser);

module.exports = Router;
