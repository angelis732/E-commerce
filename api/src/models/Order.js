const { DataTypes } = require('sequelize');
//carrito/orden

module.exports = (sequelize) => {
  const Order = sequelize.define('order', {
    state: {
      type: DataTypes.ENUM(["carrito", "creada", "procesando", "confirmada", "enviada", "cancelada", "completa"])
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  address:{
    type: DataTypes.STRING,
    allowNull: true
  },
  discount:{
    type:DataTypes.INTEGER,
    allowNull: true
  }
  });
};