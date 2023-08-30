const passport = require('passport')
const GithubStrategy =require('passport-github2')
const passportLocal = require('passport-local')
const userModel = require('../dao/models/userModel')
const { createHash, isValidPassword } = require('../utils/passwordHash')

const LocalStrategy = passportLocal.Strategy

const initializePassport = () => {
    passport.use('github',new GithubStrategy({
        clientID:' Iv1.35f480523459289a',
        clientSecret:'fe23b9a92bdf57fc37dbe19091d6f705e8de408a',
        callbackURL:'http://localhost:8080/api/session/github-callback'
    },(accessToken,refreshToken,profile,done)=>{
        console.log({profile});
        return done(null,{
            name :'Fati'
        })

    }
    ))
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })

                if (user) {
                    console.log('Usuario ya existe')
                    return done(null, false)
                }

                const body = req.body
                body.password = createHash(body.password)
                console.log({ body })

                const newUser = await userModel.create(body)

                return done(null, newUser)
            } catch (e) {
                return done(e)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                console.log(email,password);
                let user = await userModel.findOne({ email: email })
                console.log(user);

                if (!user) {
                    console.log('El usuario no existe en el sistema')
                    return done(null, false)
                }

                if (!isValidPassword(password, user.password)) {
                    console.log('Datos incorrectos')
                    return done(null, false)
                }

                user = user.toObject()

                delete user.password

                done(null, user)
            } catch (e) {
                return done(e)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        console.log('serializeUser')
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        console.log('deserializeUser')
        const user = await userModel.findOne({_id:id})
        done(null, user)
    })
}

module.exports = initializePassport
