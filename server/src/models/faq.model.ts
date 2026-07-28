import { DataTypes } from 'sequelize';
import { sequelize } from './index';

export const Faq = sequelize.define('Faq', {
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
