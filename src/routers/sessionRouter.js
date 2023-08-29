

const express = require("express");
const passport = require("passport");
const userModel = require("../dao/models/userModel");
const { createHash, isValidPassword } = require("../utils/passwordHash");
const UserModel = require("../dao/models/userModel");

const sessionRouter = express.Router();

// Ruta para verificar la sesión
sessionRouter.get("/", (req, res) => {
  if (!req.session.counter) {
    req.session.counter = 1;
    req.session.name = req.query.name;
    return res.json(`Bienvenido ${req.session.name}`);
  } else {
    req.session.counter++;
    return res.json(
      `${req.session.name} has visitado la página ${req.session.counter} veces`
    );
  }
});

sessionRouter.post('/register', 
  passport.authenticate('register', { failureRedirect: '/failregister' }), 
  async (req, res) => {
   const{email,password} =req.body;
   if (!email || !password) return res.status(400).send({ error: "Missing email or password" });

   let user ={
  _name,
  email,
  rol,
  password:createHash(password)
 
  }


    /*if (req.query.client === 'view') {
      return res.redirect('/login')
    }*/

    //return res.redirect('/login')

    return res.status(201).json(req.user)
  })

sessionRouter.get('/failregister', (req, res) => {
  return res.json({
    error: 'Error al registrarse'
  })
})

sessionRouter.get('/faillogin', (req, res) => {
  return res.json({
    error: 'Error al iniciar sesión'
  })
})

sessionRouter.post('/login', 
passport.authenticate('login', { failureRedirect: '/faillogin' }), 
async (req, res) => {
 const{email,password}=req.body;
 if(!email || !password) return res.status(400).send({status:'error',error:"datos incorrectos"})
const user = await UserModel.findOne({email:email},{email:1,password:1})
if(!user) return res.status(400).send({status:'error',error:'Usuario no encontrado'})
if(!isValidPassword(user,password))return res.status(403).send({status:'error',error:'password incorrecto'})
  user = user.toObject()

  delete user.password

  req.session.user = user

  //return res.json(user)

  console.log({
    user: req.user,
    session: req.session
  })
  
  return res.json(req.user)
})

sessionRouter.post('/recovery-password', async (req, res) => {

  let user = await userModel.findOne({ email: req.body.email })

  if (!user) {
    return res.status(401).json({
      error: 'El usuario no existe en el sistema'
    })
  }

  const newPassword = createHash(req.body.password)
  await userModel.updateOne({ email: user.email }, { password: newPassword })

  return res.redirect('/login')

})

module.exports = sessionRouter
