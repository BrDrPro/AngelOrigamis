import sequelize from '../config/database';
import { Product } from './product.model';
import { Client } from './client.model';
import { Testimonial } from './testimonial.model';
import { ContactRequest } from './contactRequest.model';
import { Order } from './order.model';

const models = {
  Product,
  Client,
  Testimonial,
  ContactRequest,
  Order,
};

export { sequelize, models, Product, Client, Testimonial, ContactRequest, Order };