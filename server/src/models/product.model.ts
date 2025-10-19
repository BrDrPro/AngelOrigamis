import { DataTypes } from 'sequelize';
import { sequelize } from './index';

export const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  measure: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrls: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});