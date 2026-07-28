if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido no .env - defina antes de iniciar o servidor.');
}

export const JWT_SECRET = process.env.JWT_SECRET;
