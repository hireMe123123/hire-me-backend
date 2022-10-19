const supabase = require("../config/supabase");

module.exports = {
  getAllUsers: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("userId, name, phoneNumber, email")
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
          "userId,name, profession, domisili, phoneNumber, image, email, typeJob, instagram, github, gitlab, description, createdAt"
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
          "userId,name, profession, domisili, phoneNumber, image, email, typeJob, instagram, github, gitlab, description, createdAt"
        )
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};