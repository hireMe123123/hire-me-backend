const supabase = require("../config/supabase");

module.exports = {
  createExperience: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("experience")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getExperienceByUserId: (userId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("experience")
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
  getExperienceById: (experienceId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("experience")
        .select(
          `user(userId),experience(experienceId,nameProject,projectRepo,image)`
        )
        .eq("experienceId", experienceId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteExperience: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("experience")
        .delete()
        .eq("experienceId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateExperience: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("experience")
        .update(data)
        .eq("experienceId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
