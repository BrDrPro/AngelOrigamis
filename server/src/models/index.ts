import sequelize from '../config/database';
import { Product } from './product.model';
import { NewsletterSubscriber } from './newsletterSubscriber.model';
import { Testimonial } from './testimonial.model';
import { ContactRequest } from './contactRequest.model';
import { Order } from './order.model';
import { StoreSettings } from './storeSettings.model';
import { Category } from './category.model';
import { Subcategory } from './subcategory.model';
import { Faq } from './faq.model';
import { AboutContent } from './aboutContent.model';
import { HomeContent } from './homeContent.model';
import { SiteVisit } from './siteVisit.model';

const models = {
  Product,
  NewsletterSubscriber,
  Testimonial,
  ContactRequest,
  Order,
  StoreSettings,
  Category,
  Subcategory,
  Faq,
  AboutContent,
  HomeContent,
  SiteVisit,
};

export { sequelize, models, Product, NewsletterSubscriber, Testimonial, ContactRequest, Order, StoreSettings, Category, Subcategory, Faq, AboutContent, HomeContent, SiteVisit };