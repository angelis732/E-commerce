const server = require('express').Router();
const { Order, User, OrderDetails, Product, Image } = require('../db.js');
const { Op } = require("sequelize");
const protected = require('../middleware/protected')
var nodemailer = require('nodemailer');

//ruta para agregar direccion a la orden para el envio
server.put('/:id/address/',protected.isAuth, (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  Order.findByPk(id, {
    include: [
      { model: Product}
    ]
  })
    .then((order) => {
      return order.update(
        {
          address: address
        })  
       
      })
      .then(() => res.status(200).json("agregada dirección de envío"))
      .catch(error => {
        console.log(error)
        res.status(400)
          .send("Error al tratar de cambiar el estado" + error)
      })   
    })



//modificar el estado de la orden
server.put('/:id' , protected.isAuth, (req, res) => {
  const { id } = req.params;
  const { state } = req.body;

  Order.findOne({
    where:{id},
    include: [
      { model: Product, include: { model: Image } },
      {model: User, attributes: ["id", "email"] }
    ]
  })
    .then((order) => {

      return order.update(
        {
          state: state
        })
       
    })
    .then((order) => {
      console.log("ordeasd", order)

      let direccion= order.dataValues.address
      if(order.state === "enviado"){
        const transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
                 user: process.env.AUTH_MAIL,
                 pass: process.env.AUTH_PASS
               }
             })
                       transporter.sendMail({
                         from: process.env.AUTH_MAIL,
                         to: order.user.email,
                          subject: 'Su compra ha sido enviada',
                         text: `Estimado Usuario: \n\nSu compra ya esta en camino!
                         \n Datos de envio: 
                         \n ${direccion}
                         \n Ante cualquien consulta comunicarse a: ecommerce.kittishop@gmail.com
                         \nMuchas gracias por preferirnos!.`
                       },(error, info)=>{
                          if(error){(res.status(500).send("no se pudo enviar" + error)) }
                         else {
                           res.status(200).send("Mail enviado" + info)
                          }
                     })
      }
      res.status(200).json(order)
    })
    .catch(error => {
      console.log(error)
      res.status(400)
        .send("Error al tratar de cambiar el estado" + error)
    })
});

server.get("/search" , protected.isAuth, (req, res) => {
  let state = req.query.state;
  Order.findAll({
    attributes: ["id", "state", "userId"],
    where: { state: state },
    include: [
      {
        model: Product,
      },
      {
        model: User,
      },
    ],
  })
    .then(
      (orders) => res.status(200).json(orders)
    )
    .catch(
      (err => res.status(400).json("Se ha producido un error" + err))
    )
});

//eliminar un items de la orden
server.delete("/:orderId/:productId" , protected.isAuth, (req, res) => {
  let { orderId, productId } = req.params;

  OrderDetails.destroy({
    where: {
      orderId: orderId,
      productId: productId,
    }
  }).then((product_delete) => {
    //  console.log(product_delete)
    res.status(200).json(product_delete)

  }).catch((err) => {
    res.status(400).json("no se pudo borrar el producto" + err)
  })
})


// 41) modificar cantidades del carrito por id usuario
server.put('/:idUser/cart' , protected.isAuth, (req, res) => {
  const { idUser } = req.params;
  const { productId, quantity, orderId } = req.body;

  OrderDetails.update({
    quantity: quantity
  },
    {
      where: {
        orderId: orderId,
        productId: productId
      },
    }).then((det) => {
      res.status(200).json(det)
    })
    .catch(error => {
      console.log(error)
      res.status(400)
        .send("Error al modificar la cantidad de:  " + productId + error)
    })
})



//Ruta que retorne todas las ordenes
server.get('/' , protected.isAuthAdmin, (req, res) => {
  let state = req.query.state;
  if(state){
    Order.findAll({
      where: {
        state: state
      },
      include: [
        {
          model: Product, include: { model: Image }
        },
      ],
      order: [
        ['id', 'ASC']]
    }).then(orders => {
      res.status(200).json(orders)
    })
      .catch(err => {
        res.status(400).send('' + err)
      })
    return;
  }
  
  Order.findAll({
    include: [
      {
        model: Product, include: { model: Image }
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

// GET /orders/:id retorna una orden en particular
server.get('/:id' , protected.isAuth, (req, res) => {
  let { id } = req.params;
  Order.findByPk(id, {
    include: [
      { model: Product, include: { model: Image } },
    ]
  })
    .then(order => {

      res.status(200).json(order)
    })
    .catch(err => {
      res.status(400).send('' + err)
    })
});



module.exports = server;



