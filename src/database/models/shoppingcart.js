'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShoppingCarts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ShoppingCarts.belongsTo(models.Users, {
        as : 'user',
        foreignKey : 'userId'
      });
      ShoppingCarts.hasMany(models.Item, {
        as : 'items',
        foreignKey : 'orderId'
      });
    }
  }
  ShoppingCarts.init({
    total: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShoppingCarts',
  });
  return ShoppingCarts;
};