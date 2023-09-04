const userModel = require('./models/userModel');
const bcrypt = require('bcrypt');

class UserManager {
    constructor() {
        this.model = userModel;
    }

    async createUser(data) {
        try {
            if (
                !data.name ||
                !data.lastname ||
                !data.email ||
                !data.password
            ) {
                throw new Error('Todos los campos son obligatorios');
            }

            const hashedPassword = await createHash(data.password); // Cifra la contraseña
            const exist = await this.model.findOne({ email: data.email });

            if (exist) {
                throw new Error(`Ya existe un usuario con el email ${data.email}`);
            }

            await this.model.create({
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                password: hashedPassword, // Guarda la contraseña cifrada en la base de datos
                isAdmin: data.isAdmin || false,
            });
        } catch (error) {
            throw error;
        }
    }

    async authenticateUser(email, password) {
        try {
            const user = await this.model.findOne({ email });

            if (!user) {
                throw new Error(`El usuario con el email "${email}" no existe`);
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new Error('Los datos ingresados no son correctos');
            }

            const authenticatedUser = user.toObject();
            delete authenticatedUser.password;

            return authenticatedUser;
        } catch (error) {
            throw error;
        }
    }

    // Método para comprobar si un usuario es administrador
    async isAdmin(email) {
        try {
            const user = await this.model.findOne({ email });

            if (!user) {
                throw new Error(`El usuario con el email "${email}" no existe`);
            }

            return user.isAdmin || false;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserManager;




