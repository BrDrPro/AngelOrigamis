import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface AdminAttributes {
  id?: number;
  email: string;
  password: string;
  name?: string | null;
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'id'> {}

export class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public name!: string | null;
}

Admin.init(
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: false,
  }
);