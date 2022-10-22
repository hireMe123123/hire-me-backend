const supabase = require("../config/supabase");

module.exports = {
  getCountDataUser: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .select("*", { count: "exact" })
        .then((result) => {
          if (result.data) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllUsers: (offset, limit, typeJob, skills) =>
    new Promise((resolve, reject) => {
      const query = supabase
        .from("user_with_skills")
        .select("* ,userSkill(userSkillId,skill)")
        .range(offset, offset + limit - 1)
        .order("totalskills", { ascending: false });

      if (skills) {
        query.ilike("skills", `%${skills}%`);
      }

      if (typeJob) {
        query.eq("typeJob", typeJob);
      }

      query.then((result) => {
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
        .from("users")
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
        .from("users")
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
        .from("users")
        .select("*")
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
        .from("users")
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
        .from("users")
        .update([updateData])
        .select("*")
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
        .from("users")
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
        .from("users")
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
        .from("users")
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
  getSkillUser: (userId, skill) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .select(" skill ,user(userId,name)")
        .eq("userId", userId)
        .eq("skill", skill)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateUserSkill: (userId, skills) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .eq("userId", userId)
        .eq("skills", skills)
        .update([{ skills: [skills] }])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
