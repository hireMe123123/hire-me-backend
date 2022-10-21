const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const client = require("../config/redis");
const authCompanyModel = require("../models/authCompany");
const wrapper = require("../utils/wrapper");
const { sendMail } = require("../utils/mail");

module.exports = {
  register: async (request, response) => {
    try {
      const { name, email, field, phonenumber, password, confirmPassword } =
        request.body;

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

      const setData = {
        name,
        email,
        // password: hash,
        phonenumber,
        field,
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
        buttonUrl: `http://localhost:3001/api/authCompany/verify/${OTP}`,
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
      console.log(error);
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
        return wrapper.response(response, 404, "Email Not Registed", null);
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
};
