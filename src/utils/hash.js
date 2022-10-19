const bcrypt = require("bcryptjs");

module.exports = {
  hashPass: (password) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    return hash;
  },
  checkPassword: (password, hash) => bcrypt.compareSync(password, hash),
};
