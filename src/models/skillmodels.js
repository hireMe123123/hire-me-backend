const supabase = require("../config/supabase");

module.exports = {
  getSkillId: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .select("*")
        .eq("skillId", id)
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
  getDataSkill: (userId, skillId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .select("*")
        .eq("userId", userId)
        .eq("skillId", skillId)
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
  updateSkillName: (skillid, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("skill")
        .update([data])
        .select("*")
        .eq("skillId", skillid)
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
        .select("userSkillId, skill(skillName), user(userId)")
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
