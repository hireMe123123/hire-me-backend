const supabase = require("../config/supabase");

module.exports = {
  getSkillId: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .select("*")
        .eq("userSkillId", id)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  inputDataSkill: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("skill")
        .insert([data])
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  inputDataUserSkill: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .insert([data])
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getDataSkill: (userId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .select("userId,name,userSkill(userSkillId,skill)")
        .eq("userId", userId)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteUserSkill: (userSkillid) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .delete()
        .eq("userSkillId", userSkillid)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteSkill: (skillId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("skill")
        .delete()
        .eq("skillId", skillId)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateSkillName: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .update([data])
        .eq("userSkillId", id)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getDataSkillName: (skillName) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .select("userSkillId, skill(skillName), users(userId)")
        .textSearch("skill.skillName", `${skillName}`)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
