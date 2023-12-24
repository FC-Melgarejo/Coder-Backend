const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'http' }),
    new winston.transports.File({ filename: './errors.log', level: 'warn' })
  ]
});

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

// Exporta la función addLogger directamente
module.exports = addLogger;



