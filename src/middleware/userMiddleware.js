const UsersService = require("../services/userService");
const { verifyToken } = require("../utils/jwt");

class UserMiddleware {
  constructor() {
    this.service = new UsersService();
  }

  // Middleware para verificar la autenticación del usuario
  async isAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Necesitas autenticarte'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = await verifyToken(token);
      const user = await this.service.get(payload.userId);

      if (!user) {
        return res.status(401).json({
          error: 'Token inválido'
        });
      }

      req.user = user;
      return next();
    } catch (e) {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }
  }

  // Middleware para verificar el rol del usuario
  hasRole(...roles) {
    return (req, res, next) => {
      const isValidRole = roles.includes(req.user.role);

      if (!isValidRole) {
        return res.status(403).json({
          error: 'No tienes permiso para realizar esta acción'
        });
      }

      return next();
    };
  }
}

module.exports = UserMiddleware;

