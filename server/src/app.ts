import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import { sequelize } from './models';
import productRoutes from './routes/product.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/products', productRoutes);

// Sincroniza os models com o banco de dados
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco de dados sincronizado!');
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Erro ao sincronizar o banco de dados:', error);
});