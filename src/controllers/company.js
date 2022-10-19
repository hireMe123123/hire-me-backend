const companyModel = require("../models/company");
const wrapper = require("../utils/wrapper");

module.exports = {
  createCompany: async (request, response) => {
    try {
      // console.log(request.body);
      const {
        name,
        field,
        location,
        phonenumber,
        image,
        email,
        password,
        instagram,
        linkedin,
        descripton,
      } = request.body;

      let setData = {
        name,
        field,
        location,
        phonenumber,
        image,
        email,
        password,
        instagram,
        linkedin,
        descripton,
      };
      if (request.file) {
        const { filename } = request.file;
        setData = { ...setData, image: filename || "" };
      }

      const result = await companyModel.createCompany(setData);

      return wrapper.response(
        response,
        result.status,
        "Success Create Data",
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
