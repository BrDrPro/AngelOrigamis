import { Product } from '../models/product.model';
import { Admin } from '../models/admin.model';
import { sequelize } from '../models';
import bcrypt from 'bcryptjs';

async function seed() {
  await sequelize.sync({ force: true });

  const products = [
    // Móbiles Margaridas
    {
      name: 'Margaridas 7 Chakras',
      description: 'Móbile contendo 14 margaridas em pares perfeitamente simétricas em estampas exclusivas nas 7 cores dos Chakras. Estampas e modelo de Isa Klein.',
      price: 210,
      category: 'Móbiles',
      subcategory: 'Margaridas',
      measure: '120 cm',
      imageUrls: [
        '/Produtos/Mobilis/Margaridas/7dons.jpg',
        '/Produtos/Mobilis/Margaridas/7dons_2.jpg'
      ],
    },
    {
      name: 'Margaridas Candy Colors',
      description: 'Móbile contendo 10 margaridas em pares perfeitamente simétricas em estampas exclusivas nos tons Candy Colors. Estampas e modelo de Isa Klein.',
      price: 150,
      category: 'Móbiles',
      subcategory: 'Margaridas',
      measure: '110 cm',
      imageUrls: [
        '/Produtos/Mobilis/Margaridas/Candycolors.jpg',
        '/Produtos/Mobilis/Margaridas/Candycolors_2.jpg'
      ],
    },
    {
      name: 'Margaridas Estampadas',
      description: 'Móbile contendo 10 margaridas em pares perfeitamente simétricas em estampas exclusivas em cores variadas. Estampas e modelo de Isa Klein.',
      price: 120,
      category: 'Móbiles',
      subcategory: 'Margaridas',
      measure: '90 cm',
      imageUrls: [
        '/Produtos/Mobilis/Margaridas/Estampado.jpg',
        '/Produtos/Mobilis/Margaridas/Estampado_2.jpg'
      ],
    },
    // Móbiles Tsurus
    {
      name: 'Tsurus Preto e Dourado',
      description: 'Composição de fio com 6 Tsurus e peças os alternando e finalizando com um tassel.',
      price: 55,
      category: 'Móbiles',
      subcategory: 'Tsurus',
      measure: '96 cm',
      imageUrls: [
        '/Produtos/Mobilis/Tsurus/PretoeDourado.jpg',
        '/Produtos/Mobilis/Tsurus/PretoeDourado_2.jpg',
        '/Produtos/Mobilis/Tsurus/PretoeDourado_3.jpg'
      ],
    },
    {
      name: 'Tsurus Vermelho Leques',
      description: 'Composição de fio com 6 Tsurus e peças os alternando e finalizando com um tassel.',
      price: 55,
      category: 'Móbiles',
      subcategory: 'Tsurus',
      measure: '96 cm',
      imageUrls: [
        '/Produtos/Mobilis/Tsurus/VermelhoLeques.jpg',
        '/Produtos/Mobilis/Tsurus/VermelhoLeques_2.jpg',
        '/Produtos/Mobilis/Tsurus/VermelhoLeques_3.jpg',
        '/Produtos/Mobilis/Tsurus/VermelhoLeques_4.jpg',
        '/Produtos/Mobilis/Tsurus/VermelhoLeques_5.jpg'
      ],
    },
    {
      name: 'Tsurus Vermelho e Dourado',
      description: 'Composição de fio com 6 Tsurus e peças os alternando e finalizando com um tassel.',
      price: 55,
      category: 'Móbiles',
      subcategory: 'Tsurus',
      measure: '96 cm',
      imageUrls: [
        '/Produtos/Mobilis/Tsurus/VermelhoeDourado.jpg'
      ],
    },
    {
      name: 'Tsurus Azul e Verde',
      description: 'Composição de fio com 6 Tsurus e peças os alternando e finalizando com um tassel.',
      price: 55,
      category: 'Móbiles',
      subcategory: 'Tsurus',
      measure: '96 cm',
      imageUrls: [
        '/Produtos/Mobilis/Tsurus/AzuleVerde.jpg',
        '/Produtos/Mobilis/Tsurus/AzuleVerde_2.jpg',
        '/Produtos/Mobilis/Tsurus/AzuleVerde_3.jpg'
      ],
    },
    {
      name: 'Tsurus Laranja e Bege',
      description: 'Composição de fio com 6 Tsurus e peças os alternando e finalizando com um tassel.',
      price: 55,
      category: 'Móbiles',
      subcategory: 'Tsurus',
      measure: '105 cm',
      imageUrls: [
        '/Produtos/Mobilis/Tsurus/LaranjaeBege.jpg',
        '/Produtos/Mobilis/Tsurus/LaranjaeBege_2.jpg',
        '/Produtos/Mobilis/Tsurus/LaranjaeBege_3.jpg'
      ],
    },
    // Móbiles Balão Colmeia
    {
      name: 'Balão Simples Laranja',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 35,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '28 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/SimplesLaranja.jpg',
        '/Produtos/Mobilis/BalaoColmeia/SimplesLaranja_2.jpg'
      ],
    },
    {
      name: 'Balão Simples Azul',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 35,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '28 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/SimplesAzul.jpg',
        '/Produtos/Mobilis/BalaoColmeia/SimplesAzul_2.jpg'
      ],
    },
    {
      name: 'Balão Duplo Verde e Amarelo',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 50,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '45 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/DuploVerdeeAmarelo.jpg',
        '/Produtos/Mobilis/BalaoColmeia/DuploVerdeeAmarelo_2.jpg'
      ],
    },
    {
      name: 'Balão Duplo Verde e Lilas',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 50,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '45 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/DuploVerdeeLilas.jpg',
        '/Produtos/Mobilis/BalaoColmeia/DuploVerdeeLilas_2.jpg'
      ],
    },
    {
      name: 'Balão Duplo Azul',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 50,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '37 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/DuploAzul.jpg',
        '/Produtos/Mobilis/BalaoColmeia/DuploAzul_2.jpg'
      ],
    },
    {
      name: 'Balão Duplo Azul e Marrom',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 50,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '37 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/DuploazuleMarrom.jpg',
        '/Produtos/Mobilis/BalaoColmeia/DuploazuleMarrom_2.jpg'
      ],
    },
    {
      name: 'Balão Duplo Laranja',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 50,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '37 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/DuploLaranja.jpg',
        '/Produtos/Mobilis/BalaoColmeia/DuploLaranja_2.jpg'
      ],
    },
    {
      name: 'Balão Duplo Laranja e Verde',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 50,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '37 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/DuploLaranjaeVerde.jpg',
        '/Produtos/Mobilis/BalaoColmeia/DuploLaranjaeVerde_2.jpg'
      ],
    },
    {
      name: 'Balão Duplo Vermelho e Laranja',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 50,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '37 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/DuploVermelhoeLaranja.jpg',
        '/Produtos/Mobilis/BalaoColmeia/DuploVermelhoeLaranja_2.jpg'
      ],
    },
    {
      name: 'Balão Duplo Verde e Roxo',
      description: 'Peça dobrada com papéis de estampas exclusivas e lindas pedrarias compondo o móbile finalizado com um tassel. Estampas e modelo de Isa Klein.',
      price: 50,
      category: 'Móbiles',
      subcategory: 'Balão Colmeia',
      measure: '45 cm',
      imageUrls: [
        '/Produtos/Mobilis/BalaoColmeia/DuploVerdeeRoxo.jpg',
        '/Produtos/Mobilis/BalaoColmeia/DuploVerdeeRoxo_2.jpg'
      ],
    },
    // Mandalas
    {
      name: 'Nise da Silveira Lilás',
      description: 'Móbile de duas mandalas coladas interpostas dando efeito de 14 pontas. Papel com estampas exclusivas e lindas pedrarias para compor a peça finalizada com ponteiras de tons combinados com a estampa. Estampas e modelo de Isa Klein.',
      price: 65,
      category: 'Mandalas',
      measure: '58 cm',
      imageUrls: [
        '/Produtos/Mandalas/NisedaSilveiraLilas.jpg',
        '/Produtos/Mandalas/NisedaSilveiraLilas_2.jpg',
        '/Produtos/Mandalas/NisedaSilveiraLilas_3.jpg'
      ],
    },
    {
      name: 'Nise da Silveira Azul',
      description: 'Móbile de duas mandalas coladas interpostas dando efeito de 14 pontas. Papel com estampas exclusivas e lindas pedrarias para compor a peça finalizada com ponteiras de tons combinados com a estampa. Estampas e modelo de Isa Klein.',
      price: 65,
      category: 'Mandalas',
      measure: '58 cm',
      imageUrls: [
        '/Produtos/Mandalas/NisedaSilveiraAzul.jpg',
        '/Produtos/Mandalas/NisedaSilveiraAzul_2.jpg',
        '/Produtos/Mandalas/NisedaSilveiraAzul_3.jpg'
      ],
    },
    {
      name: 'Nise da Silveira Verde e Azul',
      description: 'Móbile de duas mandalas coladas interpostas dando efeito de 14 pontas. Papel com estampas exclusivas e lindas pedrarias para compor a peça finalizada com ponteiras de tons combinados com a estampa. Estampas e modelo de Isa Klein.',
      price: 65,
      category: 'Mandalas',
      measure: '58 cm',
      imageUrls: [
        '/Produtos/Mandalas/NisedaSilveiraVerdeeAzul.jpg',
        '/Produtos/Mandalas/NisedaSilveiraVerdeeAzul_2.jpg',
        '/Produtos/Mandalas/NisedaSilveiraVerdeeAzul_3.jpg'
      ],
    },
    {
      name: 'Nise da Silveira Verde e Lilás',
      description: 'Móbile de duas mandalas coladas interpostas dando efeito de 14 pontas. Papel com estampas exclusivas e lindas pedrarias para compor a peça finalizada com ponteiras de tons combinados com a estampa. Estampas e modelo de Isa Klein.',
      price: 65,
      category: 'Mandalas',
      measure: '58 cm',
      imageUrls: [
        '/Produtos/Mandalas/NisedaSilveiraVerdeeLilas.jpg',
        '/Produtos/Mandalas/NisedaSilveiraVerdeeLilas_2.jpg',
        '/Produtos/Mandalas/NisedaSilveiraVerdeeLilas_3.jpg'
      ],
    },
    // Kussudamas
    {
      name: 'Florescer azul e amarelo',
      description: 'Kusudama com 90 módulos, parte central azul e flores com estampas exclusivas nos tons azul e amarelo e miolo de strass. Peças em acrílico, metais compondo o fio para o equilíbrio da peça finalizada com um tassel. Estampa e modelo de Isa Klein.',
      price: 210,
      category: 'Kussudamas',
      measure: '70 cm',
      imageUrls: [
        '/Produtos/Kussudamas/AzuleAmarelo.jpg',
        '/Produtos/Kussudamas/AzuleAmarelo_2.jpg',
        '/Produtos/Kussudamas/AzuleAmarelo_3.jpg'
      ],
    },
    {
      name: 'Florescer marrom e azul',
      description: 'Kusudama com 90 módulos, parte central marron e flores com estampas exclusivas nos tons marron e azul e miolo de strass. Peças em acrílico, metais compondo o fio para o equilíbrio da peça finalizada com um tassel. Estampa e modelo de Isa Klein.',
      price: 210,
      category: 'Kussudamas',
      measure: '70 cm',
      imageUrls: [
        '/Produtos/Kussudamas/MarromeAzul.jpg',
        '/Produtos/Kussudamas/MarromeAzul_2.jpg',
        '/Produtos/Kussudamas/MarromeAzul_3.jpg'
      ],
    },
    {
      name: 'Florescer verde e rosa',
      description: 'Kusudama com 90 módulos, parte central verde e flores com estampas exclusivas nos tons verde e rosa e miolo de strass. Peças em acrílico, metais compondo o fio para o equilíbrio da peça finalizada com um tassel. Estampa e modelo de Isa Klein.',
      price: 210,
      category: 'Kussudamas',
      measure: '70 cm',
      imageUrls: [
        '/Produtos/Kussudamas/VerdeeRosa.jpg',
        '/Produtos/Kussudamas/VerdeeRosa_2.jpg',
        '/Produtos/Kussudamas/VerdeeRosa_3.jpg'
      ],
    },
    {
      name: 'Florescer marrom e laranja',
      description: 'Kusudama com 90 módulos, parte central marron e flores com estampas exclusivas nos tons marron e laranja e miolo de strass. Peças em acrílico, metais compondo o fio para o equilíbrio da peça finalizada com um tassel. Estampa e modelo de Isa Klein.',
      price: 210,
      category: 'Kussudamas',
      measure: '70 cm',
      imageUrls: [
        '/Produtos/Kussudamas/MarromeLaranja.jpg',
        '/Produtos/Kussudamas/MarromeLaranja_2.jpg',
        '/Produtos/Kussudamas/MarromeLaranja_3.jpg'
      ],
    },
    // Colares de Mesa
    {
      name: 'Colar de mesa Espírito Santo',
      description: 'Colar de mesa com peças em acrílico transparente e metais prateados. Medalha com pomba prateada em fundo branco.',
      price: 150,
      category: 'Colares de Mesa',
      measure: '110 cm',
      imageUrls: [
        '/Produtos/ColaresdeMesa/EspiritoSanto.jpg',
        '/Produtos/ColaresdeMesa/EspiritoSanto_2.jpg',
        '/Produtos/ColaresdeMesa/EspiritoSanto_3.jpg',
        '/Produtos/ColaresdeMesa/EspiritoSanto_4.jpg'
      ],
    },
    {
      name: 'Colar de mesa rústico terracota',
      description: 'Colar de mesa com peças em acrílico e madeira intercaladas. Em uma ponteira um tassel e, em outra, folha em madeira no tom terracota.',
      price: 140,
      category: 'Colares de Mesa',
      measure: '117 cm',
      imageUrls: [
        '/Produtos/ColaresdeMesa/Terracota.jpg',
        '/Produtos/ColaresdeMesa/Terracota_2.jpg',
        '/Produtos/ColaresdeMesa/Terracota_3.jpg',
        '/Produtos/ColaresdeMesa/Terracota_4.jpg'
      ],
    },
    {
      name: 'Colar de mesa rústico marrom',
      description: 'Colar de mesa com peças em madeira de diferentes formatos intercaladas. Em uma ponteira um tassel e, em outra, folha em madeira marrom.',
      price: 105,
      category: 'Colares de Mesa',
      measure: '103 cm',
      imageUrls: [
        '/Produtos/ColaresdeMesa/Marrom.jpg',
        '/Produtos/ColaresdeMesa/Marrom_2.jpg',
        '/Produtos/ColaresdeMesa/Marrom_3.jpg',
        '/Produtos/ColaresdeMesa/Marrom_4.jpg'
      ],
    },
    {
      name: 'Colar de mesa azul',
      description: 'Colar de mesa com peças em acrílico e madeira intercaladas em tons neutros e azul, finalizado com uma ponteira de tassel.',
      price: 125,
      category: 'Colares de Mesa',
      measure: '102 cm',
      imageUrls: [
        '/Produtos/ColaresdeMesa/Azul.jpg',
        '/Produtos/ColaresdeMesa/Azul_2.jpg',
        '/Produtos/ColaresdeMesa/Azul_3.jpg',
        '/Produtos/ColaresdeMesa/Azul_4.jpg'
      ],
    },
    {
      name: 'Colar de mesa perolado',
      description: 'Colar de mesa com peças em acrílico e madeira intercaladas em tons perolados, finalizado com uma ponteira de tassel.',
      price: 140,
      category: 'Colares de Mesa',
      measure: '102 cm',
      imageUrls: [
        '/Produtos/ColaresdeMesa/Perolado.jpg',
        '/Produtos/ColaresdeMesa/Perolado_2.jpg',
        '/Produtos/ColaresdeMesa/Perolado_3.jpg',
        '/Produtos/ColaresdeMesa/Perolado_4.jpg'
      ],
    },
    // Escapulários de Porta
    {
      name: 'Escapulário Espírito Santo',
      description: 'Escapulário com 2 medalhões com uma pomba dourada em uma face e a oração do Divino Espírito Santo na outra. Finalizado com peças e tassel dourados.',
      price: 120,
      category: 'Escapulários de Porta',
      measure: '204 cm',
      imageUrls: [
        '/Produtos/EscapuláriodePorta/Escapulario.jpg',
        '/Produtos/EscapuláriodePorta/Escapulario_2.jpg',
        '/Produtos/EscapuláriodePorta/Escapulario_3.jpg',
        '/Produtos/EscapuláriodePorta/Escapulario_4.jpg'
      ],
    },
    // Adornos de Porta e/ou Berço
    {
      name: 'Adorno Anjo azul',
      description: 'Adorno montado com peças azuis e ponta com anjo metálico dourado.',
      price: 45,
      category: 'Adornos de Porta e/ou Berço',
      subcategory: 'Anjo',
      measure: '23 cm',
      imageUrls: [
        '/Produtos/AdornosdeBerçoePorta/Anjo/AnjoMetalicoAzul.jpg'
      ],
    },
    {
      name: 'Adorno Anjo rosa',
      description: 'Adorno montado com peças rosa e ponta com anjo metálico dourado.',
      price: 45,
      category: 'Adornos de Porta e/ou Berço',
      subcategory: 'Anjo',
      measure: '24 cm',
      imageUrls: [
        '/Produtos/AdornosdeBerçoePorta/Anjo/AnjoMetalicoRosa.jpg'
      ],
    },
    {
      name: 'Adorno Anjo da Guarda',
      description: 'Adorno com peças acrílicas e em madeira intercaladas e finalizado com medalha com imagem de um anjo em uma face e a Oração do Santo Anjo na outra.',
      price: 40,
      category: 'Adornos de Porta e/ou Berço',
      subcategory: 'Anjo',
      measure: '18 cm',
      imageUrls: [
        '/Produtos/AdornosdeBerçoePorta/Anjo/AnjodaGuarda.jpg',
        '/Produtos/AdornosdeBerçoePorta/Anjo/AnjodaGuarda_2.jpg',
        '/Produtos/AdornosdeBerçoePorta/Anjo/AnjodaGuarda_3.jpg'
      ],
    },
    {
      name: 'Adorno Anjo em medalha',
      description: 'Adorno com peças em madeira e douradas intercaladas e finalizado com anjo em medalha metálica dourada.',
      price: 65,
      category: 'Adornos de Porta e/ou Berço',
      subcategory: 'Anjo',
      measure: '34 cm',
      imageUrls: [
        '/Produtos/AdornosdeBerçoePorta/Anjo/AnjoMedalha.jpg',
        '/Produtos/AdornosdeBerçoePorta/Anjo/AnjoMedalha_2.jpg'
      ],
    },
    {
      name: 'Quadro de Porta',
      description: 'Quadro personalizado com o nome do bebê em letras de MDF, papéis e adornos. Personalize com o estilo e nome desejados.',
      price: 80,
      category: 'Adornos de Porta e/ou Berço',
      subcategory: 'Quadrodeporta',
      measure: '',
      imageUrls: [
        '/Produtos/AdornosdeBerçoePorta/Quadrodeporta/Quadrodeporta.jpg',
        '/Produtos/AdornosdeBerçoePorta/Quadrodeporta/Quadrodeporta_2.jpg',
        '/Produtos/AdornosdeBerçoePorta/Quadrodeporta/Quadrodeporta_3.jpg'
      ],
    },
    {
      name: 'Quadro Espírito Santo 23x23',
      description: 'Quadro composto por módulos tradicionais que adaptados e modificados por Linaorigamis formou uma bela cruz pra receber o Espírito Santo.',
      price: 130,
      category: 'Quadros de Origami',
      subcategory: 'Espírito Santo',
      measure: '23cm x 23cm',
      imageUrls: [
        '/Produtos/Quadros/EspiritoSanto/EspiritoSanto.jpg',
        '/Produtos/Quadros/EspiritoSanto/EspiritoSanto_2.jpg',
        '/Produtos/Quadros/EspiritoSanto/EspiritoSanto_3.jpg'
      ],
    },
    {
      name: 'Quadro Espírito Santo 23x33',
      description: 'Quadro composto por módulos tradicionais que adaptados e modificados por Linaorigamis formou uma bela cruz pra receber o Espírito Santo.',
      price: 150,
      category: 'Quadros de Origami',
      subcategory: 'Espírito Santo',
      measure: '23cm x 33cm',
      imageUrls: [
        '/Produtos/Quadros/EspiritoSanto/01EspiritoSanto.jpg',
        '/Produtos/Quadros/EspiritoSanto/01EspiritoSanto_2.jpg',
        '/Produtos/Quadros/EspiritoSanto/02EspiritoSanto.jpg',
        '/Produtos/Quadros/EspiritoSanto/02EspiritoSanto_2.jpg'
      ],
    },
    {
      name: 'Quadro Mandala com Espírito Santo 33x33',
      description: 'Quadro com a mandala Blossom e Macuxi e, no centro uma pomba, representando o Espírito Santo. Papel com estampa exclusiva nos tons de azul e dourado. Mandalas Blossom e Macuxi de Falk Brito. Papel de Isa Klein. Espírito Santo de Peterpaul Forcher.',
      price: 150,
      category: 'Quadros de Origami',
      subcategory: 'Mandala com Espírito Santo',
      measure: '33cm x 33cm',
      imageUrls: [
        '/Produtos/Quadros/MandalacomEspiritoSanto/Quadromandalacomespiritosanto.jpg',
        '/Produtos/Quadros/MandalacomEspiritoSanto/Quadromandalacomespiritosanto_2.jpg'
        ],
      },
      {
      name: 'Quadro Flocos de Neve 33x33',
      description: 'Quadro com três Mandalas Flocos de Neve com estampas impressas no papel vegetal. Mandalas Flocos de Neve de Jaciara Grzybowski.',
      price: 150,
      category: 'Quadros de Origami',
      subcategory: 'Flocos de Neve',
      measure: '33cm x 33cm',
      imageUrls: [
        '/Produtos/Quadros/Flocosdeneve/Quadroflocosdeneve.jpg',
        '/Produtos/Quadros/Flocosdeneve/Quadroflocosdeneve_2.jpg'
      ],
    },
    {
      name: 'Quadro Papoulas 33x33',
      description: 'Quadro composto por 25 papoulas coloridas nos tons Candy colors.',
      price: 230,
      category: 'Quadros de Origami',
      subcategory: 'Papoulas',
      measure: '33cm x 33cm',
      imageUrls: [
        '/Produtos/Quadros/Papoulas/Quadropapoulas.jpg',
        '/Produtos/Quadros/Papoulas/Quadropapoulas_2.jpg',
      ],
    },
    {
      name: 'Filtro dos Sonhos Branco',
      description: 'Filtro todo em branco com papéis de diferentes texturas, 5 fios com uso dos elementos: lírio, leque e coração. Inspirado no curso Filtro dos Sonhos de Isa Klein.',
      price: 120,
      category: 'Filtros dos Sonhos',
      measure: '110 cm (diâmetro: 23 cm)',
      imageUrls: [
        '/Produtos/FiltrodosSonhos/FiltroBranco.jpg',
        '/Produtos/FiltrodosSonhos/FiltroBranco_2.jpg',
        '/Produtos/FiltrodosSonhos/FiltroBranco_3.jpg'
      ],
    },
    {
      name: 'Filtro dos Sonhos Azul com Tsuru',
      description: 'Aro do filtro no papel azul perolizado, 5 fios prateados com a ponteira prata protegida pelo mesmo papel do aro. Um Tsuru com papel estampado no centro do aro. Inspirado no curso Filtro dos Sonhos de Isa Klein.',
      price: 170,
      category: 'Filtros dos Sonhos',
      measure: '110 cm (diâmetro: 31 cm)',
      imageUrls: [
        '/Produtos/FiltrodosSonhos/Filtroazulcomtsuru.jpg',
        '/Produtos/FiltrodosSonhos/Filtroazulcomtsuru_2.jpg',
        '/Produtos/FiltrodosSonhos/Filtroazulcomtsuru_3.jpg'
      ],
    },
    {
      name: 'Filtro dos Sonhos Azul e Laranja',
      description: 'Aro com estampa exclusiva nos tons de azul e laranja. 5 fios trazendo os elementos: campânula, coração e flecha nos tons da estampa. Inspirado no curso Filtro dos Sonhos de Isa Klein.',
      price: 120,
      category: 'Filtros dos Sonhos',
      measure: '88 cm (diâmetro: 19 cm)',
      imageUrls: [
        '/Produtos/FiltrodosSonhos/Filtroazulelaranja.jpg',
        '/Produtos/FiltrodosSonhos/Filtroazulelaranja_2.jpg',
        '/Produtos/FiltrodosSonhos/Filtroazulelaranja_3.jpg'
      ],
    },
    {
      name: 'Filtro dos Sonhos Azul e Rosa',
      description: 'Filtro composto por dois atos. O primeiro, liso, azul, com papel perolizado. O segundo, estampado com tons de azul, rosa e dourado. Os fios são com ponteiras douradas com detalhes coloridos, com a mesma estampa do aro. Inspirado no curso Filtro dos Sonhos de Isa Klein.',
      price: 170,
      category: 'Filtros dos Sonhos',
      measure: '118 cm (diâmetro: 31 e 18 cm)',
      imageUrls: [
        '/Produtos/FiltrodosSonhos/Filtroazulerosa.jpg',
        '/Produtos/FiltrodosSonhos/Filtroazulerosa_2.jpg',
        '/Produtos/FiltrodosSonhos/Filtroazulerosa_3.jpg',
        '/Produtos/FiltrodosSonhos/Filtroazulerosa_4.jpg'
      ],
    },
    {
      name: 'Filtro dos Sonhos Marrom e Verde',
      description: 'Filtro composto por dois aros no tom marrom perolizado. 5 fios trazendo leques e borboletas nos tons marrom e verde. Estampa e modelo de Isa Klein.',
      price: 140,
      category: 'Filtros dos Sonhos',
      measure: '110 cm (diâmetro: 23 e 15 cm)',
      imageUrls: [
        '/Produtos/FiltrodosSonhos/Filtromarromeverde.jpg',
        '/Produtos/FiltrodosSonhos/Filtromarromeverde_2.jpg',
        '/Produtos/FiltrodosSonhos/Filtromarromeverde_3.jpg',
        '/Produtos/FiltrodosSonhos/Filtromarromeverde_4.jpg'
      ],
    },
    {
      name: 'Lápis com Tulipa',
      description: 'Lápis com tulipas coloridas em suas ponteiras acompanhando a estampa do lápis.',
      price: 10,
      category: 'Material de Escritório',
      measure: '20 cm',
      imageUrls: [
        '/Produtos/MaterialEscritório/LapiscomTulipa.jpg',
        '/Produtos/MaterialEscritório/LapiscomTulipa_2.jpg'
      ],
    },
    {
      name: 'Marcadores de Página',
      description: 'Marcadores de página em papel Kraft com Tsuru ou coração com Espírito Santo na ponta. No centro papéis estampados.',
      price: 10,
      category: 'Material de Escritório',
      measure: '15 cm',
      imageUrls: [
        '/Produtos/MaterialEscritório/MarcadordePagina.jpg',
        '/Produtos/MaterialEscritório/MarcadordePagina_2.jpg',
        '/Produtos/MaterialEscritório/MarcadordePagina_3.jpg'
      ],
    },
    {
      name: 'Cadeira de Praia em Fio Náutico',
      description: 'Cadeira de praia trançada com fio Náutico de excelente qualidade na técnica de tecelagem manual e gráfico desenvolvido pelo Studio Andorinha. Paleta de cores escolhida ao fazer a encomenda.',
      price: 380,
      category: 'Cadeira de Praia em Fio Náutico',
      measure: '',
      imageUrls: [
        '/Produtos/CadeirasdePraia/CadeirasdePraia.jpg',
        '/Produtos/CadeirasdePraia/CadeirasdePraia_2.jpg'
      ],
    },
    // Decoração de Natal
    {
      name: 'Guirlanda de pérolas',
      description: 'Guirlanda trabalhada em fio dourado formando chuveirinhos usando 1000 pérolas e mandala central com fundo em linho, pérolas em círculos e imagem de José, Maria e a manjedoura impressa em acrílico dourado.',
      price: 260,
      category: 'Decoração de Natal',
      measure: 'Diâmetro: 45 cm',
      imageUrls: [
        '/Produtos/Natal/guirlanda_perolas.jpg',
        '/Produtos/Natal/guirlanda_perolas2.jpg',
        '/Produtos/Natal/guirlanda_perolas3.jpg'
      ],
    },
    {
      name: 'Colar de mesa verde e vermelho',
      description: 'Colar composto com pérolas coloridas em tons fortes natalinos e peças amadeiradas e nas pontas pérolas maiores e tassel vermelhos.',
      price: 160,
      category: 'Decoração de Natal',
      measure: '135 cm',
      imageUrls: [
        '/Produtos/Natal/Colar_mesa_verde_vermelho.jpg',
        '/Produtos/Natal/Colar_mesa_verde_vermelho2.jpg',
        '/Produtos/Natal/Colar_mesa_verde_vermelho3.jpg'
      ],
    },
    {
      name: 'Colar de mesa verde',
      description: 'Colar composto com peças acrílicas transparentes verdes e detalhes dourados. Em uma ponta, árvore de Natal em madeira e na outra, tassel verde.',
      price: 150,
      category: 'Decoração de Natal',
      measure: '125 cm',
      imageUrls: [
        '/Produtos/Natal/Colar_mesa_verde.jpg',
        '/Produtos/Natal/Colar_mesa_verde2.jpg',
        '/Produtos/Natal/Colar_mesa_verde3.jpg'
      ],
    },
    {
      name: 'Colar de mesa vermelho',
      description: 'Colar composto com pérolas douradas e vermelhas, detalhes dourados e, nas pontas pérola vermelha grande e tassel vermelho.',
      price: 150,
      category: 'Decoração de Natal',
      measure: '140 cm',
      imageUrls: [
        '/Produtos/Natal/Colar_mesa_vermelho.jpg',
        '/Produtos/Natal/Colar_mesa_vermelho2.jpg',
        '/Produtos/Natal/Colar_mesa_vermelho3.jpg'
      ],
    },
    {
      name: 'Trio de árvores vermelhas',
      description: 'Conjunto de três árvores de Natal, cobertas por fio em cores natalinas, predominantemente vermelho. Meias pérolas coladas, em tamanhos diferentes, simulando gotas. Base redonda em madeira e uma flor vermelha de origami.',
      price: 85,
      category: 'Decoração de Natal',
      measure: '14, 24 e 33 cm',
      imageUrls: [
        '/Produtos/Natal/Trio_arvores_vermelhas.jpeg'
      ],
    },
    {
      name: 'Trio de árvores douradas',
      description: 'Conjunto de três árvores de Natal, cobertas por juta com fio dourado. Meias pérolas coladas, em tamanhos diferentes, simulando gotas. Base redonda em madeira e uma flor vermelha de origami.',
      price: 85,
      category: 'Decoração de Natal',
      measure: '14, 24 e 33 cm',
      imageUrls: [
        '/Produtos/Natal/Trio_arvores_douradas.jpg',
        '/Produtos/Natal/Trio_arvores_douradas2.jpg'
      ],
    },
    {
      name: 'Anjo em Pingente P',
      description: 'Anjo dobrado com papel perolizado, auréola dourada e laço em fita simulando as asas.',
      price: 15,
      category: 'Decoração de Natal',
      measure: '9 cm',
      imageUrls: [
        '/Produtos/Natal/Anjo_Pingente_P.jpg',
        '/Produtos/Natal/Anjo_Pingente_P_2.jpg',
        '/Produtos/Natal/Anjo_Pingente_P3.jpg',
        '/Produtos/Natal/Anjo_Pingente_P4.jpg'
      ],
    },
    {
      name: 'Anjo em Pingente M',
      description: 'Anjo dobrado com papel perolizado, auréola dourada e laço em fita simulando as asas.',
      price: 20,
      category: 'Decoração de Natal',
      measure: '13 cm',
      imageUrls: [
        '/Produtos/Natal/Anjo_Pingente_M.jpg',
        '/Produtos/Natal/Anjo_Pingente_P_2.jpg'
      ],
    },
    {
      name: 'Anjo em Pingente G',
      description: 'Anjo dobrado com papel perolizado, auréola dourada e laço em fita simulando as asas.',
      price: 25,
      category: 'Decoração de Natal',
      measure: '15 cm',
      imageUrls: [
        '/Produtos/Natal/Anjo_Pingente_G.jpg',
        '/Produtos/Natal/Anjo_Pingente_G2.jpg'
      ],
    },
    {
      name: 'Guirlanda Floral P',
      description: 'Guirlanda tecida em crochê usando um fio em cores natalinas. Arranjo em origami composto por flores vermelhas e douradas com pérolas e strass no centro e galhos verdes. Laço em gorgurão vermelho no centro.',
      price: 130,
      category: 'Decoração de Natal',
      measure: '22 cm',
      imageUrls: [
        '/Produtos/Natal/Guirlanda_Floral_P.jpg',
        '/Produtos/Natal/Guirlanda_Floral_P2.jpg',
        '/Produtos/Natal/Guirlanda_Floral_P3.jpg'
      ],
    },
    {
      name: 'Guirlanda Floral G',
      description: 'Guirlanda tecida em crochê usando um fio em cores natalinas. Arranjo em origami composto por flores vermelhas e douradas com pérolas e strass no centro e galhos verdes. Laço em gorgurão vermelho no centro.',
      price: 150,
      category: 'Decoração de Natal',
      measure: '30 cm',
      imageUrls: [
        '/Produtos/Natal/Guirlanda_Floral_G.jpg',
        '/Produtos/Natal/Guirlanda_Floral_G2.jpg',
        '/Produtos/Natal/Guirlanda_Floral_G3.jpg'
      ],
    },
    {
      name: 'Escapulário de Porta Nude',
      description: 'Escapulário em fita de gorgurão nude. Nas pontas, mandalas forradas com linho. De um lado, impressão Feliz Natal em acrílico dourado e na outra ponta, imagem da manjedoura, Maria e José, também impressa em acrílico dourado.',
      price: 95,
      category: 'Decoração de Natal',
      measure: '168 cm',
      imageUrls: [
        '/Produtos/Natal/Escapulario_Porta_Nude.jpg',
        '/Produtos/Natal/Escapulario_Porta_Nude2.jpg',
        '/Produtos/Natal/Escapulario_Porta_Nude3.jpg'
      ],
    },
    {
      name: 'Escapulário de porta Floral',
      description: 'Escapulário em fita de gorgurão vermelha. Nas pontas, mandalas forradas com linho e letras de mdf compondo Feliz Natal e flores vermelhas em origami e folhas plissadas verdes.',
      price: 130,
      category: 'Decoração de Natal',
      measure: '152 cm',
      imageUrls: [
        '/Produtos/Natal/Escapulario_porta_Floral.jpg',
        '/Produtos/Natal/Escapulario_porta_Floral2.jpg',
        '/Produtos/Natal/Escapulario_porta_Floral3.jpg'
      ],
    },
  ];

  await Product.bulkCreate(products);

  const hashedPassword = await bcrypt.hash('45221700', 10);

  await Admin.create({
    email: 'amgoulart@hotmail.com',
    password: hashedPassword
  });

  console.log('Produtos e admin inseridos!');
  process.exit();
}

seed();