const supabase = require("../config/supabase");

module.exports = {
  getCompanyByEmail: (email) =>
    new Promise((resolve, reject) => {
      supabase
        .from("company")
        .select("*")
        .eq("email", email)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  register: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("company")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateCompany: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("company")
        .update([data])
        .eq("companyId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getCompanyById: (companyId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("company")
        .select("*")
        .eq("companyId", companyId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
