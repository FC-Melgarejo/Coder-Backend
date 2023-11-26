// controllers/users.controller.js
const UserService = require('../services/userService');

const userService = new UserService();

async function getUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserById(req, res) {
  const { userId } = req.params;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateUser(req, res) {
  const { userId } = req.params;
  const userData = req.body;
  try {
    const updatedUser = await userService.updateUser(userId, userData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  // Puedes agregar otras funciones según sea necesario
};
