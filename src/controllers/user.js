const userModels = require("../models/usermodels");
const cloudinary = require("../config/cloudinary");
const wrapper = require("../utils/wrapper");
const updateTime = require("../utils/updateTime");
const hashPass = require("../utils/hash");

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
      let { page, limit, typeJob } = request.query;

      page = +page || 1;
      limit = +limit || 5;

      if (typeJob === "") {
        typeJob = "freelance";
      }

      const totalData = await userModels.getCountDataUser();

      const totalPage = Math.ceil(totalData / limit);

      const pagination = {
        page,
        totalPage,
        limit,
        totalData,
      };
      const offset = page * limit - limit;

      const result = await userModels.getAllUsers(offset, limit, typeJob);
      return wrapper.response(
        response,
        result.status,
        "Success get data user",
        result.data,
        pagination
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
  updateUserData: async (request, response) => {
    try {
      const { id } = request.params;
      const {
        name,
        profession,
        domicile,
        phoneNumber,
        typeJob,
        instagram,
        github,
        gitlab,
        description,
        skill,
      } = request.body;

      const isFalid = await userModels.getUserByIDs(id);

      // const current = new Date();
      // const cDate = `${current.getFullYear()}-${
      //   current.getMonth() + 1
      // }-${current.getDate()}`;
      // const cTime = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
      // const dateTime = `${cDate} ${cTime}`;

      const dateTime = updateTime.dateTime();

      if (isFalid.data.length < 0) {
        return wrapper.response(response, 404, `User is not Found`, []);
      }
      const updateData = {
        name,
        profession,
        domicile,
        phoneNumber,
        typeJob,
        instagram,
        github,
        gitlab,
        description,
        updated_at: dateTime,
      };
      const result = await userModels.updateDataUser(id, updateData);
      const { userId } = result.data[0];

      const resultUserSkill = await Promise.all(
        skill.map(async (e) => {
          try {
            await userModels.createUserSkill(userId, e);
            return e;
          } catch (error) {
            return error.error;
          }
        })
      );
      const finalResult = { ...result.data[0], skill: resultUserSkill };

      return wrapper.response(
        response,
        result.status,
        "Success Update Profile",
        finalResult
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorUpdate = null,
      } = error;
      return wrapper.response(response, status, statusText, errorUpdate);
    }
  },
  updateUserImage: async (request, response) => {
    try {
      const { id } = request.params;
      const isFalid = await userModels.getUserByIDs(id);

      if (!request.file) {
        return wrapper.response(response, 400, "Image must be filled", null);
      }

      const { filename } = request.file;
      let newImages;

      if (isFalid.data.length < 1) {
        return wrapper.response(response, 404, `User is not Found`, []);
      }

      if (isFalid.data[0].image === null) {
        newImages = filename;
      }

      if (isFalid.data[0].image) {
        await cloudinary.uploader.destroy(isFalid.data[0].image);
        newImages = filename;
      }
      const dateTime = updateTime.dateTime();
      const inputData = {
        image: newImages,
        updated_at: dateTime,
      };

      const result = await userModels.updateImageUser(id, inputData);
      return wrapper.response(
        response,
        result.status,
        "Success Update Image Profile",
        result.data
      );
      // if (isFalid.data)
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorUpdate = null,
      } = error;
      return wrapper.response(response, status, statusText, errorUpdate);
    }
  },
  updatePassword: async (request, response) => {
    try {
      const { id } = request.params;
      const { oldPassword, newPassword, confirmPassword } = request.body;
      const isFalid = await userModels.getUserByIDs(id);
      if (isFalid.data.length < 1) {
        return wrapper.response(response, 404, `User is not Found`, []);
      }
      const getPass = await userModels.getPassWordById(id);
      const checkPassword = hashPass.checkPassword(
        oldPassword,
        getPass.data[0].password
      );
      if (checkPassword === false) {
        return wrapper.response(response, 401, `Please check old password`);
      }
      if (newPassword !== confirmPassword) {
        return wrapper.response(
          response,
          401,
          `New Password and Confirm Password did not match`
        );
      }
      const hasPassword = hashPass.hashPass(confirmPassword);
      const updatePassword = {
        password: hasPassword,
      };
      const result = await userModels.updatePassword(id, updatePassword);

      return wrapper.response(
        response,
        result.status,
        "Success Update password",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorUpdate = null,
      } = error;
      return wrapper.response(response, status, statusText, errorUpdate);
    }
  },
  getSkillUser: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await userModels.getSkillUser(userId);
      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Skill User By User Id ${userId} Not Found`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Skill User",
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
