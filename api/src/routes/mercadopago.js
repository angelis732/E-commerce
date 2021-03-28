const server = require('express').Router();
const { Order, OrderDetails, Product, User } = require('../db.js');
// const { ACCESS_TOKEN } = process.env;
const protected = require('../middleware/protected')
const bodyParser = require('body-parser')
var nodemailer = require('nodemailer');


// SDK de Mercado Pago
const mercadopago = require('mercadopago');

server.use(bodyParser.urlencoded({ extended: false }));

// Agrega credenciales
mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_TOKEN,
    sandbox: true
});



// //Ruta que genera la URL de MercadoPago
server.post("/", (req, res) => {
    const { carrito, orderId } = req.body
    
    // console.log("este es el descuneto", carrito[0].porcentaje)
    // console.log("este es carrito ", carrito)
    
    Order.findByPk(orderId)
      .then((order)=>{
          order.update({
              discount: carrito[0].porcentaje
          })
          console.log("esto es order", order)
      })
      .then(()=>{
          
          const order_id= orderId;
          
          
          const items_ml = carrito && carrito.map(i => (
            {
                title: i.name,
                unit_price: i.porcentaje !=0 ? ( i.price - ((i.porcentaje * parseInt(i.price)) /100)) : parseInt(i.price) ,
                quantity: i.quantity,
            }))
          
          // console.log("este es items_ml",items_ml)
          
          // Crea un objeto de preferencia
          let preference = {
              items: items_ml,
              external_reference : order_id.toString(),
              
              payment_methods: {
                  excluded_payment_types: [
                      {
                          id: "atm"
                      }
                  ],
                  installments: 3  //Cantidad máximo de cuotas
              },
              back_urls: {
                  success: `${process.env.APP_URL_BACK}/mercadopago/response`,
                  failure: `${process.env.APP_URL_BACK}/mercadopago/response`,
                  pending: `${process.env.APP_URL_BACK}/mercadopago/response`,
              },
          };
          
          return mercadopago.preferences.create(preference)
      })
      .then(function(response){
          // console.log(response)
          res.json({ redirect: response.body.init_point })
          
      }).catch(function (error) {
        console.log("este es el error", error);
    });
})



//Ruta que recibe la información del pago
server.get("/response", async (req, res) => {
    
    const { body } = await mercadopago.payment.get(req.query.collection_id)
    // console.log("EN body ",body)
    
    const payment_status = body.status
    const external_reference = body.external_reference
    
    // console.log("EXTERNAL REFERENCE ", external_reference)
    
    //Aquí edito el status de mi orden
    Order.findByPk(external_reference, {
        include: [
            {
                model: User, attributes: ["id", "email"]
            }]
    })
      .then((order) => {
          // console.log("esto es order", order)
          
          if(payment_status == "approved"){
              
              order.payment_status= payment_status //aprobado
              order.state = "confirmada"
              let emailUser = order.user.dataValues.email
              let address= order.dataValues.address
              // console.log("esto es adress ", address)
              order.save()
                .then((_) => {
                    
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.AUTH_MAIL,
                            pass: process.env.AUTH_PASS
                        }
                    })
                    transporter.sendMail({
                        from: process.env.AUTH_MAIL,
                        to: emailUser,
                        subject: 'Su compra fue exitosa',
                        text: `Estimado Usuario: \n \nSu compra fue registrada, pronto le enviaremos los productos a la direccion que nos brindo.
                    \n Datos de envio: 
                    \n ${address}
                    \n Ante cualquien consulta comunicarse a: ecommerce.kittishop@gmail.com
                    \n Gracias por la Compra!.`
                    },(error, info)=>{
                        if(error){(res.status(500).send("no se pudo enviar" + error)) }
                        else {
                            res.status(200).send("Mail enviado" + info)
                        }
                    })
                })
                
                
                .then(() => {
                    res.status(200).redirect(`${process.env.APP_URL}/mercadopago/success`)
                })
                .catch(error => {
                    res.status(400).send(`Error ${error}`);
                })
              
              
              
          } else {
              
              order.payment_status = payment_status //rechazado
              order.state = "cancelada"
              order.save()
                .then((err) => {
                    console.error('error al salvar', err)
                    return res.redirect(`${process.env.APP_URL}/mercadopago/failed`)
                })
          }
          
      })
      .catch(err => {
          console.error('error al buscar', err)
          return res.redirect(`${process.env.APP_URL}`)
      })
})


module.exports = server;

