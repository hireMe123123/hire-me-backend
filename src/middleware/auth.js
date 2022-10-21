const jwt = require("jsonwebtoken");
const wrapper = require("../utils/wrapper");

module.exports = {
  // eslint-disable-next-line consistent-return
  authentication: async (request, response, next) => {
    try {
      const token = request.headers.authorization;

      if (!token) {
        return wrapper.response(response, 403, "Please Login First", null);
      }

      jwt.verify(token, process.env.ACCESS_KEYS, (error, result) => {
        if (error) {
          return wrapper.response(response, 403, error.message, null);
        }

        request.decodeToken = result;
        return next();
      });
    } catch (error) {
      return error.error;
    }
  },
  isAdmin: async (request, response, next) => {
    try {
      // PROSES UNTUK PENGECEKAN ROLE
      if (request.decodeToken.role.toLowerCase() !== "admin") {
        return wrapper.response(
          response,
          403,
          "Sorry, Only Admin Can Allowed to Access This Request",
          null
        );
      }
      return next();
    } catch (error) {
      return error.error;
    }
  },
};
