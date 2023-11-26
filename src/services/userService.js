// services/userService.js
const UserDao = require('../DAOs/userDaos');
const { createHash, isValidPassword } = require('../utils/passwordHash');
const { generateToken } = require('../utils/jwt');

class UserService {
  constructor() {
    this.userDao = new UserDao();
  }

  async registerUser(userData) {
    const existingUser = await this.userDao.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const hashedPassword = createHash(userData.password);
    const newUser = {
      ...userData,
      password: hashedPassword,
      username: userData.email,
      isAdmin: userData.isAdmin || false,
    };

    await this.userDao.createUser(newUser);
  }

  async loginUser(email, password) {
    const user = await this.userDao.findByEmail(email);

    if (!user || !isValidPassword(password, user.password)) {
      throw new Error('Credenciales incorrectas');
    }

    return {
      user: {
        name: user.name,
        email: user.email,
        // Otros campos según sea necesario
      },
      token: generateToken({
        name: user.name,
        email: user.email,
      }),
    };
  }

  async getAllUsers() {
    return this.userDao.getUsers();
  }

  async getUserById(userId) {
    return this.userDao.getUserById(userId);
  }

  async updateUser(userId, userData) {
    return this.userDao.updateUser(userId, userData);
  }

  async deleteUser(userId) {
    return this.userDao.deleteUser(userId);
  }
}

module.exports = UserService;

