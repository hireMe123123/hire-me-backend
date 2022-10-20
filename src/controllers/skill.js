const skillModel = require("../models/skillmodels");
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
  getDataSkillFromSeacrh: async (request, response) => {
    try {
      const { page, limit, searchName, sort } = request.query;
      page = +page || 1;
      limit = +limit || 5;
      const column = "skill";
      let typeJob;

      if (sort === "") {
        typeJob = "freelance";
      }

      const totalData = await skillModel.getCountDataSkill();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        page,
        totalPage,
        limit,
        totalData,
      };
      const offset = page * limit - limit;
      const result = await skillModel.getAllSkill(
        offset,
        limit,
        searchName,
        column,
        typeJob
      );
      return wrapper.response(
        response,
        result.status,
        "Success get all Events",
        result.data,
        pagination
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
