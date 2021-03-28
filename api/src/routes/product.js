const server = require('express').Router();
const { Product, Category, Image, Review, User } = require('../db.js');
const { Op } = require("sequelize");
const protected = require('../middleware/protected')


//task 23
server.get("/search", (req, res) => {
  const producto = req.query.value;
  Product.findAll({
    where: {
      [Op.or]:
        [{
          name: {
            [Op.iLike]: `%${producto}%`
          }
        },
        {
          description: {
            [Op.iLike]: `%${producto}%`
          }
        }
        ]
    },
    include: [
      { model: Image }
    ],
  })
    .then((product) => {
      res.status(200).json(product);
    })
    .catch(error => {
      res.status(400).send(`Error: ${error}`)
    })
});

//task 17
server.delete('/:productId/category/:categoryId' , protected.isAuthAdmin, (req, res) => {
  let { productId, categoryId } = req.params;

  let productRemoveCategory;
  let categoryProduct;

  Product.findByPk(productId)
    .then(product => {
      productRemoveCategory = product;
      return Category.findByPk(categoryId);
    })
    .then(category => {
      categoryProduct = category;
      return productRemoveCategory.removeCategory(categoryProduct)
    })
    .then(() => {
      Product.findByPk(productId,
        {
          include: {
            model: Category,
            as: 'categories'
          }
        })
        .then(nuevoProduct => {
          res.json(nuevoProduct);
        })
        .catch(err => {
          res.status(400).send(`Error: ${err}`)
        })
    })
 
});

//task 18
server.post('/category' , protected.isAuthAdmin, (req, res) => {
  let { name, description } = req.body;
  Category.findOrCreate({
    where: {
      name: name,
      description: description,
    }
  }).then(category => {
    res.status(201).json(category);
  })
    .catch(err => {
      res.status(400).send(`Error: ${err}`)
    })
});


//task 20
server.put('/category/:id' , protected.isAuthAdmin, function (req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  Category.update(
    {
      name: name,
      description: description,
    }, {
    where: {
      id: id
    }
  })
    .then(e => {
      res.status(200).send(e)
    }).catch(error => {
      res.status(400).send(`Error ${error}`);
    })
});

//task 19
server.delete('/category/:id' , protected.isAuthAdmin, function (req, res) {
  const { id } = req.params;
  Category.destroy({
    where: {
      id: id
    }
  }).then(function () {
    res.status(200).json();
  }).catch(error => {
    res.status(400).send(`Error ${error}`)
  })
});

//task 21
server.get('/', (req, res, next) => {

  Product.findAll({
    include: [
      {
        model: Category,
        as: 'categories'
      },
      {
        model: Image,
      }
    ]

  })
    .then(products => {
      res.send(products);
    })
    .catch(next);
});

server.get('/categories', (req, res, next) => {
  Category.findAll()
    .then(categories => {
      res.json(categories);
    })
    .catch(next);
});

server.post('/:productId/category/:categoryId' , protected.isAuthAdmin, (req, res) => {
  let { productId, categoryId } = req.params;

  let productAddCategory;
  let categoryProduct;

  Product.findByPk(productId)
    .then(product => {
      productAddCategory = product;
      return Category.findByPk(categoryId);
    })
    .then(category => {
      categoryProduct = category;
      return productAddCategory.addCategories([categoryProduct])
    })
    .then(() => {
      Product.findByPk(productId,
        {
          include: {
            model: Category,
            as: 'categories'
          }
        })
        .then(nuevoProduct => {
          res.json(nuevoProduct);
        })
        .catch(err => {
          res.status(400).send(`Error: ${err}`)
        })
    })
    .catch(err => {
      res.status(400).send(`Error: ${err}`)
    })
});

server.get('/category/:categoryName', (req, res, next) => {
  let categoryName = req.params.categoryName;
  // categoryName.toLower()
  Product.findAll({

    include: [
      {
        model: Category, as: 'categories',
        where: {
          name: {
            [Op.iLike]: categoryName
          }
        },
      },
      {
        model: Image,
      }
    ],
  })
    .then(products => {
      res.json(products)
    })
    .catch(next);
});


//task 24   //incluir modelo review---------------------------------------------
server.get("/:id", (req, res) => {
  const id = req.params.id;
  Product.findOne({
    where: { id: id },
    include: [
      { model: Image},
      {
        model: Review,
        include:[User]
        }
    ],
  })
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      return res.send({ data: err }).status(400);
    });
});

//task 25
server.post('/', protected.isAuthAdmin, function (req, res) {
  let { name, description, price, stock, image } = req.body;

  if (!image) {
    res.status(400).json('Debe llenar el campo "image"')
  }
  Product.create({
    name: name,
    description: description,
    price: price,
    stock: stock
  })

    .then((product) => {
      if (image) {
        image.map(img => img.productId = product.id);
        Image.bulkCreate(image)
        return product
      }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).json(err))

})


//task 26
server.put('/:id' , protected.isAuthAdmin, function (req, res) {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  Product.update(
    {
      name: name,
      description: description,
      price: price,
      stock: stock
    }, { where: { id: id } })
    .then(e => {
      res.status(200).send(e)
    }).catch(error => {
      res.status(400).send(`Error ${error}`);
    })
});

//task 27
server.delete('/:id' , protected.isAuthAdmin, function (req, res) {
  const { id } = req.params;
  Product.destroy({
    where: {
      id: id
    }
  }).then(function () {
    res.status(200);
  }).catch(error => {
    res.status(400).send(`Error ${error}`)
  })
});

server.post('/:idProducto/category/:idCategory' , protected.isAuthAdmin, (req, res) => {
  const { idProducto, idCategory } = req.params;

  Product.update({ categoryId: idCategory }, {
    where: {
      idProducto: idProducto
    }
  }

  ).then((product) => {
    res.json(product);
  })
    .catch((err) => {
      return res.send({ data: err }).status(400);
    })
})


server.get('/:idProduct/categories', (req, res, next) => {
  const { idProduct } = req.params;
  Category.findAll({
    include: [
      {
        model: Product, as: 'products',
        where: {
          id: idProduct
        },
      },],
  }).then(categories => {
    res.json(categories)
  })
    .catch(next);

})

//Task 54 Crear ruta para crear/agregar Review
//POST /product/:id/review
server.post("/:id/review", (req, res) => {
  const productId = req.params.id;
  const { userId, rate, description } = req.body; 

  if (rate && description && productId && userId) {
    Review.create({ 
      rate:rate,
      description: description,
      productId: productId,
      userId: userId 
    })
      .then((review) => 
      res.status(200)
      .json(review))
      .catch((err) => {
        console.log("Error creando review " + err);
      });
  } else {
    res.status(400).send("Debes completar todos los campos");
  }
});

//Task 55 Crear ruta para Modificar Review
//PUT /product/:id/review/:idReview

server.put("/:id/review/:idReview", (req, res) => {
  const productId = req.params.id;
  const reviewId = req.params.idReview;
  const { rate, description } = req.body;

  Review.update({ 
    rate: rate,
     description: description 
    },
    { 
      where: { 
        id: reviewId,
        productId: productId, 
      }})
    .then((review) =>
      res.status(200)
      .json(review))
    .catch((err) => {
      console.log("No se pudo cambiar review " + err);
      res.send(err);
    });
});

//Task 56 Crear Ruta para eliminar Review
//DELETE /product/:id/review/:idReview

server.delete("/:id/review/:idReview", (req, res) => {
  const productId = req.params.id;
  const reviewId = req.params.idReview;

  Review.destroy({
     where:{
         id: reviewId,
         productId: productId,
         }})
    
    .then((review) => 
    res.status(200)
    .json(review))
    .catch((err) => {
      console.log("No se pudo borrar " + err);
      res.send(err);
    });
});

//Task: 57 Crear Ruta para obtener todas las reviews de un producto.
//GET /product/:id/review/

server.get("/:id/review/", (req, res) => {
  const productId = req.params.id;
  Review.findAll({ 
    where: {
       productId: productId 
      }
      })
    .then((review) => 
    res.status(200)
    .json(review))
    .catch((err) => {
      console.log("No se pudieron obtener los reviews " + err);
      res.send(err);
    });
});




module.exports = server;
