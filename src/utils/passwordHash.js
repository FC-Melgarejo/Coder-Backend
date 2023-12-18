const bcrypt = require('bcrypt');

const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const isValidPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
}

const passwordValidation = (user, password) => {
  return bcrypt.compare(password, user.password);
};

module.exports = {
  createHash,
  isValidPassword,
  passwordValidation
};

