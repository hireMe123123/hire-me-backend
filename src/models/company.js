const supabase = require("../config/supabase");

module.exports = {
  createCompany: (data) =>
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
  getCompanyById: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("company")
        .select("*")
        .eq("companyId", id)
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
  deleteCompany: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("company")
        .delete()
        .eq("companyId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
