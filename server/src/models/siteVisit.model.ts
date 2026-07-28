import { DataTypes } from 'sequelize';
import { sequelize } from './index';

export const SiteVisit = sequelize.define('SiteVisit', {
  path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
