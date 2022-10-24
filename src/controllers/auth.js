const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const client = require("../config/redis");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");
const { sendMail, sendMailToResetPassword } = require("../utils/mail");

module.exports = {
  register: async (request, response) => {
    try {
      const { name, email, phoneNumber, password, confirmPassword } =
        request.body;

      // PROSES PENGECEKAN APAKAH EMAIL YANG MAU DI DAFTARKAN SUDAH ADA ATAU BELUM ?
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length > 0) {
        return wrapper.response(response, 403, "Email Alredy Registered", null);
      }

      // PROSES VALIDASI PASSWORD
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
        phoneNumber,
      };

      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      await authModel.register(setData);
      const user = await authModel.getUserByEmail(email);
      const newResult = [{ userId: user.data[0].userId }];

      // GENERATE OTP
      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      client.setEx(`OTP:${OTP}`, 3600, OTP);
      client.setEx(`userId:${OTP}`, 3600 * 48, user.data[0].userId);

      // SEND EMAIL ACTIVATION
      const setMailOptions = {
        to: email,
        name,
        subject: "Email Verification !",
        template: "verificationEmail.html",
        buttonUrl: `https://hire-me-backend.vercel.app/api/auth/verify/${OTP}`,
        // buttonUrl: `http://localhost:3001/api/auth/verify/${OTP}`,
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
      console.log(error);
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

      const userId = await client.get(`userId:${OTP}`);
      // const cehckOTP = await client.get(`OTP:${OTP}`);
      if (!userId) {
        return wrapper.response(response, 400, "Wrong Input OTP", null);
      }

      const result = [{ userId }];

      const setStatus = {
        status: "active",
      };
      await authModel.updateUser(userId, setStatus);

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

      // 1. PROSES PENGECEKAN EMAIL
      const checkEmail = await authModel.getUserByEmail(email);

      if (checkEmail.data.length < 1) {
        return wrapper.response(response, 404, "Email Not Registed", null);
      }

      // 2. PROSES PENCOCOKAN PASSWORD
      const isValid = await bcrypt
        .compare(password, checkEmail.data[0].password)
        .then((result) => result);
      if (!isValid) {
        return wrapper.response(response, 400, "Wrong Password", null);
      }

      // CEK STATUS ACCOUNT

      if (checkEmail.data[0].status !== "active") {
        return wrapper.response(
          response,
          400,
          "Please Activate Your Account",
          null
        );
      }

      const payload = {
        userId: checkEmail.data[0].userId,
        role: !checkEmail.data[0].role ? "user" : checkEmail.data[0].role,
      };

      const token = jwt.sign(payload, process.env.ACCESS_KEYS, {
        expiresIn: "24h",
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_KEYS, {
        expiresIn: "36h",
      });

      // 4. PROSES RESPON KE USER
      const newResult = {
        userId: checkEmail.data[0].userId,
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
  // eslint-disable-next-line consistent-return
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
          userId: result.userId,
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
          userId: payload.userId,
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
      const checkEmail = await authModel.getUserByEmail(email);

      if (checkEmail.length < 1) {
        return wrapper.response(response, 400, "Email Not Registered", null);
      }
      const { userId } = checkEmail.data[0];
      const { name } = checkEmail.data[0];

      const OTPReset = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      client.setEx(`userId:${OTPReset}`, 36000 * 48, userId);

      const setMailOptions = {
        to: email,
        name,
        subject: "Email Verification !",
        template: "verificationResetPassword.html",
        buttonUrl: `https://hireme-fwb10.netlify.app/resetpassword/1`,
        // buttonUrl: `http://localhost:3001/api/auth/resetPassword/${OTPReset}`,
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

      const userId = await client.get(`userId:${OTPReset}`);

      if (!userId) {
        return wrapper.response(response, 400, "Wrong Input OTPReset", null);
      }

      const checkId = await authModel.getUserById(userId);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${userId} Not Found`,
          []
        );
      }

      // CONFIRM NEWPASSWORD
      if (newPassword !== confirmPassword) {
        return wrapper.response(response, 400, "Password Not Match", null);
      }

      // HASH PASSWORD
      const hash = bcrypt.hashSync(newPassword, 10);
      const setData = {
        password: hash,
        updated_at: "now()",
      };
      await authModel.updateUser(userId, setData);

      const user = await authModel.getUserById(userId);
      const result = [{ userId: user.data[0].userId }];

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
};
