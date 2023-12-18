const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const userSchema = Schema({
  name: String,
  lastname: String,
  username: {
    type: String,
    unique: true,
    require:true
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
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts'
  }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel; 


