const portfolioModel = require("../models/portfolio");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");
const userModel = require("../models/usermodels");
// const client = require("../config/redis");

module.exports = {
  createPortfolio: async (request, response) => {
    try {
      const { userId, projectName, projectRepo } = request.body;
      if (!request.file) {
        return wrapper.response(response, 404, "Image Must Be Filled");
      }
      const { filename, mimetype } = request.file;
      const setPortfolio = {
        userId,
        projectName,
        projectRepo,
        image: filename ? `${filename}.${mimetype.split("/")[1]}` : "",
      };

      const result = await portfolioModel.createPortfolio(setPortfolio);

      return wrapper.response(
        response,
        result.status,
        "Success Create Portfolio",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getPortfolioByUserId: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await portfolioModel.getPortfolioByUserId(userId);
      const dataUser = await userModel.getUserByIDs(userId);
      const newResult = {
        userId: dataUser.data[0].userId,
        name: dataUser.data[0].name,
        data: result.data,
      };
      console.log(newResult);
      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Portfolio By User Id ${userId} Not Found`,
          []
        );
      }
      return wrapper.response(
        response,
        result.status,
        "Success Get Portfolio By User Id",
        newResult
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorEvent = null,
      } = error;
      return wrapper.response(response, status, statusText, errorEvent);
    }
  },
  getPortfolioById: async (request, response) => {
    try {
      const { portofolioId } = request.params;

      const result = await portfolioModel.getPortfolioById(portofolioId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Portfolio By Id ${portofolioId} Not Found`,
          []
        );
      }
      return wrapper.response(
        response,
        result.status,
        "Success Get Portfolio By User Id",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorEvent = null,
      } = error;
      return wrapper.response(response, status, statusText, errorEvent);
    }
  },
  deletePortfolio: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await portfolioModel.getPortfolioById(id);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Delete By Id ${id} Not Found`,
          []
        );
      }

      const { data } = checkId;
      const { image } = data[0];
      const fileName = image.split(".")[0];

      if (fileName) {
        // PROSES DELETE FILE DI CLOUDINARY
        await cloudinary.uploader.destroy(fileName, (result) => result);
      }

      // PROSES DELETE FILE DI CLOUDINARY
      await cloudinary.uploader.destroy(fileName, (res) => res);
      await portfolioModel.deletePortfolio(id);

      return wrapper.response(response, 200, "Success Delete Event !", data);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;

      return wrapper.response(response, status, statusText, errorData);
    }
  },
  updatePortfolio: async (request, response) => {
    try {
      const { id } = request.params;
      const { userId, projectName, projectRepo } = request.body;
      const checkId = await portfolioModel.getPortfolioById(id);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${id} Not Found`,
          []
        );
      }
      let image;
      if (request.file) {
        const { filename, mimetype } = request.file;
        image = filename ? `${filename}.${mimetype.split("/")[1]}` : "";

        // PROSES DELETE FILE DI CLOUDINARY
        await cloudinary.uploader.destroy(
          checkId.data[0].image.split(".")[0],
          (result) => result
        );
      }

      const setData = {
        userId,
        projectName,
        projectRepo,
        image,
        updated_at: "now()",
      };

      const result = await portfolioModel.updatePortfolio(id, setData);

      return wrapper.response(
        response,
        result.status,
        "Success Update Data",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
