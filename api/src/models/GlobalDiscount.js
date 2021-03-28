const { DataTypes } = require('sequelize');
//carrito/orden

module.exports = (sequelize) => {
  const GlobalDiscount = sequelize.define('GlobalDiscount', {
  mount: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  percentage:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  days:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isActive:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
  });
};

