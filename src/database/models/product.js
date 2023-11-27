'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Categories, { foreignKey: 'categoryId', as: 'category' });
    }
  }
  Products.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    categoryId: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    imagen: DataTypes.STRING,
    descuento: DataTypes.FLOAT    
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};
