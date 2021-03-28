const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {

    description: {
      type: DataTypes.TEXT,
    },
    rate: {
      type: DataTypes.ENUM('1', '2', '3', '4', '5'),
      allowNull: false,
    }
  });
};