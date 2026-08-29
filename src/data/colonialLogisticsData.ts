import { ShippingOption, ShippingSimulationResult } from '../types';

export interface HistoricCityInfo {
  name: string;
  state: string;
  cepPrefixes: string[];
  sampleCep: string;
  nickname: string;
  circuitName: string;
  perkDescription: string;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  freeShippingThreshold: number;
  icon: string;
}

export const HISTORIC_CITIES_MG: HistoricCityInfo[] = [
  {
    name: 'Ouro Preto',
    state: 'MG',
    cepPrefixes: ['35400', '35401', '35402', '35403', '35404', '35405', '35406', '35407', '35408', '35409', '35410', '35411', '35412', '35413', '35414', '35415'],
    sampleCep: '35400-000',
    nickname: 'Capital do Barroco e Patrimônio Mundial',
    circuitName: 'Circuito do Ouro',
    perkDescription: 'Carruagem Expressa: Entrega no Mesmo Dia (pedidos até as 14h) ou em até 24h. Frete Grátis e entrega direta no casario histórico ou retirada no Ateliê de Cachoeira do Campo.',
    deliveryDaysMin: 0,
    deliveryDaysMax: 1,
    freeShippingThreshold: 0,
    icon: '🏛️',
  },
  {
    name: 'Mariana',
    state: 'MG',
    cepPrefixes: ['35420', '35421', '35422', '35423', '35424', '35425'],
    sampleCep: '35420-000',
    nickname: 'Primeira Capital de Minas Gerais',
    circuitName: 'Circuito do Ouro',
    perkDescription: 'Linha Direta Mariana-Ouro Preto: Entrega em até 24 horas via portador colonial com proteção térmica e seguro de quebra para peças sacras.',
    deliveryDaysMin: 1,
    deliveryDaysMax: 1,
    freeShippingThreshold: 0,
    icon: '⛪',
  },
  {
    name: 'Tiradentes',
    state: 'MG',
    cepPrefixes: ['36325'],
    sampleCep: '36325-000',
    nickname: 'Berço da Inconfidência & Alta Gastronomia',
    circuitName: 'Trilha dos Inconfidentes',
    perkDescription: 'Expedição Estrada Real: Entrega em 1 a 2 dias úteis em engradado de madeira ecológico com certificado de autenticidade do mestre artesão.',
    deliveryDaysMin: 1,
    deliveryDaysMax: 2,
    freeShippingThreshold: 49,
    icon: '🔔',
  },
  {
    name: 'São João del-Rei',
    state: 'MG',
    cepPrefixes: ['36300', '36301', '36302', '36305', '36307', '36309'],
    sampleCep: '36300-000',
    nickname: 'Terra dos Sinos e da Maria Fumaça',
    circuitName: 'Trilha dos Inconfidentes',
    perkDescription: 'Rota Ferroviária Colonial: Entrega ágil em 1 a 2 dias com seguro total e tripla camada de plástico bolha para panelas e rechauds de pedra.',
    deliveryDaysMin: 1,
    deliveryDaysMax: 2,
    freeShippingThreshold: 49,
    icon: '🚂',
  },
  {
    name: 'Diamantina',
    state: 'MG',
    cepPrefixes: ['39100', '39101', '39102'],
    sampleCep: '39100-000',
    nickname: 'Terra de Chica da Silva & Vesperatas',
    circuitName: 'Circuito dos Diamantes',
    perkDescription: 'Rota dos Diamantes: Entrega em 2 a 3 dias úteis com embalagem especial para doces de tacho, queijos do Serro e arte sacra talhada.',
    deliveryDaysMin: 2,
    deliveryDaysMax: 3,
    freeShippingThreshold: 99,
    icon: '💎',
  },
  {
    name: 'Congonhas',
    state: 'MG',
    cepPrefixes: ['36415', '36416', '36417', '36418'],
    sampleCep: '36415-000',
    nickname: 'Cidade dos Profetas de Aleijadinho',
    circuitName: 'Circuito da Fé e do Ouro',
    perkDescription: 'Linha dos Profetas: Entrega em 1 a 2 dias úteis via rota expressa MG-030.',
    deliveryDaysMin: 1,
    deliveryDaysMax: 2,
    freeShippingThreshold: 49,
    icon: '🌄',
  },
  {
    name: 'Sabará',
    state: 'MG',
    cepPrefixes: ['34505', '34515', '34525', '34535'],
    sampleCep: '34505-000',
    nickname: 'Vila Real de Nossa Senhora da Conceição',
    circuitName: 'Circuito do Ouro Metropolitano',
    perkDescription: 'Linha Histórica Sabará: Entrega em 24h a 48h.',
    deliveryDaysMin: 1,
    deliveryDaysMax: 2,
    freeShippingThreshold: 49,
    icon: '🎨',
  },
  {
    name: 'Ouro Branco',
    state: 'MG',
    cepPrefixes: ['36420'],
    sampleCep: '36420-000',
    nickname: 'Porta Sul da Estrada Real',
    circuitName: 'Circuito do Ouro',
    perkDescription: 'Entrega direta no sopé da Serra do Ouro Branco em 24h.',
    deliveryDaysMin: 1,
    deliveryDaysMax: 2,
    freeShippingThreshold: 0,
    icon: '🏔️',
  },
  {
    name: 'Catas Altas & Santa Bárbara',
    state: 'MG',
    cepPrefixes: ['35969', '35960'],
    sampleCep: '35969-000',
    nickname: 'Santuário do Caraça',
    circuitName: 'Circuito Entre Serras da Piedade ao Caraça',
    perkDescription: 'Transporte ecológico protegido com entrega em 1 a 2 dias.',
    deliveryDaysMin: 1,
    deliveryDaysMax: 2,
    freeShippingThreshold: 49,
    icon: '⛪',
  },
];

export const QUICK_LOCATION_PRESETS = [
  { label: '🏛️ Ouro Preto (Centro)', cep: '35400-000', tag: 'Mesmo Dia - Grátis' },
  { label: '⛪ Mariana (MG)', cep: '35420-000', tag: '24 Horas' },
  { label: '🔔 Tiradentes (MG)', cep: '36325-000', tag: '1 a 2 Dias' },
  { label: '🚂 São João del-Rei', cep: '36300-000', tag: '1 a 2 Dias' },
  { label: '💎 Diamantina (MG)', cep: '39100-000', tag: '2 a 3 Dias' },
  { label: '🌆 Belo Horizonte (MG)', cep: '30130-000', tag: '24h a 48h' },
  { label: '🏙️ São Paulo (SP)', cep: '01310-100', tag: '2 a 3 Dias' },
  { label: '🏖️ Rio de Janeiro (RJ)', cep: '20040-002', tag: '2 a 4 Dias' },
  { label: '🏛️ Brasília (DF)', cep: '70040-010', tag: '3 a 5 Dias' },
  { label: '🌲 Curitiba (PR)', cep: '80020-010', tag: '3 a 5 Dias' },
];

/**
 * Calculates estimated delivery dates formatted in Portuguese
 */
export function getEstimatedDateText(daysMin: number, daysMax: number): string {
  const now = new Date();
  const targetMin = new Date(now);
  const targetMax = new Date(now);

  // Business days calculation
  let addedMin = 0;
  while (addedMin < daysMin) {
    targetMin.setDate(targetMin.getDate() + 1);
    if (targetMin.getDay() !== 0 && targetMin.getDay() !== 6) {
      addedMin++;
    }
  }

  let addedMax = 0;
  while (addedMax < daysMax) {
    targetMax.setDate(targetMax.getDate() + 1);
    if (targetMax.getDay() !== 0 && targetMax.getDay() !== 6) {
      addedMax++;
    }
  }

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', weekday: 'short' };
  
  if (daysMin === 0 && daysMax <= 1) {
    return 'Hoje ou Amanhã (até 24h)';
  }

  if (daysMin === daysMax) {
    return `${targetMax.toLocaleDateString('pt-BR', options)}`;
  }

  return `Entre ${targetMin.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} e ${targetMax.toLocaleDateString('pt-BR', options)}`;
}

/**
 * Core shipping engine that returns tailored shipping tiers
 */
export function calculateColonialShipping(
  cepClean: string,
  cityName: string,
  stateUf: string,
  productPrice: number = 289.9,
  productWeightKg: number = 4.2
): ShippingSimulationResult {
  const clean5 = cepClean.slice(0, 5);
  const clean2 = cepClean.slice(0, 2);
  const isMG = stateUf.toUpperCase() === 'MG' || (clean2 >= '30' && clean2 <= '39');

  // Check if it matches any Historic City in MG
  const matchedHistoric = HISTORIC_CITIES_MG.find((hc) =>
    hc.cepPrefixes.some((p) => clean5.startsWith(p) || p.startsWith(clean5)) ||
    hc.name.toLowerCase() === cityName.toLowerCase()
  );

  const isOuroPretoOrMariana =
    matchedHistoric?.name === 'Ouro Preto' ||
    matchedHistoric?.name === 'Mariana' ||
    clean5.startsWith('3540') ||
    clean5.startsWith('3542');

  const options: ShippingOption[] = [];

  // =========================================================================
  // TIER 1: DIFERENCIAL LOGÍSTICA COLONIAL (ESTRADA REAL & HISTÓRICAS)
  // =========================================================================
  if (isOuroPretoOrMariana) {
    // Ultra fast local colonial courier
    options.push({
      id: 'colonial-express-local',
      name: 'Logística Colonial Expressa (Carruagem Portador)',
      carrier: 'Mercado Colonial Ouro Preto - Portador Local',
      price: 0,
      originalPrice: 15.0,
      deliveryDaysMin: 0,
      deliveryDaysMax: 1,
      deliveryDateEstimated: getEstimatedDateText(0, 1),
      isColonialSpecial: true,
      badge: '👑 Exclusivo Ouro Preto & Mariana',
      description: 'Entrega local direta dos ateliês de pedra-sabão no mesmo dia para pedidos feitos até as 14h. Embalagem artesanal de chita e zero emissão de carbono.',
      iconType: 'horse_carriage',
      insuranceIncluded: true,
      specialPackaging: 'Embalagem de chita mineira + almofada protetora',
    });

    options.push({
      id: 'colonial-pickup',
      name: 'Retirada Imediata no Ateliê Colonial',
      carrier: 'Ateliê do Mestre Tonho - Cachoeira do Campo',
      price: 0,
      deliveryDaysMin: 0,
      deliveryDaysMax: 0,
      deliveryDateEstimated: 'Disponível em 2 horas',
      isColonialSpecial: true,
      badge: '⚡ Retirada Grátis',
      description: 'Retire diretamente no ateliê ou na Praça Tiradentes com café passado na hora e pão de queijo quentinho como cortesia.',
      iconType: 'box',
      insuranceIncluded: true,
      specialPackaging: 'Sacola ecológica de juta bordada',
    });
  } else if (matchedHistoric) {
    // Historic City in MG along Estrada Real
    const isFree = productPrice >= matchedHistoric.freeShippingThreshold;
    const price = isFree ? 0 : 9.9;

    options.push({
      id: 'estrada-real-express',
      name: `Expedição Estrada Real (${matchedHistoric.circuitName})`,
      carrier: 'Logística Colonial Estrada Real Express',
      price: price,
      originalPrice: isFree ? 28.0 : undefined,
      deliveryDaysMin: matchedHistoric.deliveryDaysMin,
      deliveryDaysMax: matchedHistoric.deliveryDaysMax,
      deliveryDateEstimated: getEstimatedDateText(matchedHistoric.deliveryDaysMin, matchedHistoric.deliveryDaysMax),
      isColonialSpecial: true,
      badge: `⭐ Rota Histórica de Minas (${matchedHistoric.name})`,
      description: `Transporte especializado direto pela Estrada Real com engradado de madeira protetor para peças de pedra-sabão e seguro anti-impacto.`,
      iconType: 'horse_carriage',
      insuranceIncluded: true,
      specialPackaging: 'Engradado de madeira ecológica + plástico bolha reforçado',
    });
  } else if (isMG) {
    // Belo Horizonte and other MG regions
    const isBeloHorizonte = clean2 === '30' || clean2 === '31' || cityName.toLowerCase().includes('belo horizonte');
    const daysMin = isBeloHorizonte ? 1 : 2;
    const daysMax = isBeloHorizonte ? 2 : 3;
    const isFree = productPrice >= 99;

    options.push({
      id: 'minas-express-colonial',
      name: 'Minas Express Colonial (Hub Ouro Preto -> BH)',
      carrier: 'Ouro Preto Logística & Cargas MG',
      price: isFree ? 0 : 12.9,
      originalPrice: isFree ? 24.9 : undefined,
      deliveryDaysMin: daysMin,
      deliveryDaysMax: daysMax,
      deliveryDateEstimated: getEstimatedDateText(daysMin, daysMax),
      isColonialSpecial: true,
      badge: '🚀 Entrega Rápida MG',
      description: 'Conexão direta diária Ouro Preto - Belo Horizonte e cidades de MG. Seguro integral contra avarias para artesanato.',
      iconType: 'truck',
      insuranceIncluded: true,
      specialPackaging: 'Caixa dupla de papelão kraft reforçado',
    });
  }

  // =========================================================================
  // STANDARD NATIONAL TIERS (CORREIOS SEDEX, PAC, TRANSPORTADORA)
  // =========================================================================
  // SEDEX Colonial
  let sedexDaysMin = isMG ? 1 : 2;
  let sedexDaysMax = isMG ? 2 : 4;
  let sedexPrice = isMG ? 19.9 : 34.9;

  if (clean2 >= '01' && clean2 <= '19') {
    // SP
    sedexDaysMin = 2;
    sedexDaysMax = 3;
    sedexPrice = 28.9;
  } else if (clean2 >= '20' && clean2 <= '28') {
    // RJ / ES
    sedexDaysMin = 2;
    sedexDaysMax = 3;
    sedexPrice = 26.9;
  } else if (clean2 >= '70' && clean2 <= '79') {
    // DF / GO / MT / MS
    sedexDaysMin = 3;
    sedexDaysMax = 4;
    sedexPrice = 38.9;
  } else if (clean2 >= '80' && clean2 <= '89') {
    // PR / SC / RS
    sedexDaysMin = 3;
    sedexDaysMax = 4;
    sedexPrice = 36.9;
  } else if (clean2 >= '40' && clean2 <= '69') {
    // NE / N
    sedexDaysMin = 4;
    sedexDaysMax = 6;
    sedexPrice = 48.9;
  }

  // Weight surcharge for heavy stone products
  if (productWeightKg > 4) {
    sedexPrice += Math.round((productWeightKg - 4) * 4);
  }

  options.push({
    id: 'correios-sedex',
    name: 'SEDEX Colonial Premium (Aéreo + Seguro Total)',
    carrier: 'Correios Brasil & Seguro Ouro Preto',
    price: sedexPrice,
    deliveryDaysMin: sedexDaysMin,
    deliveryDaysMax: sedexDaysMax,
    deliveryDateEstimated: getEstimatedDateText(sedexDaysMin, sedexDaysMax),
    isColonialSpecial: false,
    badge: '⚡ Mais Rápido para Fora de MG',
    description: 'Prioridade máxima de despacho em 24h úteis. Rastreamento detalhado etapa por etapa por WhatsApp.',
    iconType: 'plane',
    insuranceIncluded: true,
    specialPackaging: 'Tripla camada de proteção com selo "Cuidado: Frágil / Pedra-Sabão"',
  });

  // PAC Artesanato Econômico
  let pacDaysMin = isMG ? 3 : 5;
  let pacDaysMax = isMG ? 5 : 8;
  let pacPrice = isMG ? 12.0 : 19.9;
  const isPacFree = productPrice >= 199.0;

  options.push({
    id: 'correios-pac',
    name: 'PAC Artesanato Econômico',
    carrier: 'Correios Brasil',
    price: isPacFree ? 0 : pacPrice,
    originalPrice: isPacFree ? pacPrice : undefined,
    deliveryDaysMin: pacDaysMin,
    deliveryDaysMax: pacDaysMax,
    deliveryDateEstimated: getEstimatedDateText(pacDaysMin, pacDaysMax),
    isColonialSpecial: false,
    badge: isPacFree ? '🎁 Frete Grátis acima de R$ 199' : '💰 Melhor Custo-Benefício',
    description: 'Opção econômica com proteção básica e rastreio padrão.',
    iconType: 'truck',
    insuranceIncluded: true,
    specialPackaging: 'Caixa de papelão padrão com plástico bolha',
  });

  // Transportadora Ouro Cargo (especial para encomendas grandes/pesadas)
  if (productWeightKg >= 3.5 || productPrice >= 200) {
    options.push({
      id: 'jadlog-ouro-cargo',
      name: 'Transportadora Ouro Cargo Rodoviário Especial',
      carrier: 'Jadlog / Total Express & Mercado Colonial',
      price: Math.max(16.9, Math.round(sedexPrice * 0.65)),
      deliveryDaysMin: pacDaysMin - 1,
      deliveryDaysMax: pacDaysMax - 1,
      deliveryDateEstimated: getEstimatedDateText(pacDaysMin - 1, pacDaysMax - 1),
      isColonialSpecial: false,
      badge: '🛡️ Especialista em Encomendas Pesadas',
      description: 'Ideal para panelas de pedra grandes, rechauds de 6kg e conjuntos de escultura barroca.',
      iconType: 'truck',
      insuranceIncluded: true,
      specialPackaging: 'Pallet ou caixa de madeira amortecida',
    });
  }

  return {
    cep: cepClean.replace(/^(\d{5})(\d{3})$/, '$1-$2'),
    city: cityName || (matchedHistoric ? matchedHistoric.name : isMG ? 'Minas Gerais' : 'Brasil'),
    state: stateUf || (isMG ? 'MG' : 'BR'),
    isHistoricCityMG: !!matchedHistoric,
    historicCityName: matchedHistoric?.name,
    historicCityPerk: matchedHistoric?.perkDescription,
    originHub: 'Centro de Distribuição & Ateliê Central - Cachoeira do Campo / Ouro Preto (MG)',
    calculatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    options,
  };
}

/**
 * Fallback static CEP database for common historic & main Brazilian destinations
 * in case external APIs fail or are offline.
 */
export const OFFLINE_CEP_DATABASE: Record<string, { city: string; state: string; neighborhood: string }> = {
  '35400000': { city: 'Ouro Preto', state: 'MG', neighborhood: 'Centro Histórico' },
  '35400': { city: 'Ouro Preto', state: 'MG', neighborhood: 'Centro Histórico' },
  '35420000': { city: 'Mariana', state: 'MG', neighborhood: 'Centro' },
  '35420': { city: 'Mariana', state: 'MG', neighborhood: 'Centro' },
  '36325000': { city: 'Tiradentes', state: 'MG', neighborhood: 'Centro Histórico' },
  '36325': { city: 'Tiradentes', state: 'MG', neighborhood: 'Centro Histórico' },
  '36300000': { city: 'São João del-Rei', state: 'MG', neighborhood: 'Centro' },
  '39100000': { city: 'Diamantina', state: 'MG', neighborhood: 'Centro Histórico' },
  '36415000': { city: 'Congonhas', state: 'MG', neighborhood: 'Basílica' },
  '34505000': { city: 'Sabará', state: 'MG', neighborhood: 'Centro' },
  '36420000': { city: 'Ouro Branco', state: 'MG', neighborhood: 'Centro' },
  '35969000': { city: 'Catas Altas', state: 'MG', neighborhood: 'Serra do Caraça' },
  '30130000': { city: 'Belo Horizonte', state: 'MG', neighborhood: 'Savassi' },
  '01310100': { city: 'São Paulo', state: 'SP', neighborhood: 'Bela Vista / Av. Paulista' },
  '20040002': { city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Centro' },
  '70040010': { city: 'Brasília', state: 'DF', neighborhood: 'Asa Norte' },
  '80020010': { city: 'Curitiba', state: 'PR', neighborhood: 'Centro' },
};
