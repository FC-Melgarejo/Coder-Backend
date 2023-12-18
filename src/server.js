const express = require('express');
const session = require('express-session');
const path = require('path');
const cors =require('cors')
const MongoStore = require('connect-mongo');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http'); 
const ioInit = require('./utils/io'); 
const nodemailer =require('nodemailer')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const passport = require('passport');
const flash = require('connect-flash');
const { generateToken, verifyToken } = require('./utils/jwt');
const twilio =require('twilio');
const { addLogger }= require('./utils/logger') ;
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const dotenv = require('dotenv');
//const path = require('path');/


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
app.use(addLogger);
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
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación de usuarios',
      description: 'API para gestión de ecomerce'
    }
  },
  apis: [
    `./docs/**/*.yaml`
  ]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions); 

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs));


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


/*console.log(process.env.NODE_ENV)
const file_path = `./.${process.env.NODE_ENV}.env`

console.log({ file_path })

dotenv.config({
  path: file_path
})*/

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
const usersRouter = require('./routers/userRouter');
const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');
const viewsRouter = require('./routers/viewsRouter');
   
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter);
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
    // Modificamos la construcción de la ruta aquí
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
        // Modificamos la construcción de la ruta aquí
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
})



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
