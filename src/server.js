const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http'); // Agrega esta línea
const ioInit = require('./utils/io'); // Cambia el nombre del archivo

const cookieParser = require('cookie-parser');
const multer = require('multer');
const passport = require('passport');
const flash = require('connect-flash');
const { generateToken, verifyToken } = require('./utils/jwt');

const initializePassport = require('./config/passport.config');

const MONGODB_CONNECT = `mongodb+srv://melgarejofatimacarolina:8g3ZKFx4JtMWDIRS@cluster0.rhfgipr.mongodb.net/ecommerce?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_CONNECT)
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch((error) => {
    if (error) {
      console.log('Error al conectarse a la base de datos', error.message)
    }
  });

const app = express();

app.use(cookieParser('secretkey'));

app.use(session({
  store: MongoStore.create({
    mongoUrl: MONGODB_CONNECT,
  }),
  secret: 'secretSession',
  resave: true,
  saveUninitialized: true,
}));

initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploader/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploader = multer({ storage: storage });

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

const httpServer = http.createServer(app);
const io = ioInit(httpServer); // Inicializa Socket.io con el servidor HTTP

const sessionRouter = require('./routers/sessionRouter');
const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');
const viewsRouter = require('./routers/viewsRouter');

app.use('/api/sessions', sessionRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.get('/healthCheck', (req, res) => {
  res.json({
    status: 'running',
    date: new Date(),
  });
});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Servidor express escuchando en el puerto ${PORT}`);
});

module.exports = io;
