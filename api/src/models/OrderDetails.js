const { DataTypes } = require('sequelize');
//linea de orden

module.exports = (sequelize) => {
  const OrderDetails = sequelize.define('OrderDetails', {

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },


    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },

  });
};