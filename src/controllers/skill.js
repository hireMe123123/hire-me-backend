const skillModel = require("../models/skillmodels");
const updateTime = require("../utils/updateTime");
const wrapper = require("../utils/wrapper");

module.exports = {
  getDataBySkillId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await skillModel.getSkillId(id);
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
      const { userId, skillName } = request.body;

      const data = {
        skillName,
      };
      const result = await skillModel.inputDataSkill(data);
      const { skillId } = result.data[0];
      const dataUserSkill = {
        userId,
        skillId,
      };

      // eslint-disable-next-line no-unused-vars
      const resultUserSkill = await skillModel.inputDataUserSkill(
        dataUserSkill
      );
      return wrapper.response(
        response,
        result.status,
        "Success Input Skill",
        result.data
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
      const { skillId } = request.body;

      const isFalid = await skillModel.getDataSkill(id, skillId);

      const userSkillid = isFalid.data[0].userSkillId;

      await skillModel.deleteUserSkill(userSkillid);

      const result = await skillModel.deleteSkill(skillId);
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
      const { skillId, skillName } = request.body;

      const dateTime = updateTime.dateTime();
      const setData = {
        skillName,
        updated_at: dateTime,
      };

      const result = await skillModel.updateSkillName(skillId, setData);
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
  getDataUserBySkillName: async (request, response) => {
    try {
      const { skillName, page, limit } = request.query;
      const totalData = await skillModel.getDataSkillName(skillName);
      console.log(totalData.data);
    } catch (error) {}
  },
};
