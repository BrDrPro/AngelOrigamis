import { sequelize } from '../models';
import { AboutContent } from '../models/aboutContent.model';

// Só preenche heroImageUrl/originStoryImageUrl se estiverem vazios - não mexe
// em nenhum outro campo, pra não sobrescrever texto que já foi editado.
async function run() {
  await sequelize.sync();

  const content = await AboutContent.findOne();
  if (!content) {
    console.log('Nenhum conteúdo da página Sobre encontrado - nada para atualizar.');
    process.exit();
  }

  const updates: Record<string, string> = {};
  if (!content.get('heroImageUrl')) {
    updates.heroImageUrl = '/assets/SobreAArtista.jpg';
  }
  if (!content.get('originStoryImageUrl')) {
    updates.originStoryImageUrl = '/assets/CasamentoMeB.jpg';
  }

  if (Object.keys(updates).length === 0) {
    console.log('Campos de imagem já preenchidos - nada para fazer.');
    process.exit();
  }

  await content.update(updates);
  console.log('Campos de imagem da página Sobre preenchidos com os defaults:', updates);
  process.exit();
}

run();
