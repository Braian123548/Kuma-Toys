'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    first_name: DataTypes.STRING,
    last_name:DataTypes.STRING,
    image:DataTypes.STRING,
    direccion:DataTypes.STRING,
    cp:DataTypes.INTEGER,
    email: DataTypes.STRING,
    password:DataTypes.STRING,
    rol: {
      type: DataTypes.STRING,
      defaultValue: 'user' 
    },
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};