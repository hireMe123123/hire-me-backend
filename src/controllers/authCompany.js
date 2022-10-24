/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const client = require("../config/redis");
const authCompanyModel = require("../models/authCompany");
const wrapper = require("../utils/wrapper");
const {
  sendMail,
  sendMailToResetPassword,
  hiredGreetings,
} = require("../utils/mail");
const userModel = require("../models/usermodels");

module.exports = {
  register: async (request, response) => {
    try {
      const {
        name,
        email,
        field,
        phonenumber,
        password,
        confirmPassword,
        companyName,
      } = request.body;

      const checkEmail = await authCompanyModel.getCompanyByEmail(email);
      if (checkEmail.data.length > 0) {
        return wrapper.response(response, 403, "Email Alredy Registered", null);
      }

      if (password.length < 6) {
        return wrapper.response(
          response,
          400,
          "At Least 6 Character Password",
          null
        );
      }

      if (password !== confirmPassword) {
        return wrapper.response(response, 400, "Password Not Match", null);
      }
      // PROSES ENCRYPT PASSWORD
      const hash = bcrypt.hashSync(password, 10);

      const setData = {
        name,
        email,
        password: hash,
        phonenumber,
        field,
        companyName,
      };

      await authCompanyModel.register(setData);
      const company = await authCompanyModel.getCompanyByEmail(email);
      const newResult = [{ companyId: company.data[0].companyId }];

      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      client.setEx(`OTP:${OTP}`, 3600, OTP);
      client.setEx(`companyId:${OTP}`, 3600 * 48, company.data[0].companyId);

      const setMailOptions = {
        to: email,
        name,
        subject: "Email Verification !",
        template: "verificationEmail.html",
        buttonUrl: `https://hire-me-backend.vercel.app/api/authCompany/verify/${OTP}`,
        // buttonUrl: `http://localhost:3001/api/authCompany/verify/${OTP}`,
        OTP,
      };

      await sendMail(setMailOptions);

      return wrapper.response(
        response,
        200,
        "Success Register Please Check Your Email",
        newResult
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
  verify: async (request, response) => {
    try {
      const { OTP } = request.params;

      const companyId = await client.get(`companyId:${OTP}`);

      if (!companyId) {
        return wrapper.response(response, 400, "Wrong Input OTP", null);
      }

      const result = [{ companyId }];

      const setStatus = {
        status: "active",
      };
      await authCompanyModel.updateCompany(companyId, setStatus);

      return wrapper.response(response, 200, "Verify Success ", result);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      const checkEmail = await authCompanyModel.getCompanyByEmail(email);

      if (checkEmail.data.length < 1) {
        return wrapper.response(response, 404, "Email Not Registered", null);
      }
      const isValid = await bcrypt
        .compare(password, checkEmail.data[0].password)
        .then((result) => result);
      if (!isValid) {
        return wrapper.response(response, 400, "Wrong Password", null);
      }

      if (checkEmail.data[0].status !== "active") {
        return wrapper.response(
          response,
          400,
          "Please Activate Your Account",
          null
        );
      }

      const payload = {
        userId: checkEmail.data[0].companyId,
        role: !checkEmail.data[0].role ? "company" : checkEmail.data[0].role,
      };

      const token = jwt.sign(payload, process.env.ACCESS_KEYS, {
        expiresIn: "24h",
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_KEYS, {
        expiresIn: "36h",
      });
      const newResult = {
        companyId: checkEmail.data[0].companyId,
        token,
        refreshToken,
      };
      return wrapper.response(response, 200, "Success Login", newResult);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshtoken } = request.headers;
      [token] = [token.split(" ")[1]];

      client.setEx(`accessToken:${token}`, 3600 * 48, token);
      client.setEx(`refreshoken:${refreshtoken}`, 3600 * 48, refreshtoken);

      return wrapper.response(response, 200, "Success Logout", null);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  refresh: async (request, response) => {
    try {
      const { refreshtoken } = request.headers;
      if (!refreshtoken) {
        return wrapper.response(
          response,
          400,
          "Request Token Must Be Filled",
          null
        );
      }

      const checkTokenBlacklist = await client.get(
        `refreshtoken:${refreshtoken}`
      );

      if (checkTokenBlacklist) {
        return wrapper.response(
          response,
          403,
          "Your Token is Destroyed Pleease Login Again",
          null
        );
      }

      let payload;
      let token;
      let newRefreshtoken;

      jwt.verify(refreshtoken, process.env.REFRESH_KEYS, (error, result) => {
        if (error) {
          return wrapper.response(response, 401, error.message, null);
        }
        payload = {
          companyId: result.companyId,
          role: result.role,
        };

        token = jwt.sign(payload, process.env.ACCESS_KEYS, {
          expiresIn: "24h",
        });

        newRefreshtoken = jwt.sign(payload, process.env.REFRESH_KEYS, {
          expiresIn: "36h",
        });

        client.setEx(`refreshtoken:${refreshtoken}`, 3600 * 36, refreshtoken);
        const newResult = {
          companyId: payload.companyId,
          token,
          refreshtoken: newRefreshtoken,
        };

        return wrapper.response(
          response,
          200,
          "Succes Refresh Token",
          newResult
        );
      });
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  forgotPassword: async (request, response) => {
    try {
      const { email } = request.body;
      const checkEmail = await authCompanyModel.getCompanyByEmail(email);

      if (checkEmail.length < 1) {
        return wrapper.response(response, 400, "Email Not Registered", null);
      }

      const { companyId } = checkEmail.data[0];
      const { name } = checkEmail.data[0];

      const OTPReset = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      client.setEx(`companyId:${OTPReset}`, 36000 * 48, companyId);

      const setMailOptions = {
        to: email,
        name,
        subject: "Email Verification !",
        template: "verificationResetPassword.html",
        buttonUrl: `https://hireme-fwb10.netlify.app/resetPasswordCompany/${OTPReset}`,
        // buttonUrl: `http://localhost:3000/api/authCompany/resetPassword/${OTPReset}`,
      };

      await sendMailToResetPassword(setMailOptions);
      const result = [{ email: checkEmail.data[0].email }];

      return wrapper.response(
        response,
        200,
        "Process Success Please Check Your Email",
        result
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
  resetPassword: async (request, response) => {
    try {
      const { OTPReset } = request.params;
      const { newPassword, confirmPassword } = request.body;

      const companyId = await client.get(`companyId:${OTPReset}`);

      if (!companyId) {
        return wrapper.response(response, 400, "Wrong Input OTPReset", null);
      }

      const checkId = await authCompanyModel.getCompanyById(companyId);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${companyId} Not Found`,
          []
        );
      }

      if (newPassword !== confirmPassword) {
        return wrapper.response(response, 400, "Password Not Match", null);
      }

      const hash = bcrypt.hashSync(newPassword, 10);
      const setData = {
        password: hash,
        updated_at: "now()",
      };
      await authCompanyModel.updateCompany(companyId, setData);

      const company = await authCompanyModel.getCompanyById(companyId);
      const result = [{ companyId: company.data[0].companyId }];

      return wrapper.response(response, 200, "Success Reset Password ", result);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  hire: async (request, response) => {
    try {
      const { userId } = request.params;
      const checkUserId = await userModel.getUserByIDs(userId);

      if (checkUserId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `user with id: ${userId} Not Found`,
          []
        );
      }

      const { name } = checkUserId.data[0];
      const setMailOptions = {
        to: checkUserId.data[0].email,
        name,
        subject: "congratulations !",
        template: "greetings.html",
      };

      await hiredGreetings(setMailOptions);

      const newResult = [{ userId: checkUserId.data[0].userId }];

      return wrapper.response(
        response,
        200,
        `Success send Email to user id : ${userId}`,
        newResult
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
