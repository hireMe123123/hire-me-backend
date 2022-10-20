const supabase = require("../config/supabase");

module.exports = {
  getSkillId: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .select("userSkillId, user(name), skill(skillName)")
        .eq("userid", id)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getCountDataSkill: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllSkill: (offset, limit, searchName, column, typeJob) =>
    new Promise((resolve, reject) => {
      supabase
        .from("userSkill")
        .select("userSkillId, user(name, typeJob), skill(skillName)")
        .range(offset, offset + limit - 1)
        .ilike(`${column}`, `%${searchName}%`)
        .eq("typeJob", typeJob)
        .then((result) => {
          if (result.data) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
