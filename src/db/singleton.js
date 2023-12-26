const mongoose = require('mongoose');

class MongoSingleton {
  static instance;

  constructor(settings) {
    // Configura la cadena de conexión utilizando las variables de entorno
    const MONGODB_CONNECT = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@${process.env.db_host}/${process.env.db_name}?retryWrites=true&w=majority`;

    mongoose.connect(MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => {
        console.log(`Conectado a la base de datos ${process.env.db_name}`);
      })
      .catch(error => {
        console.error('Error al conectar a la base de datos:', error);
      });
  }

  static getConnection(settings) {
    if (this.instance) {
      console.log('Ya existe una conexión a la base de datos');
      return this.instance;
    }

    this.instance = new MongoSingleton(settings);
    return this.instance;
  }
}

module.exports = MongoSingleton;



