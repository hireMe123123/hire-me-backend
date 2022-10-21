const supabase = require("../config/supabase");

module.exports = {
  getAllUsers: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("userId, name, phoneNumber, email")
        // .select("*")
        .then((result) => {
          if (result.error) {
            reject(result);
          } else {
            resolve(result);
          }
        });
    }),
  checkDataUser: (email) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("userId, email, password")
        .eq("email", email)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  registerUser: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .insert([data])
        .select("userId")
        .then((result) => {
          if (result.error) {
            reject(result);
          } else {
            resolve(result);
          }
        });
    }),
  getUserByIDs: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select(
          "userId,name, profession, domicile, phoneNumber, image, email, typeJob, instagram, github, gitlab, description, created_at"
        )
        .eq("userId", id)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteUser: (userId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .delete()
        .eq("userId", userId)
        .select(
          "userId,name, profession, domicile, phoneNumber, image, email, typeJob, instagram, github, gitlab, description, created_at"
        )
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateDataUser: (id, updateData) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .update([updateData])
        .select(
          "userId, name, profession, domicile ,phoneNumber,typeJob,instagram, github, gitlab, description, updated_at"
        )
        .eq("userId", id)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateImageUser: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .update([data])
        .select("userId, image, created_at, updated_at")
        .eq("userId", id)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getPassWordById: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("password")
        .eq("userId", id)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updatePassword: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .update([data])
        .select("userId, created_at, updated_at")
        .eq("userId", id)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createUserSkill: (userId, skill) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .insert([{ userId, skill }])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getSkillUser: (userId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select(`userId, name,  userSkill ( skill )`)
        .eq("userId", userId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
