const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies['coderCookie'];

  if (!token) {
    return res.status(401).send({ status: 'error', error: 'No token provided' });
  }

  jwt.verify(token, 'tokenSecretJWT', (err, user) => {
    if (err) {
      return res.status(403).send({ status: 'error', error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

