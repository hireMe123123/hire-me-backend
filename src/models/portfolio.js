const supabase = require("../config/supabase");

module.exports = {
  createPortfolio: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("portofolio")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getPortfolioByUserId: (userId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("portofolio")
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
  getPortfolioById: (portofolioId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("portofolio")
        .select(`*`)
        .eq("portofolioId", portofolioId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deletePortfolio: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("portofolio")
        .delete()
        .eq("portofolioId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updatePortfolio: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("portofolio")
        .update(data)
        .eq("portofolioId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
