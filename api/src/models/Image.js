const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('image', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};