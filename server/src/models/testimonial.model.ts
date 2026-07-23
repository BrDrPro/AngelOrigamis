import { DataTypes } from 'sequelize';
import { sequelize } from './index';

export const Testimonial = sequelize.define('Testimonial', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  approved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
