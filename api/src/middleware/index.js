const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../db.js');
const authConfig = require('../config/auth');
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook').Strategy


//para guardar los datos del usuario autenticado se guarda una session para eso se debe
// que serializar y deserializar los datos del usuario que esta logueado


passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    /* const exist = await User.findOne({ where: { email: email } })
    if (exist) {
        return done(null, false, { message: 'Email Already Exist' })
    } else { */
        try {
            const user = await User.create({
                email,
                password,
                fullname: req.body.fullname,
                rol:req.body.rol,
                reset: null,
                banned: false
            })
            return done(null, user)
        } catch (e) {
            done(e)
        }
  //  }


}))
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            return done(null, false, { message: 'User not found' })
        }
        const validate = await user.validPassword(password)
        if (!validate) {
            return done(null, false, { message: 'Wrong password' })
        }
        if(user.banned){
            return done(null, false, { message: 'Este usuario ha sido bloqueado' })
        }
        return done(null, user, { message: 'Login successfull' })
    } catch (e) {
        return done(e)
    }
}))

passport.use(
  new GoogleStrategy({
        callbackURL: `${process.env.APP_URL}/auth/google/redirect`,
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
    },
    (accessToken, refreshToken, profile, done)=>{
        User.findOne({
            where: {
                email: profile.emails[0].value,
            },
        })
          .then(user => {
              if(user){
                return done(null, user)
              }else{
                  User.create({ //creo que no deberíamos crear cuenta
                      email: profile.emails[0].value,
                      password: '',
                      fullname: profile.displayName,
                      rol: "User",
                      reset: null,
                      banned: false
                  }).then(newUser => {
                      done(null, newUser)
                  }).catch(err =>{
                      return done(err)
                  })
              }
          })
          .catch(err =>{
            return done(err)
        })
        
    })
);

passport.use(
    new FacebookStrategy({
          callbackURL: `${process.env.APP_URL}/auth/facebook/callback`,
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          profileFields: ['id', 'emails', 'name']
      },
      (accessToken, refreshToken, profile, done)=>{
          User.findOrCreate({
              where: {
                  email: profile.emails[0].value,
              },
                defaults: {
                    email: profile.emails[0].value,
                    fullname: profile.name.givenName,
                    password: '',
                    rol: "User",
                    reset: null,
                    banned: false
                }
          })
            .then(newUser => {
              done(null, newUser)
          })
            .catch(err =>{
            return done(err)
          })
    })
)

