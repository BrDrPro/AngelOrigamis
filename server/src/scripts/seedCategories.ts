import { sequelize } from '../models';
import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategory.model';

// Mapeamento histórico de categoria -> pasta real usada em disco (client/public/Produtos/...).
// Preservado aqui para não quebrar os caminhos de imagem dos produtos já existentes.
const CATEGORIES: Array<{ name: string; folderName: string }> = [
  { name: 'Móbiles', folderName: 'Mobilis' },
  { name: 'Mandalas', folderName: 'Mandalas' },
  { name: 'Kussudamas', folderName: 'Kussudamas' },
  { name: 'Colares de Mesa', folderName: 'ColaresdeMesa' },
  { name: 'Escapulários de Porta', folderName: 'EscapuláriodePorta' },
  { name: 'Adornos de Porta e/ou Berço', folderName: 'AdornosdeBerçoePorta' },
  { name: 'Quadros de Origami', folderName: 'Quadros' },
  { name: 'Filtros dos Sonhos', folderName: 'FiltrodosSonhos' },
  { name: 'Material de Escritório', folderName: 'MaterialEscritório' },
  { name: 'Cadeira de Praia em Fio Náutico', folderName: 'CadeirasdePraia' },
  { name: 'Decoração de Natal', folderName: 'Natal' },
];

const SUBCATEGORIES: Array<{ category: string; name: string; folderName: string }> = [
  { category: 'Móbiles', name: 'Balão Colmeia', folderName: 'BalaoColmeia' },
  { category: 'Móbiles', name: 'Margaridas', folderName: 'Margaridas' },
  { category: 'Móbiles', name: 'Tsurus', folderName: 'Tsurus' },
  { category: 'Adornos de Porta e/ou Berço', name: 'Anjo', folderName: 'Anjo' },
  { category: 'Adornos de Porta e/ou Berço', name: 'Quadrodeporta', folderName: 'Quadrodeporta' },
  { category: 'Quadros de Origami', name: 'Espírito Santo', folderName: 'EspiritoSanto' },
  { category: 'Quadros de Origami', name: 'Flocos de Neve', folderName: 'Flocosdeneve' },
  { category: 'Quadros de Origami', name: 'Mandala com Espírito Santo', folderName: 'MandalacomEspiritoSanto' },
  { category: 'Quadros de Origami', name: 'Papoulas', folderName: 'Papoulas' },
];

async function seed() {
  await sequelize.sync();

  const categoryIdByName: Record<string, number> = {};

  for (const cat of CATEGORIES) {
    const [category] = await Category.findOrCreate({
      where: { name: cat.name },
      defaults: { folderName: cat.folderName },
    });
    categoryIdByName[cat.name] = category.get('id') as number;
  }

  for (const sub of SUBCATEGORIES) {
    const categoryId = categoryIdByName[sub.category];
    await Subcategory.findOrCreate({
      where: { name: sub.name, categoryId },
      defaults: { folderName: sub.folderName, categoryId },
    });
  }

  console.log('Categorias e subcategorias existentes migradas com sucesso!');
  process.exit();
}

seed();
