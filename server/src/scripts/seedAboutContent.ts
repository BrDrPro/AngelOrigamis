import { sequelize } from '../models';
import { AboutContent } from '../models/aboutContent.model';

const DEFAULT_CONTENT = {
  heroTitle: 'Sobre a Angel',
  heroBio:
    'Desde muito cedo, Angel já carregava nas mãos o dom de transformar materiais simples em algo cheio de vida e significado. Aos 10 anos de idade, movida pela curiosidade e pela paixão por trabalhos manuais, buscou aprender bordado com quem pudesse lhe ensinar. Pouco tempo depois, já se aventurava pelo tricô e pelo crochê, descobrindo o prazer de criar com as próprias mãos. Em 2009, foi apresentada ao origami por uma amiga de trabalho e se apaixonou imediatamente pela delicadeza e pela poesia que existe em cada dobra de papel. Desde então, mergulhou nesse universo, conheceu artistas inspiradores e desenvolveu seu próprio olhar — sempre com a ideia de usar o origami para dar vida e encanto à decoração de ambientes. Por muitos anos, suas criações — origamis, tricôs, crochês e outras artes — foram presentes reservados para familiares e amigos próximos, carregando em cada peça o carinho e a dedicação de quem cria com amor. Mas chegou a hora de expandir. Este site nasceu para que mais pessoas possam conhecer e se encantar com seu trabalho. Aqui, cada peça carrega um pedacinho da história de Angel e o desejo de levar beleza, aconchego e afeto para dentro de novos lares. Porque, para ela, arte é isso: um gesto de cuidado que aproxima, aquece e transforma.',
  philosophyCards: [
    { icon: '🎋', title: 'Tradição', text: 'Respeito às técnicas tradicionais e seus significados culturais' },
    { icon: '🌱', title: 'Sustentabilidade', text: 'Uso consciente de materiais e processos de baixo impacto ambiental' },
    { icon: '✨', title: 'Significado', text: 'Cada peça carrega uma história e um desejo positivo para quem a recebe' },
  ],
  originStoryParagraphs: [
    'O origami é mais que um simples passatempo - é uma forma de meditação ativa, que desenvolve paciência, concentração e habilidades motoras. Cada peça de papel dobrada contém uma intenção e um significado especial.',
    'O tsuru (grou de papel), por exemplo, é um símbolo de saúde, boa sorte e longevidade. Segundo a tradição japonesa, quem dobra mil tsurus tem um desejo realizado. Essa é apenas uma das muitas histórias e significados que acompanham a arte do origami.',
    'Em nosso trabalho, buscamos preservar esses significados e tradições, trazendo um pedaço dessa cultura milenar para o seu dia a dia.',
  ],
  ctaTitle: 'Transforme papel em arte',
  ctaText: 'Conheça nossos produtos artesanais',
};

async function seed() {
  await sequelize.sync();

  await AboutContent.destroy({ where: {}, truncate: true });
  await AboutContent.create(DEFAULT_CONTENT);

  console.log('Conteúdo da página Sobre semeado com sucesso!');
  process.exit();
}

seed();
