const supabase = require("../config/supabase");

module.exports = {
  createCompany: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("company")
        .insert([data]) // insert([{name: "Tea", price: 5000}])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
