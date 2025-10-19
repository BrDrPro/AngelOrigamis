import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface ClientAttributes {
  id?: number;
  email: string;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, 'id'> {}

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public email!: string;
}

Client.init(
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
    tableName: 'clients',
    timestamps: false,
  }
);