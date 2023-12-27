const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http'); 
const ioInit = require('./utils/io'); 
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const passport = require('passport');
const flash = require('connect-flash');
const { generateToken, verifyToken } = require('./utils/jwt');
const twilio = require('twilio');
const addLogger = require('./utils/logger');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const { Command } = require('commander');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./utils/config');
const DB = require('./db/singleton');

// Inicializar estrategias
const initializeGitHubStrategy = require('./config/github.Stategy');
const initializeLocalRegisterStrategy = require('./config/local.Strategy');
const initializeLocalLoginStrategy = require('./config/local.login.Strategy');
const { initializeJWTStrategy, passportCall } = require('./config/jwt.Strategy');


initializeGitHubStrategy();
initializeLocalRegisterStrategy();
initializeLocalLoginStrategy();
initializeJWTStrategy();

const initializePassport = require('./config/passport.config');
const program = new Command();

program
  .option('--mode <mode>', 'Modo de trabajo', 'dev');

program.parse();

const options = program.opts();

dotenv.config({
  path: `.env.${options.mode}`,
});

const settings = config();

const PORT = process.env.PORT || 8080;
mongoose.set('strictQuery', true)
const dbConnection = DB.getConnection(settings);

const app = express();
app.use(addLogger);

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

initializePassport(passport);
//app.use(passportCall('jwt'));//

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

// Configuración handlebars
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'src', 'views'));
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


const httpServer = http.createServer(app);
const io = ioInit(httpServer); // Inicializa Socket.io con el servidor HTTP

const sessionRouter = require('./routers/sessionRouter');
const usersRouter = require('./routers/userRouter');
const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');
const viewsRouter = require('./routers/viewsRouter');
const { Db } = require('mongodb');
   
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter.router);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/carts', cartsRouter);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.get('/mail', async (req, res) => {
  try {
    let result = await transporter.sendMail({
      from: 'Test Coder <faticarolinamelgarejo2@gmail.com>',
      to: 'faticarolinamelgarejo2@gmail.com',
      subject: 'Test',
      html: `
        <div>
          <h1>Bienvenido al mejor Ecommerce!!</h1>
          <div>
            <h1>Aqui con una imagen!!</h1>
            <img src='cid:ecommerce' alt='Ecommerce Image' />
          </div>
        </div>
      `,
      attachments: [{
        filename: 'ecommerce.png',
        path: path.join(process.cwd(), 'public', 'img', 'ecommerce.png'),
        cid: 'ecommerce',
      }],
    });

    res.send({ status: 'success', result: 'mail enviado' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).send({ status: 'error', error: 'Error al enviar el correo' });
  }
});

const TWILIO_ACCOUNT_SID = 'ACdd88dbcde04ebf02c471c6ee5521d493';
const TWILIO_AUTH_TOKEN = '9f39faf64452b7e72581b4c733829aab';
const TWILIO_PHONE_NUMBER = '+14125047634';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.get('/sms', async (req, res) => {
  let result = await client.messages.create({
    body: 'Este es un mensaje de Ecommerce',
    from: TWILIO_PHONE_NUMBER,
    to: '+54 11 2875 1525',
  })
  res.send({ status: 'success', result: 'Mensaje enviado' })
});

app.get('/healthCheck', (req, res) => {
  res.json({
    status: 'running',
    date: new Date(),
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).send('Error interno del servidor');
});



httpServer.listen(PORT, () => {
  console.log(`Servidor express escuchando en el puerto ${PORT}`);
});

module.exports = io;
