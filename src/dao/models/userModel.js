const { Schema, model } = require('mongoose');

const userSchema = Schema({
  name: String,
  lastname: String,
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false // Por defecto, un usuario no es administrador
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('users', userSchema);


