const e = require('connect-flash')
const jwt = require('jsonwebtoken')

const PRIVATE_KEY = 'jwtsecret'

const generateToken = (payload) =>{
  const token = jwt.sign({user:payload}, PRIVATE_KEY, {expiresIn: '24h'} )

  return token
}

const verifyToken = (token) =>{

  return new Promise((resovle,rejet)=>{
    jwt.verify(token,PRIVATE_KEY, (err,payload)=>{
      if(err){
        return rejet(err)
      }
      return resovle(payload)
    })

  })

}
module.exports = {
  generateToken,
  verifyToken

}