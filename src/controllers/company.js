const companyModel = require("../models/company");
const wrapper = require("../utils/wrapper");

module.exports = {
  createCompany: async (request, response) => {
    try {
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
        description,
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
        description,
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
  getCompanyById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await companyModel.getCompanyById(id);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${id} Not Found`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Data By Id",
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
  updateCompany: async (request, response) => {
    try {
      // console.log(request.params);
      // console.log(request.body);
      const { id } = request.params;
      const {
        name,
        field,
        location,
        phonenumber,
        image,
        email,
        instagram,
        linkedin,
        description,
      } = request.body;

      const checkId = await companyModel.getCompanyById(id);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${id} Not Found`,
          []
        );
      }

      // let image;
      // if (request.file) {
      //   const { filename } = request.file;
      //   image = filename;
      //   cloudinary.uploader.destroy(checkId.data[0].image, () => {});
      // }

      const setData = {
        name,
        field,
        location,
        phonenumber,
        image,
        email,
        instagram,
        linkedin,
        description,
      };

      const result = await companyModel.updateCompany(id, setData);

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
