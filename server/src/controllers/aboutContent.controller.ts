import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { AboutContent } from '../models';

const DEFAULT_CONTENT = {
  heroTitle: 'Sobre a Angel',
  heroBio:
    'Desde muito cedo, Angel já carregava nas mãos o dom de transformar materiais simples em algo cheio de vida e significado. Aos 10 anos de idade, movida pela curiosidade e pela paixão por trabalhos manuais, buscou aprender bordado com quem pudesse lhe ensinar. Pouco tempo depois, já se aventurava pelo tricô e pelo crochê, descobrindo o prazer de criar com as próprias mãos. Em 2009, foi apresentada ao origami por uma amiga de trabalho e se apaixonou imediatamente pela delicadeza e pela poesia que existe em cada dobra de papel. Desde então, mergulhou nesse universo, conheceu artistas inspiradores e desenvolveu seu próprio olhar — sempre com a ideia de usar o origami para dar vida e encanto à decoração de ambientes. Por muitos anos, suas criações — origamis, tricôs, crochês e outras artes — foram presentes reservados para familiares e amigos próximos, carregando em cada peça o carinho e a dedicação de quem cria com amor. Mas chegou a hora de expandir. Este site nasceu para que mais pessoas possam conhecer e se encantar com seu trabalho. Aqui, cada peça carrega um pedacinho da história de Angel e o desejo de levar beleza, aconchego e afeto para dentro de novos lares. Porque, para ela, arte é isso: um gesto de cuidado que aproxima, aquece e transforma.',
  heroImageUrl: '/assets/SobreAArtista.jpg',
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
  originStoryImageUrl: '/assets/CasamentoMeB.jpg',
  ctaTitle: 'Transforme papel em arte',
  ctaText: 'Conheça nossos produtos artesanais',
};

const SITE_CONTENT_URL_PREFIX = '/assets/site-content/';

const getSiteContentDir = () => {
  if (process.env.SITE_CONTENT_UPLOAD_DIR) {
    return process.env.SITE_CONTENT_UPLOAD_DIR;
  }
  return path.resolve(__dirname, '../../..', 'client', 'public', 'assets', 'site-content');
};

type UploadedFile = {
  originalname: string;
  buffer: Buffer;
};

const saveImage = async (file: UploadedFile): Promise<string> => {
  const baseDir = getSiteContentDir();
  await fs.mkdir(baseDir, { recursive: true });

  const ext = path.extname(file.originalname) || '.jpg';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  await fs.writeFile(path.join(baseDir, fileName), file.buffer);

  return `${SITE_CONTENT_URL_PREFIX}${fileName}`;
};

// Só apaga imagens que a gente mesmo gerou (dentro de /assets/site-content/) -
// nunca mexe nas imagens originais do projeto (ex: /assets/SobreAArtista.jpg).
const deleteManagedImage = async (url?: string | null) => {
  if (!url || !url.startsWith(SITE_CONTENT_URL_PREFIX)) return;

  const baseDir = getSiteContentDir();
  const fileName = url.slice(SITE_CONTENT_URL_PREFIX.length);
  try {
    await fs.unlink(path.join(baseDir, fileName));
  } catch {
    // Arquivo já não existe ou não pôde ser removido; ignora.
  }
};

const getOrCreateContent = async () => {
  const existing = await AboutContent.findOne();
  if (existing) return existing;
  return AboutContent.create(DEFAULT_CONTENT);
};

export default class AboutContentController {
  static async get(req: Request, res: Response) {
    try {
      const content = await getOrCreateContent();
      res.json(content);
    } catch (error) {
      console.error('Erro ao buscar conteúdo da página Sobre:', error);
      res.status(500).json({ message: 'Erro ao buscar conteúdo da página Sobre' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { heroTitle, heroBio, ctaTitle, ctaText } = req.body;

      let philosophyCards;
      let originStoryParagraphs;
      try {
        philosophyCards = typeof req.body.philosophyCards === 'string'
          ? JSON.parse(req.body.philosophyCards)
          : req.body.philosophyCards;
        originStoryParagraphs = typeof req.body.originStoryParagraphs === 'string'
          ? JSON.parse(req.body.originStoryParagraphs)
          : req.body.originStoryParagraphs;
      } catch {
        return res.status(400).json({ message: 'Dados inválidos' });
      }

      if (
        !heroTitle || !heroBio || !ctaTitle || !ctaText ||
        !Array.isArray(philosophyCards) || !Array.isArray(originStoryParagraphs)
      ) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      const content = await getOrCreateContent();
      const updateData: Record<string, unknown> = {
        heroTitle, heroBio, philosophyCards, originStoryParagraphs, ctaTitle, ctaText,
      };

      const files = (req as { files?: Record<string, UploadedFile[]> }).files;
      const heroImageFile = files?.heroImage?.[0];
      const originStoryImageFile = files?.originStoryImage?.[0];

      if (heroImageFile) {
        updateData.heroImageUrl = await saveImage(heroImageFile);
        await deleteManagedImage(content.get('heroImageUrl') as string | undefined);
      }

      if (originStoryImageFile) {
        updateData.originStoryImageUrl = await saveImage(originStoryImageFile);
        await deleteManagedImage(content.get('originStoryImageUrl') as string | undefined);
      }

      await content.update(updateData);

      res.json(content);
    } catch (error) {
      console.error('Erro ao atualizar conteúdo da página Sobre:', error);
      res.status(500).json({ message: 'Erro ao atualizar conteúdo da página Sobre' });
    }
  }
}
