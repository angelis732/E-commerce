require('dotenv').config();
const { User, GlobalDiscount } = require('../db.js');
const server = require('express').Router();
const passport = require('passport')
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const protected = require('../middleware/protected')
var nodemailer = require('nodemailer');
const uuid = require('uuid');




server.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  try {
    const token = jwt.sign({
      id: req.user.id,
      fullname: req.user.fullname,
      rol: req.user.rol,
      email: req.user.email
    }, authConfig.secret)
    res.json(token)
  } catch (err) {
    res.status(400).send(err);
  }
});
server.post('/logout', protected.isAuth, (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.sendStatus(200);
  }
});

server.get('/me', protected.isAuth, (req, res) => {
  if (req.isAuthenticated()) return res.send(req.user);
  else return res.status(401).send('Debes Iniciar Sesion');
});

// PUT /auth/promote/:id de usuario
// Promote convierte al usuario con ID: id a Admin.
server.put('/promote/:id', protected.isAuthAdmin, (req, res) => {
  const { id } = req.params;
  User.findByPk(id)
    .then(user => {
      if (user.rol === "admin") {
        res.json("Este usuario ya es administrador")
      } else {
        user.update({
          rol: "admin"
        })
          .then(() => {
            res.status(200)
              .json("Usuario ha sido promovido a administrador")
          })
          .catch(err => {
            res.status(400)
              .send(`Error al cambiar a admin ${err}`)
          })
      }
    })
})

server.post('/:id/forceReset/',protected.isAuth, (req, res) =>{
	const {id} = req.params
	User.findByPk(id)
  
	.then(user =>{
    if(!user.reset){
      var id = uuid.v4();
      user.setDataValue('reset', id);
      user.save();
    }
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.AUTH_MAIL,
          pass: process.env.AUTH_PASS
        }
      })
		  transporter.sendMail({
			  from: process.env.AUTH_MAIL,
			  to: user.email,
			  subject: 'Cambiar tu contraseña',
			  text: `Por motivos de seguridad has click en el siguiente link para cambiar tu contraseña: \n${process.env.APP_URL}/user/resetPass/${user.dataValues.reset}`
		  },(error, info)=>{
			  if(error){(res.status(500).send("no se pudo enviar" + error)) }
			  else {
				res.status(200).send("Mail enviado" + info)
			  }
		  })
	}).catch(err => {
		res.status(400)
		.json("Este usuario no se encuentra registrado" + err)
	})
});


server.put('/:id/banned', protected.isAuthAdmin, function (req, res) {
  const { id } = req.params;
  User.findByPk(id)
    .then((user => {
      if (user.banned === false) {
        user.update(
          {
            banned: true,
          })
          .then(user => {
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.AUTH_MAIL,
                pass: process.env.AUTH_PASS
              }
            })
            transporter.sendMail({
              from: process.env.AUTH_MAIL,
              to: user.email,
              subject: 'Usuario Bloqueado',
              text: `Estimado Usuario: \nSu cuenta ha sido bloqueada por violación al código de conducta de nuestra página. \nsi crees que ha sido un error, porfavor comunícate con el administrador`
            }, (error, info) => {
              if (error) { (res.status(500).send("no se pudo enviar" + error)) }
              else {
                res.status(200).send("Mail enviado" + info)
              }
            })
          })
      } else {
        user.update(
          {
            banned: false,
          })
      }
    })
    )
    .then(() => {
      res.status(200).json("Estado de usuario ha sido modificado")
    })
    .catch(error => {
      res.status(400).send(`Error ${error}`);
    })
});

server.put('/demote/:id', protected.isAuthAdmin, (req, res) => {
  const { id } = req.params;
  User.findByPk(id)
    .then(user => {
      if (user.rol === "User") {
        res.json("Este usuario ya es usuario")
      } else {
        user.update({
          rol: "User"
        })
          .then(() => {
            res.status(200)
              .json("Usuario ha sido cambiado a usuario")
          })
          .catch(err => {
            res.status(400)
              .send(`Error al cambiar a usuario ${err}`)
          })
      }
    })
})



server.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));


server.post('/google/redirect',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    try {
      const token = jwt.sign({
        id: req.user.id,
        fullname: req.user.fullname,
        rol: req.user.rol,
        email: req.user.email
      }, authConfig.secret)
      res.json(token)
    } catch (err) {
      res.status(400).send(err);
    }
  });

  server.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));


server.post('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.user)
    try {
      const token = jwt.sign({
        id: req.user[0].id,
        fullname: req.user[0].fullname,
        rol: req.user[0].rol,
        email: req.user[0].email
      }, authConfig.secret)
      res.json(token)
    } catch (err) {
      res.status(400).send(err);
    }
  });
  
//rutas para descuentos *******************************************************************

  server.post("/discount", protected.isAuthAdmin ,(req, res) => {
    let { mount,percentage, days, isActive}=req.body

    GlobalDiscount
    .create({mount ,percentage, days, isActive})
    .then((discount)=>res.send(discount))

})

server.get("/discount",protected.isAuthAdmin, (req, res) => {
  GlobalDiscount
    .findAll({order: [
        ['id', 'DESC']]})
    .then((e)=>res.send(e))

})

server.get("/discount/active", (req, res) => {
  GlobalDiscount
  .findAll({where:{
    isActive:true
  },
  order: [
    ['id', 'DESC']]
})
  .then((e)=>res.send(e))

})

server.delete("/discount/:id",protected.isAuthAdmin, (req, res) => {

  GlobalDiscount.destroy({
    where:{
      id: req.params.id
    }
  }).then((deleted)=>{
    res.status(200).json("se elimino correctamente " + deleted)
  }).catch((err)=>{
    res.status(400).json("no se pudo borrar el descuento" + err)
  })
})

server.put("/discount/:id",protected.isAuthAdmin, (req, res) => {
let isActive= req.body.isActive
let id= req.params.id

GlobalDiscount.findByPk(id)
 .then((discount=>{
   return discount.update({
    isActive: isActive
   })
  })
 )
  .then((e)=>{
    res.send(e)
  }).catch((err)=>{
    res.status(400).json("Error al modificar el estado: " + error)
  })
})

module.exports = server;
