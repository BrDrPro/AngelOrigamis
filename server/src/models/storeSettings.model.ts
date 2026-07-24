import { DataTypes } from 'sequelize';
import { sequelize } from './index';

export const StoreSettings = sequelize.define('StoreSettings', {
  whatsappPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hoursWeekdays: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hoursSaturday: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hoursSunday: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
