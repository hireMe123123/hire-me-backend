const skillModel = require("../models/skillmodels");
const updateTime = require("../utils/updateTime");
const wrapper = require("../utils/wrapper");

module.exports = {
  getDataBySkillId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await skillModel.getSkillId(id);
      if (result.data.length < 1) {
        return wrapper.response(response, 404, "Data Not Found", []);
      }
      return wrapper.response(
        response,
        result.status,
        "Success get Data",
        result.data
      );
    } catch (error) {
      const {
        status = 404,
        statusText = "Data Not Found",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  createDataSkill: async (request, response) => {
    try {
      const { userId, skill } = request.body;

      const dataUserSkill = {
        userId,
        skill,
      };

      // eslint-disable-next-line no-unused-vars
      const resultUserSkill = await skillModel.inputDataUserSkill(
        dataUserSkill
      );
      return wrapper.response(
        response,
        resultUserSkill.status,
        "Success Input Skill",
        resultUserSkill.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorInput = null,
      } = error;
      return wrapper.response(response, status, statusText, errorInput);
    }
  },
  deleteSKill: async (request, response) => {
    try {
      const { id } = request.params;

      const result = await skillModel.deleteUserSkill(id);
      if (result.data.length < 1) {
        return wrapper.response(response, 404, "Data Not Found", []);
      }
      return wrapper.response(
        response,
        result.status,
        `Success delete Skill`,
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorDelete = null,
      } = error;
      return wrapper.response(response, status, statusText, errorDelete);
    }
  },
  updateSkill: async (request, response) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { id } = request.params;
      const { skill } = request.body;

      const dateTime = updateTime.dateTime();
      const setData = {
        skill,
        updated_at: dateTime,
      };

      const result = await skillModel.updateSkillName(id, setData);
      return wrapper.response(
        response,
        result.status,
        "Success update skill name",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorUpdate = null,
      } = error;
      return wrapper.response(response, status, statusText, errorUpdate);
    }
  },
  getDataByUserId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await skillModel.getDataSkill(id);
      if (result.data.length < 1) {
        return wrapper.response(response, 404, "Data Not Found", []);
      }
      return wrapper.response(
        response,
        result.status,
        "Success get Data",
        result.data
      );
    } catch (error) {
      const {
        status = 404,
        statusText = "Data Not Found",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
