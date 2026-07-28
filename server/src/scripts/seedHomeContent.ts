import { sequelize } from '../models';
import { HomeContent } from '../models/homeContent.model';

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

async function seed() {
  await sequelize.sync();

  await HomeContent.destroy({ where: {}, truncate: true });
  await HomeContent.create(DEFAULT_CONTENT);

  console.log('Conteúdo da página Home semeado com sucesso!');
  process.exit();
}

seed();
