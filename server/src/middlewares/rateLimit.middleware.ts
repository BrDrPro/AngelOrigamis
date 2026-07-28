import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas de login. Tente novamente mais tarde.' },
});

// Protege formulários públicos (pedidos, contato, depoimentos, newsletter)
// contra spam/flood, sem incomodar um cliente real fazendo uso normal.
export const publicFormRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas solicitações. Tente novamente mais tarde.' },
});

// Mais permissivo - o contador de visitas dispara em navegação normal do site.
export const siteVisitRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas requisições.' },
});
