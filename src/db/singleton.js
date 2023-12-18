const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

class MongoSingleton {
  static instance;

  constructor(settings) {
    const MONGODB_CONNECT = `mongodb+srv://${settings.db_user}:${settings.db_password}@${settings.db_host}/${settings.db_name}?retryWrites=true&w=majority`;

    mongoose.connect(MONGODB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });

    this.store = MongoStore.create({
      mongoUrl: MONGODB_CONNECT,
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60, // 2 weeks
    });
  }

  static getConnection(settings) {
    if (this.instance) {
      console.log('Ya existe una conexión a la base de datos');

      return this.instance;
    }

    this.instance = new MongoSingleton(settings);
    console.log(`conectado a la base de datos ${settings.db_name}`);

    return this.instance;
  }
}

module.exports = MongoSingleton;


