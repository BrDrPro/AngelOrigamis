import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index';
import authRoutes from './routes/auth.routes';
import { sequelize } from './models';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// API só devolve JSON (as imagens de produto são servidas direto pelo Nginx,
// não pelo Express), então o CSP padrão do helmet é seguro aqui.
app.use(helmet());

// Necessário em produção: o Nginx fica na frente do Node, então o Express
// precisa ler o IP real do cliente via X-Forwarded-For (senão o rate limit
// do login trataria todo mundo como se viesse do mesmo IP do proxy).
app.set('trust proxy', 1);

const allowedOrigins = [
  'https://angelorigamis.com.br',
  'https://www.angelorigamis.com.br',
  ...(isProduction ? [] : [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ]),
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', routes);

// Handler de erro global - captura qualquer erro que escape dos try/catch dos
// controllers (ex: multer, JSON malformado) e evita vazar stack trace em produção.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    message: 'Erro interno do servidor',
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

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