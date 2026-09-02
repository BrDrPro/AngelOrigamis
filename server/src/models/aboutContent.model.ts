import { DataTypes } from 'sequelize';
import { sequelize } from './index';

export const AboutContent = sequelize.define('AboutContent', {
  heroTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  heroBio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  heroImageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Array de { icon, title, text } - os 3 cards de "Nossa Filosofia"
  philosophyCards: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  // Array de strings - os parágrafos de "A Arte do Origami"
  originStoryParagraphs: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  originStoryImageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ctaTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ctaText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
