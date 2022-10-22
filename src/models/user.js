const supabase = require("../config/supabase");

module.exports = {
  getAllUser: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .select("*,userSkill(*)")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getUserById: (userId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .select("*")
        .eq("userId", userId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createUser: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateUser: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .update(data)
        .eq("userId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteUser: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .delete()
        .eq("userId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateImageUser: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .update(data)
        .eq("userId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
