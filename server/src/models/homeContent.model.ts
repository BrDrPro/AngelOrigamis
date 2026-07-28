import { DataTypes } from 'sequelize';
import { sequelize } from './index';

export const HomeContent = sequelize.define('HomeContent', {
  heroTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  heroSubtitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  benefitsTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Array de { icon, title, text } - os 3 cards de "Por que escolher..."
  benefitCards: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  newsletterTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  newsletterText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
