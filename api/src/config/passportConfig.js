const { User } = require('../db.js');
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
require('dotenv').config();


module.exports = function (passport)  {
  passport.use(
    new LocalStrategy({_usernameField: "email"}, (email, password, done) => {
      User.findOne({
        where: {email: email}
      }).then(user => {
        if (!user) {
          return done(null, false)
        }
        
          if (bcrypt.compare(password, user.password)) {
            return done(null, false);
          }
        
        return done(null, user);
      }).catch(err => {
        return done(err);
      })
    }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findByPk(id)
      .then((user) => {
        done(null, user);
      })
      .catch(err => {
        return done(err);
      })
  })
  
  
}

