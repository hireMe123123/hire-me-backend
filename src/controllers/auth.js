const bcrypt = require("bcrypt");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");

module.exports = {
  register: async (request, response) => {
    try {
      const { name, email, phoneNumber, password, confirmPassword } =
        request.body;

      console.log(request.body);
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

      // PROSES PENGECEKAN APAKAH EMAIL YANG MAU DI DAFTARKAN SUDAH ADA ATAU BELUM ?
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length > 0) {
        return wrapper.response(response, 403, "Email Alredy Registered", null);
      }

      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      const result = await authModel.register(setData);
      console.log(result);
      const newResult = [{ userId: result.data[0].userId }];

      // GENERATE OTP
      // const OTP = otpGenerator.generate(6, {
      //   upperCaseAlphabets: false,
      //   specialChars: false,
      //   lowerCaseAlphabets: false,
      // });

      // client.setEx(`OTP:${OTP}`, 3600, OTP);
      // client.setEx(`userId:${OTP}`, 3600 * 48, result.data[0].userId);

      // SEND EMAIL ACTIVATION
      // const setMailOptions = {
      //   to: email,
      //   name: username,
      //   subject: "Email Verification !",
      //   template: "verificationEmail.html",
      //   buttonUrl: `http://localhost:3001/api/auth/verify/${OTP}`,
      //   OTP,
      // };

      // await sendMail(setMailOptions);
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
};
