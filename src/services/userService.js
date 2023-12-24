const User = require('../dao/models/userModel');
const UserDao = require('../DAOs/userDaos');
const { createHash, isValidPassword } = require('../utils/passwordHash');
const { generateToken } = require('../utils/jwt');



class UserService {
  constructor() {
    console.log("UserService initialized");
    this.UserModel = User;
    this.userDao = new UserDao(); // Asigna el modelo User a this.UserModel
  }

  async createUser(user) {
      try {
        console.log('Creating user with data:', user);
        const newUser = new this.UserModel(user);
        const savedUser = await newUser.save();
        return savedUser;
      } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
      }
    }
    
  

    async registerUser(userData) {
      try {
        const existingUser = await this.UserModel.findOne({ email: userData.email });
    
        if (existingUser) {
          throw new Error('El usuario ya existe');
        }
    
        const hashedPassword = createHash(userData.password);
        const newUser = {
          ...userData,
          password: hashedPassword,
          username: userData.username || userData.email, // Usar otro campo o el correo electrónico si es necesario
          isAdmin: userData.isAdmin || false,
          role: userData.role || 'Buyer'
        };
    
        await this.createUser(newUser);
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
      }
    }
    
  
  
  
  

  async loginUser(email, password) {
    const user = await this.userDao.getUserById(email);

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
  async getUserByEmail(email) {
    const user = await this.userDao.getUserByEmail(email);
    return user;
  }
  async getUserByEmail(email) {
    try {
      const user = await this.UserModel.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error al obtener usuario por correo electrónico:', error);
      throw error;
    }
  }
  

 

}


module.exports = UserService;

