import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import authRoutes from './routes/auth.routes';
import { sequelize } from './models';

const app = express();

// Necessário em produção: o Nginx fica na frente do Node, então o Express
// precisa ler o IP real do cliente via X-Forwarded-For (senão o rate limit
// do login trataria todo mundo como se viesse do mesmo IP do proxy).
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://angelorigamis.com.br',
  'https://www.angelorigamis.com.br'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', routes);

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