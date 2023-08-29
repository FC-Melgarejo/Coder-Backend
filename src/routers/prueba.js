const bcrypt = require('bcrypt');
const { createHash, isValidPassword } = require('../utils/passwordHash'); // Reemplaza con la ruta correcta a tu módulo

// Ejemplo de contraseña en texto plano
const plainPassword = 'password123';

// Crear un hash de la contraseña en texto plano
const hashedPassword = createHash(plainPassword);

// Simular un inicio de sesión proporcionando la contraseña en texto plano y el hash almacenado en la base de datos
const isPasswordValid = isValidPassword(plainPassword, hashedPassword);

// Verificar si la contraseña es válida
if (isPasswordValid) {
  console.log('La contraseña es válida.');
} else {
  console.log('La contraseña no es válida.');
}
