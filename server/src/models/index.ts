import sequelize from '../config/database';
import { Product } from './product.model';
import { NewsletterSubscriber } from './newsletterSubscriber.model';
import { Testimonial } from './testimonial.model';
import { ContactRequest } from './contactRequest.model';
import { Order } from './order.model';
import { StoreSettings } from './storeSettings.model';
import { Category } from './category.model';
import { Subcategory } from './subcategory.model';

const models = {
  Product,
  NewsletterSubscriber,
  Testimonial,
  ContactRequest,
  Order,
  StoreSettings,
  Category,
  Subcategory,
};

export { sequelize, models, Product, NewsletterSubscriber, Testimonial, ContactRequest, Order, StoreSettings, Category, Subcategory };