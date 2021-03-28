const server = require('express').Router();
const { Order, User, OrderDetails, Review, Product, Image } = require('../db.js');
const passport = require('passport');
const protected = require('../middleware/protected')
var nodemailer = require('nodemailer');
const uuid = require('uuid');
//const { Op } = require("sequelize");

//Ruta de crear usuario
//Pau
server.post('/', passport.authenticate('signup'),async(req,res)=>{
    res.json({
      user:{id:req.user.id},
    message: 'SignUp success'
  
  })
})

//PUT users/:id S35 : Ruta para modificar Usuario
server.put('/:id' ,protected.isAuth, function (req, res) {
  const { id } = req.params;
  const { fullname, email, password, rol, banned } = req.body;
  User.findByPk(id)
    .then((user => {
      user.update(
        {
          fullname: fullname,
          email: email,
          password: password,
          rol: rol,
          banned: banned,
        })
    })
    )
    .then(() => {
      res.status(200).json("Datos cambiados con éxito")
    })
    .catch(error => {
      res.status(400).send(`Error ${error}`);
    })
});


server.get('/' , protected.isAuthAdmin, (req, res) => {
  User.findAll({
    //en la ruta de Canela no estaban los atributos
    atributtes: ["id", "fullname", "email", "banned", "reset"],
    order: [
      ['id', 'ASC'],
    ],
  })
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(400).send(`Error: ${err}`)
    });
});


//Traer id de usuario
server.get("/:id" , protected.isAuth, (req, res) => {
  const id = req.params.id;
  User.findOne({
    where: { id: id },
  })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      return res.send({ data: err }).status(400);
    });
});

//agregar item al carrito
server.post('/:userId/order', (req, res) => {
  let { userId } = req.params;
  let { productId, price, quantity } = req.body;

  Order.findOrCreate({
    where: {
      userId: userId,
      state: "carrito"
    },
    userId: userId,
    state: "carrito"

  }).then((order) => {
    OrderDetails.create({
      orderId: order[0].id,
      productId: productId,
      price: price,
      quantity: quantity
    })
      .then((order_detalle) => {
        res.status(201).json(order_detalle)
      })
      .catch(err => {
        res.status(400).send("Error al agregar item a la orden:" + err)
      })
  })
    .catch(err => {
      res.status(400).send("Error al agregar item a la orden:" + err)
    })
});

//obtener todos los items del carrito
server.get("/:userId/order/:state", protected.isAuth, (req, res) => {
  let { userId, state } = req.params;

  Order.findOne({
    where: {
      userId: userId,
      state: state
    },
  }).then((order) => {
    OrderDetails.findAll({
      where: {
        orderId: order.id,
      },
      order: [
        ['productId', 'ASC']
      ]
    })
      .then(detalle => {
        res.status(200).json(detalle)
      })

  }).catch((err) => {
    res.status(400).json("Error al traer todos los items de la orden" + err)
  })
});

//obtener todos los items del carrito
server.get("/:userId/order/:state", (req, res) => {
  let { userId, state } = req.params;

  Order.findOne({
    where: {
      userId: userId,
      state: state
    }
  }).then((order) => {
    OrderDetails.findAll({
      where: {
        orderId: order.id,
      },
      order: [
        ['productId', 'ASC']
      ]
    })
      .then(detalle => {
        res.status(200).json(detalle)
      })

  }).catch((err) => {
    res.status(400).json("Error al traer todos los items de la orden" + err)
  })
});

//vaciar carrito
server.delete("/:userId/order/:orderId" , protected.isAuth, (req, res) => {

  let { userId, orderId } = req.params;

  Order.destroy({
    where: {
      id: orderId,
      userId: userId
    }
  }).then((order) => {
    res.status(200).json(order)
  }).catch(err => {
    res.status(400).json("no se borro correctamente" + err)
  })
})

// task 45 GET /users/:id/orders.. ruta que retorne todas las ordenes de los usuarios
server.get('/:id/orders' , protected.isAuth, (req, res) => {
  let { id } = req.params;
  Order.findAll({
    where: {
      userId: id
    },
    include: [
      {
        model: Product,
        include:
          { model: Image }
      },
    ],
    order: [
      ['id', 'ASC']]
  })
    .then(orders => {
      res.status(200).json(orders)
    })
    .catch(err => {
      res.status(400).send('' + err)
    })
});

// ruta que revuelve todas las review de un usuario
server.get("/:id/review", (req, res) => {
  const userId = req.params.id;
  Review.findAll({ 
    where: {
      userId: userId 
      },
      include: [
        { model: Product }
      ],
      })
    .then((review) => {
      res.status(200).json( review)
    })
    .catch(err => {
      res.status(400).send('este es el error' + err)
    })
});

// PUT /auth/promote/:id de usuario
// Promote convierte al usuario con ID: id a Admin.
server.put('/promote/:id', (req, res)=>{
  const {id} = req.params;
  User.findByPk(id)
  .then(user => {
    if(user.rol === "admin"){
      res.json("Este usuario ya es administrador")
    }else{
      user.update({
        rol: "admin"
      })
      .then(() => {
        res.status(200)
        .json("Usuario ha sido promovido a administrador")
      })
      .catch(err => {
        res.status(400)
        .send( `Error al cambiar a admin ${err}`)
      })
    } 
    })   
})


//S70 : Crear Ruta para password reset
//PUT /users/:id/passwordReset
server.put('/passwordReset/:reset', function (req, res) {
  const {reset} = req.params;
  const {newPassword } = req.body;
console.log(reset)
    if(!newPassword){
    return res.status(400)
    .json("Debe ingresar su nueva contraseña")
    }
    User.findOne(
      {
        where: {
          reset: reset,
        }
      })
    .then(user => {
        user.update(
          {
            password: newPassword
          })
      .then(() => {
        res.status(200).json("Contraseña cambiada")
      })
      .catch(error => {
        res.status(400).send(`Error ${error}`);
      })
       }
   ) 
});


//user olvida la contraseña
server.post('/forgot', (req, res) =>{
	let email = req.body.email
	User.findOne(
		{
			where: {
				email: email,
			}
		})
  .then(user =>{
    if(!user.reset){
      var id = uuid.v4();
      user.setDataValue("reset", id);
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
			  text: `Parece que has olvidado tu contraseña! \nPorfavor has click en el siguiente link: ${process.env.APP_URL}/user/resetPass/${user.dataValues.reset}`
		  },(error, info)=>{
			  if(error){(res.status(500).send("no se pudo enviar" + error)) }
			  else {
				res.status(200).send("Mail enviado" + info)
			  }
		  })
	}).catch(err => {
		res.status(400)
		.json("Este usuario no se encuentra registrado" + console.log(err))
	})
});




//ruta para obtener usuarios con carritos comprados
server.get('/:id/orders/complete', (req, res)=>{
  const {id} = req.params;
  User.findByPk(id)
  .then((user)=>{
    Order.findAll({
      where: { 
        state: "completa",
      userId: user.id },
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["name", "description", "stock", "price"],
          // include:[
          //   {
          //     model: Review,
          //     where:{
          //       userId: user.id
          //     }
          //   }
          // ] 
        },
      ],
    }).then((r) =>  res.status(200).json(r));
  })
})
module.exports = server;