const userModels = require("../models/usermodels");
const wrapper = require("../utils/wrapper");

module.exports = {
  greetings: async (request, response) => {
    try {
      return wrapper.response(
        response,
        200,
        "Success Get test",
        "Hello World !"
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
  getAllDataUser: async (request, response) => {
    try {
      const result = await userModels.getAllUsers();
      return wrapper.response(
        response,
        result.status,
        "Success get data user",
        result.data
      );
    } catch (error) {
      const {
        status = 404,
        statusText = "Data Not Found",
        error: errorData = [],
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getUserById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await userModels.getUserByIDs(id);
      if (result.data.length < 1) {
        return wrapper.response(response, 404, `Data Not Found`, []);
      }
      return wrapper.response(
        response,
        result.status,
        `Success get User`,
        result.data
      );
    } catch (error) {
      const {
        status = 404,
        statusText = "User ID is not found",
        error: userData = null,
      } = error;
      return wrapper.response(response, status, statusText, userData);
    }
  },
  deleteDataUser: async (request, response) => {
    try {
      const { id } = request.params;
      const isFalid = await userModels.getUserByIDs(id);

      if (isFalid.data.length > 0) {
        const result = await userModels.deleteUser(id);
        return wrapper.response(
          response,
          result.status,
          `Success Delete User`,
          result.data
        );
      }
      /**
       * Error Handling if user by Id is not registered
       */
      return wrapper.response(response, 404, `User is not Found`, []);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorDelete = null,
      } = error;
      return wrapper.response(response, status, statusText, errorDelete);
    }
  },
};
