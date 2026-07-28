import { Request, Response } from 'express';
import { HomeContent } from '../models';

const DEFAULT_CONTENT = {
  heroTitle: 'Arte em Papel e Artesanato',
  heroSubtitle: 'Origamis exclusivos feitos com dedicação e significado',
  benefitsTitle: 'Por que escolher arte em origami?',
  benefitCards: [
    { icon: '🎎', title: 'Significado Cultural', text: 'Cada peça carrega tradições e simbolismos orientais' },
    { icon: '🌿', title: 'Sustentabilidade', text: 'Utilizamos materiais ecológicos e de baixo impacto ambiental' },
    { icon: '❤️', title: 'Feito à Mão', text: 'Peças únicas com atenção aos mínimos detalhes' },
  ],
  newsletterTitle: 'Receba nossas novidades',
  newsletterText: 'Inscreva-se para conhecer novos modelos e promoções',
};

const getOrCreateContent = async () => {
  const existing = await HomeContent.findOne();
  if (existing) return existing;
  return HomeContent.create(DEFAULT_CONTENT);
};

export default class HomeContentController {
  static async get(req: Request, res: Response) {
    try {
      const content = await getOrCreateContent();
      res.json(content);
    } catch (error) {
      console.error('Erro ao buscar conteúdo da página Home:', error);
      res.status(500).json({ message: 'Erro ao buscar conteúdo da página Home' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { heroTitle, heroSubtitle, benefitsTitle, benefitCards, newsletterTitle, newsletterText } = req.body;

      if (
        !heroTitle || !heroSubtitle || !benefitsTitle || !newsletterTitle || !newsletterText ||
        !Array.isArray(benefitCards)
      ) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      const content = await getOrCreateContent();
      await content.update({ heroTitle, heroSubtitle, benefitsTitle, benefitCards, newsletterTitle, newsletterText });

      res.json(content);
    } catch (error) {
      console.error('Erro ao atualizar conteúdo da página Home:', error);
      res.status(500).json({ message: 'Erro ao atualizar conteúdo da página Home' });
    }
  }
}
