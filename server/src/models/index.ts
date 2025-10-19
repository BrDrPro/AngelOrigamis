import sequelize from '../config/database';
import { Product } from './product.model';
import { Client } from './client.model';

const models = {
  Product,
  Client,
};

export { sequelize, models, Product, Client };