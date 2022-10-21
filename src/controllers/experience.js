const experienceModel = require("../models/experience");
const wrapper = require("../utils/wrapper");
const userModel = require("../models/usermodels");
// const client = require("../config/redis");

module.exports = {
  createExperience: async (request, response) => {
    try {
      const { userId, company, position, entryDate, exitDate, description } =
        request.body;
      if (!request.file) {
        return wrapper.response(response, 404, "Image Must Be Filled");
      }

      const setExperience = {
        userId,
        company,
        position,
        entryDate,
        exitDate,
        description,
      };

      const result = await experienceModel.createExperience(setExperience);

      return wrapper.response(
        response,
        result.status,
        "Success Create Experience",
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
  getExperienceByUserId: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await experienceModel.getExperienceByUserId(userId);
      const dataUser = await userModel.getUserByIDs(userId);
      const newResult = {
        userId: dataUser.data[0].userId,
        name: dataUser.data[0].name,
        data: result.data,
      };

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Experience By User Id ${userId} Not Found`,
          []
        );
      }
      return wrapper.response(
        response,
        result.status,
        "Success Get Experience By User Id",
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
  getExperienceById: async (request, response) => {
    try {
      const { portofolioId } = request.params;

      const result = await experienceModel.getExperienceById(portofolioId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Experience By Id ${portofolioId} Not Found`,
          []
        );
      }
      return wrapper.response(
        response,
        result.status,
        "Success Get Experience By User Id",
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
  deleteExperience: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await experienceModel.getExperienceById(id);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Delete By Id ${id} Not Found`,
          []
        );
      }

      const { data } = checkId;

      await experienceModel.deleteExperience(id);

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
  updateExperience: async (request, response) => {
    try {
      const { id } = request.params;
      const { company, position, entryDate, exitDate, description } =
        request.body;
      const checkId = await experienceModel.getExperienceById(id);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${id} Not Found`,
          []
        );
      }

      const setData = {
        company,
        position,
        entryDate,
        exitDate,
        description,
        updated_at: "now()",
      };

      const result = await experienceModel.updateExperience(id, setData);

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
