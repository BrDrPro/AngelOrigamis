import { DataTypes } from 'sequelize';
import { sequelize } from './index';

export const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  folderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});
