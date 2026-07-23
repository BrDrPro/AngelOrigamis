import sequelize from '../config/database';
import { Product } from './product.model';
import { NewsletterSubscriber } from './newsletterSubscriber.model';
import { Testimonial } from './testimonial.model';
import { ContactRequest } from './contactRequest.model';
import { Order } from './order.model';

const models = {
  Product,
  NewsletterSubscriber,
  Testimonial,
  ContactRequest,
  Order,
};

export { sequelize, models, Product, NewsletterSubscriber, Testimonial, ContactRequest, Order };