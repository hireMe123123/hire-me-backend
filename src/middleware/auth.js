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

      //   [token] = token.split(" ")[1];
      //   const checkTokenBlacklist = await client.get(`accessToken:${token}`);
      //   // console.log(checkTokenBlacklist);

      //   if (checkTokenBlacklist) {
      //     return wrapper.response(
      //       response,
      //       403,
      //       "Your token is destroyed please login again",
      //       null
      //     );
      //   }

      jwt.verify(token, process.env.ACCESS_KEYS, (error, result) => {
        if (error) {
          return wrapper.response(response, 403, error.message, null);
        }
        // console.log(result);
        // result = {
        //     userId: 'ca2973ed-9414-4135-84ac-799b6602d7b2',
        //     role: 'user',
        //     iat: 1662696652,
        //     exp: 1662783052
        //   }
        request.decodeToken = result; // digunakan untuk menyiman data di dalam request

        return next();
      });
    } catch (error) {
      return error.error;
    }
  },
};
