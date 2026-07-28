import { sequelize } from '../models';
import { Faq } from '../models/faq.model';

// Conteúdo migrado de client/src/components/Pages/Contact/Contact.js - primeira
// carga do FAQ que já existia hardcoded no frontend.
const FAQS = [
  {
    question: 'Qual o prazo para entrega de origamis personalizados?',
    answer: 'O prazo varia conforme a complexidade e quantidade. Origamis simples podem ser feitos em 1-2 dias, peças mais complexas podem levar até 2 semanas.',
  },
  {
    question: 'Os origamis são duráveis?',
    answer: 'Sim! Utilizamos papéis especiais que garantem durabilidade. Para maior conservação, recomendamos manter em local seco e protegido do sol direto.',
  },
  {
    question: 'Fazem workshops de origami?',
    answer: 'Sim, oferecemos workshops para grupos pequenos e eventos. Entre em contato para mais informações sobre datas e preços.',
  },
  {
    question: 'Posso encomendar produtos para presente?',
    answer: 'Com certeza! Oferecemos embalagens especiais e podemos incluir cartões personalizados em suas encomendas.',
  },
];

async function seed() {
  await sequelize.sync();

  const existingCount = await Faq.count();
  if (existingCount > 0) {
    console.log(`Já existem ${existingCount} itens de FAQ no banco - pulando (evita duplicar).`);
    process.exit();
  }

  for (let i = 0; i < FAQS.length; i++) {
    await Faq.create({ ...FAQS[i], order: i });
    console.log(`FAQ migrado: ${FAQS[i].question}`);
  }

  console.log('FAQ migrado com sucesso!');
  process.exit();
}

seed();
