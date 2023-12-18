const { createHash, passwordValidation }=require("../utils/passwordHash.js");
const jwt =require('jsonwebtoken') ;
const UserDTO =require('../DTO/userDTO.js');
const UserService = require("../services/userService.js");

const userService = new UserService();

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        const exists = await userService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await userService.registerUser(user);
        console.log(result);

        // Envía una respuesta al cliente
        res.send({ status: "success", payload: result ? result._id : null });
    } catch (error) {
        console.error('Error en el controlador de registro:', error);

        // Envía una respuesta de error al cliente
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
};



const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ status: "error", error: "Incomplete values" });
    }
  
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).send({ status: "error", error: "User doesn't exist" });
    }
  
    try {
      const isValidPassword = await passwordValidation(user, password);
  
      if (!isValidPassword) {
        return res.status(400).send({ status: "error", error: "Incorrect password" });
      }
  
      const userDto = UserDTO.getUserTokenFrom(user);
      const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
      res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" });
    } catch (error) {
      console.error('Error in login controller:', error);
      res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
  };
  
const current = async(req,res) =>{
    const cookie = req.cookies['coderCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}

const unprotectedLogin  = async(req,res) =>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await userService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});
    res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
}
const unprotectedCurrent = async(req,res)=>{
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}
module.exports= {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}