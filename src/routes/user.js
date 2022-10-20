const express = require("express");

const Router = express.Router();
const userController = require("../controllers/user");
const uploadMiddleware = require("../middleware/upload");

Router.get("/test", userController.greetings);
Router.get("/getalluser", userController.getAllDataUser);
Router.get("/:id", userController.getUserById);
Router.delete("/delete/:id", userController.deleteDataUser);
Router.patch("/:id", userController.updateUserData);
Router.patch(
  "/image/:id",
  uploadMiddleware.uploadImage,
  userController.updateUserImage
);

module.exports = Router;
