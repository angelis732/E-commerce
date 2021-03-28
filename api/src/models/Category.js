// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {

  // defino el modelo
  const Category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //puede no tener descripción pero sí o sí nombre de la categoría.
    description: {
      type: DataTypes.STRING,
      //Agrego más caracteres o dejo 255 por defecto?
    }
  });
};






