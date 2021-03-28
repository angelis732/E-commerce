const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const cors =require('cors');
const passport = require('passport')
const session = require('express-session');
const { User } = require('./db')
const configAuth = require('../src/config/auth')



require('./db.js');
require('./middleware/index')
const store = new session.MemoryStore;
const server = express();
server.use(cors());

server.name = 'API';

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(session({
  secret: configAuth.secret,
  resave:true,
  saveUninitialized:true,
}))


passport.serializeUser((user, done)=>{
  
  done(null, user);
})
passport.deserializeUser(async (user ,done)=>{
  done(null, user)
})


server.use(passport.initialize())
server.use(passport.session())
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.APP_URL); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


server.use('/', routes);

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
