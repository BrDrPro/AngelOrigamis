import { Router } from 'express';
import productRoutes from './product.routes';
import newsletterSubscriberRoutes from './newsletterSubscriber.routes';
import authRoutes from './auth.routes';
import testimonialRoutes from './testimonial.routes';
import contactRequestRoutes from './contactRequest.routes';
import orderRoutes from './order.routes';
import storeSettingsRoutes from './storeSettings.routes';
import categoryRoutes from './category.routes';
import faqRoutes from './faq.routes';
import aboutContentRoutes from './aboutContent.routes';
import homeContentRoutes from './homeContent.routes';
import siteVisitRoutes from './siteVisit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/newsletter', newsletterSubscriberRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contact-requests', contactRequestRoutes);
router.use('/orders', orderRoutes);
router.use('/settings', storeSettingsRoutes);
router.use('/categories', categoryRoutes);
router.use('/faqs', faqRoutes);
router.use('/about', aboutContentRoutes);
router.use('/home-content', homeContentRoutes);
router.use('/visits', siteVisitRoutes);

export default router;