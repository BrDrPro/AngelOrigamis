import { sequelize } from '../models';
import { StoreSettings } from '../models/storeSettings.model';

// Corrige só o campo corrompido (mesmo bug de encoding do auto-create dentro
// do processo de dev de longa duração) - não mexe em whatsappPhone/contactEmail,
// que podem já ter sido customizados pelo admin em produção.
async function fix() {
  await sequelize.sync();

  const settings = await StoreSettings.findOne();
  if (!settings) {
    console.log('Nenhuma configuração encontrada - nada para corrigir.');
    process.exit();
  }

  await settings.update({ hoursSaturday: 'Sábado: 10h - 14h' });

  console.log('Campo hoursSaturday corrigido com sucesso!');
  process.exit();
}

fix();
