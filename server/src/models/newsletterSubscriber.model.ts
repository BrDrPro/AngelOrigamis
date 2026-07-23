import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface NewsletterSubscriberAttributes {
  id?: number;
  email: string;
}

interface NewsletterSubscriberCreationAttributes extends Optional<NewsletterSubscriberAttributes, 'id'> {}

export class NewsletterSubscriber
  extends Model<NewsletterSubscriberAttributes, NewsletterSubscriberCreationAttributes>
  implements NewsletterSubscriberAttributes
{
  public id!: number;
  public email!: string;
}

NewsletterSubscriber.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    // Mantém o nome físico da tabela original ('clients') para não exigir
    // uma migração de dados; só o nome do model reflete o propósito real.
    tableName: 'clients',
    timestamps: false,
  }
);
