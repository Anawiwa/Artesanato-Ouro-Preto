import { Product, ColorPaletteItem } from '../types';

export const OURO_PRETO_PALETTE: ColorPaletteItem[] = [
  {
    name: 'Ouro Barroco',
    hex: '#C59B27',
    role: 'Botão Principal (Adicionar ao Carrinho)',
    description: 'Amarelo dourado inspirado no banho de ouro das igrejas de Ouro Preto.',
    textColor: '#1A1810',
  },
  {
    name: 'Branco Colonial',
    hex: '#FDFBF7',
    role: 'Fundo da Buy Box e Cards',
    description: 'Tom de cal colonial suave, trazendo elegância e legibilidade descansada.',
    textColor: '#2D3033',
  },
  {
    name: 'Pedra Sabão',
    hex: '#3A3D40',
    role: 'Textos, Bordas e Estrutura',
    description: 'Cinza grafite mineral extraído do esteatito típico da Região dos Inconfidentes.',
    textColor: '#FFFFFF',
  },
  {
    name: 'Terracota Mineira',
    hex: '#C85A32',
    role: 'Botão Comprar Agora & Badges',
    description: 'Tom da terra e dos tijolos barrocos queimados em fornos de barro.',
    textColor: '#FFFFFF',
  },
  {
    name: 'Verde Esmeralda',
    hex: '#2E6B40',
    role: 'Status Em Estoque & Frete Grátis',
    description: 'Verde das matas preservadas da Serra do Espinhaço.',
    textColor: '#FFFFFF',
  },
  {
    name: 'Madeira Cobre',
    hex: '#70360D',
    role: 'Selos de Autenticidade & Ateliê',
    description: 'Tonalidade nobre das vigas de jacarandá e tachos de cobre centenários.',
    textColor: '#FFFFFF',
  },
];

// PROMPT 2 - ARRAY JSON EXATO DOS 4 PRODUTOS MAIS VENDIDOS
export const BEST_SELLERS_PRODUCTS: Product[] = [
  {
    id: 'OP-PEDRA-3L-001',
    titulo: 'Panela de Pedra-Sabão Tradicional de Ouro Preto 3 Litros com Alça de Cobre e Tampa - Cura Inicial Realizada',
    subtitulo: 'Feita artesanalmente em rocha esteatito com contorno em cobre polido. Conserva o calor por até 2 horas.',
    categoria: 'Panela de Pedra-Sabão',
    preco: 249.90,
    preco_original: 299.00,
    desconto_percentual: 16,
    nota_avaliacao: 4.9,
    quantidade_reviews: 328,
    selo_destaque: 'Mais Vendido nº 1 em Culinária Mineira',
    certificacoes: [
      {
        tipo: 'iphan',
        nome: 'Selo IPHAN nº 842',
        subtexto: 'Salvaguarda e chancela do ofício tradicional dos mestres da rocha esteatito.',
        regId: 'IPHAN-OP-842',
      },
      {
        tipo: 'indicacao_geografica',
        nome: 'IG Pedra-Sabão de Ouro Preto',
        subtexto: 'Indicação Geográfica da jazida mineral da Região dos Inconfidentes.',
        regId: 'IG-INPI-BR-OP01',
      },
      {
        tipo: 'organico',
        nome: '100% Mineral Puro & Atóxico',
        subtexto: 'Rocha esteatito pura sem metais pesados com liberação de cálcio e magnésio.',
        regId: 'MINERAL-PURITY-MG',
      },
    ],
    imagem_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    imagens_galeria: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 5,
    artesao: 'Mestre Valentim e Família',
    atelie: 'Ateliê Barroco das Minas',
    cidade: 'Ouro Preto - MG',
    especificacoes: {
      'Material': 'Pedra-Sabão (Esteatito Natural) e Cobre Polido',
      'Capacidade': '3,0 Litros (ideal para feijoada, tutú e ensopados)',
      'Diâmetro Aprox.': '22 cm',
      'Altura': '12 cm',
      'Peso Aproximado': '4,8 kg',
      'Cura Inicial': 'Pré-curada pelo ateliê (pronta para uso)',
      'Origem': 'Distrito de Cachoeira do Campo, Ouro Preto - MG'
    },
    bullet_points: [
      '🍲 **RETENÇÃO TÉRMICA SUPERIOR**: A rocha esteatito retém a temperatura por muito mais tempo, mantendo o feijão, feijoada ou moqueca fervendo mesmo após desligar o fogo.',
      '✨ **ALÇAS DE COBRE ARTESANAL**: Estrutura reforçada em cobre polido com rebites de alta durabilidade, agregando beleza estética e segurança no manuseio.',
      '🌿 **SABOR NATURAL E SAUDÁVEL**: Não altera o sabor dos alimentos e libera microelementos benéficos como cálcio e magnésio durante o cozimento.',
      '🔥 **PRÉ-CURADA E PRONTA PARA USO**: Processo tradicional de cura com óleo vegetal e selagem em forno a lenha efetuado no ateliê antes do envio.',
      '🛡️ **PRODUTO CERTIFICADO DE OURO PRETO**: Acompanha selo de procedência e certificado de autenticidade emitido pela Associação de Artesãos de Ouro Preto.'
    ],
    descricao_detalhada: 'A Panela de Pedra-Sabão de 3 Litros é um ícone da gastronomia mineira, moldada manualmente por mestres artesãos das montanhas de Ouro Preto. Fabricada em pedra esteatito de alta densidade mineral, ela proporciona um cozimento uniforme e preserva o calor à mesa por horas.'
  },
  {
    id: 'OP-DOCE-NOZES-500G',
    titulo: 'Doce de Leite Artesanal com Nozes de Ouro Preto 500g - Receita Colonial em Tacho de Cobre',
    subtitulo: 'Cremoso, apurado em fogo a lenha com nozes torradas selecionadas. Sem conservantes artificiais.',
    categoria: 'Doces Tradicionais',
    preco: 42.90,
    preco_original: 49.90,
    desconto_percentual: 14,
    nota_avaliacao: 4.95,
    quantidade_reviews: 512,
    selo_destaque: 'Escolha da Amazon - Culinária Afetiva',
    certificacoes: [
      {
        tipo: 'iphan',
        nome: 'IPHAN Doces de São Bartolomeu',
        subtexto: 'Tradição doceira imaterial tombada pelo patrimônio histórico.',
        regId: 'IPHAN-DOCE-804',
      },
      {
        tipo: 'indicacao_geografica',
        nome: 'IG São Bartolomeu (Ouro Preto)',
        subtexto: 'Indicação de procedência do polo doceiro da Estrada Real.',
        regId: 'IG-SB-DOCES-03',
      },
      {
        tipo: 'organico',
        nome: '100% Leite Fresco & Puro',
        subtexto: 'Sem conservantes químicos ou espessantes industriais.',
        regId: 'LEITE-PURO-MINAS',
      },
    ],
    imagem_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    imagens_galeria: [
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 18,
    artesao: 'Dona Benvinda de São Bartolomeu',
    atelie: 'Doces da Vila Colonial',
    cidade: 'Ouro Preto - MG (Distrito de São Bartolomeu)',
    especificacoes: {
      'Conteúdo Líquido': '500 gramas',
      'Ingredientes': 'Leite fresco integral, açúcar de cana, nozes nobres torradas',
      'Validade': '6 meses selado a vácuo em pote de vidro',
      'Textura': 'Aveludada de colher com pedaços crocantes de nozes',
      'Livre de': 'Glúten, corantes sintéticos e espessantes químicos'
    },
    bullet_points: [
      '🍯 **TRADIÇÃO CENTENÁRIA DA SERRA DO ESPINHAÇO**: Produzido artesanalmente em tachos de cobre em fogo de lenha nas montanhas de Ouro Preto, seguindo a autêntica receita barroca do século XVIII.',
      '🥛 **LEITE FRESCO SELECIONADO & NOZES CROCANTES**: A cremosidade aveludada do verdadeiro doce de leite mineiro combinada com pedaços generosos de nozes nobres torradas.',
      '🪵 **COZIMENTO LENTO EM TACHO DE COBRE**: O processo de apuração artesanal leva mais de 6 horas, garantindo a cor caramelo dourada característica e o aroma defumado sutil.',
      '🌿 **100% NATURAL E SEM GLÚTEN**: Livre de corantes, espessantes ou aditivos químicos. Apenas leite integral, açúcar de cana e o conhecimento das famílias doceiras de Minas Gerais.',
      '🎁 **EMBALAGEM HERMÉTICA IDEAL PARA PRESENTE**: Pote de vidro artesanal de 500g selado a vácuo, perfeito para harmonizar com queijo canastra ou presentear.'
    ],
    descricao_detalhada: 'Descubra o verdadeiro sabor das Minas Gerais com o Doce de Leite Artesanal com Nozes de Ouro Preto. Cada pote carrega a essência da culinária colonial barroca nascida no histórico distrito de São Bartolomeu, patrimônio imaterial da doçaria mineira. O leite fresco é lentamente caramelizado em tachos de cobre batidos à mão, resultando em uma textura sublime complementada pelo crocante inconfundível de nozes nobres.'
  },
  {
    id: 'OP-ESCULTURA-ALEIJADINHO-25CM',
    titulo: 'Escultura de Mestre Aleijadinho em Pedra-Sabão 25cm - Réplica Certificada Mão de Obra Local',
    subtitulo: 'Talhada à mão por mestres entalhadores inspirados nas obras do Santuário do Bom Jesus de Matosinhos.',
    categoria: 'Esculturas & Arte Barroca',
    preco: 389.00,
    preco_original: 450.00,
    desconto_percentual: 13,
    nota_avaliacao: 4.88,
    quantidade_reviews: 84,
    selo_destaque: 'Relíquia Cultural Limitada',
    certificacoes: [
      {
        tipo: 'iphan',
        nome: 'Selo IPHAN Barroco Mineiro',
        subtexto: 'Salvaguarda da arte sacra e entalhe colonial de Ouro Preto.',
        regId: 'IPHAN-ESC-1750',
      },
      {
        tipo: 'indicacao_geografica',
        nome: 'IG Pedra-Sabão de Ouro Preto',
        subtexto: 'Reconhecimento geográfico do esteatito da Região dos Inconfidentes.',
        regId: 'IG-INPI-BR-OP01',
      },
      {
        tipo: 'artesanato_manual',
        nome: 'Escultura 100% Manual em Cinzel',
        subtexto: 'Talhada à mão peça por peça sem moldes industriais.',
        regId: 'OFICIO-MANUAL-OP',
      },
    ],
    imagem_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    imagens_galeria: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 3,
    artesao: 'Mestre Francisco Xavier',
    atelie: 'Oficina de Esculturas Inconfidentes',
    cidade: 'Ouro Preto - MG',
    especificacoes: {
      'Altura': '25 cm',
      'Base': '8 cm x 8 cm',
      'Material Principal': 'Pedra-Sabão (Esteatito Natural Cinza Esverdeado)',
      'Técnica': 'Entalhe manual com cinzel e lixamento com cera de abelha natural',
      'Acabamento': 'Cera natural acetinada'
    },
    bullet_points: [
      '🗿 **TALHADA 100% À MÃO EM OURO PRETO**: Obra esculpida individualmente por artistas locais utilizando os mesmos métodos do século XVIII.',
      '📜 **INSPIRADA NO BARROCO MINEIRO**: Detalhes expressivos e drapeados fluidos que homenageiam o legado do gênio Antônio Francisco Lisboa (Aleijadinho).',
      '🏷️ **CERTIFICADO COM NÚMERO DE SÉRIE**: Acompanha lacre oficial do ateliê e folheto com o histórico da peça e dados do artesão.',
      '✨ **ACABAMENTO EM CERA DE ABELHA**: Proteção natural que realça os veios únicos e as variações sutis da rocha mineral.',
      '🛡️ **EMBALAGEM DE SEGURANÇA REFORÇADA**: Caixa acolchoada especial pronta para envio seguro em qualquer região do Brasil.'
    ],
    descricao_detalhada: 'Esta escultura em pedra-sabão traz para o seu ambiente a alma da arte colonial barroca. Esculpida no coração de Ouro Preto, cada peça é única, revelando a textura nobre e as tonalidades suaves da rocha metamórfica local.'
  },
  {
    id: 'OP-XICARAS-CERAMICA-BARROCA-6UN',
    titulo: 'Conjunto de 6 Xícaras de Cerâmica Queimada em Forno a Lenha Ouro Preto - Pintura Manual Barroca 180ml',
    subtitulo: 'Cerâmica de alta temperatura com esmalte atóxico. Pintura inspirada nos azulejos portugueses de Vila Rica.',
    categoria: 'Utensílios & Cerâmica',
    preco: 179.90,
    preco_original: 210.00,
    desconto_percentual: 14,
    nota_avaliacao: 4.92,
    quantidade_reviews: 142,
    selo_destaque: 'Lançamento Exclusivo',
    certificacoes: [
      {
        tipo: 'iphan',
        nome: 'Registro de Cerâmica Colonial',
        subtexto: 'Salvaguarda da técnica de queima em forno a lenha de Ouro Preto.',
        regId: 'IPHAN-CER-1902',
      },
      {
        tipo: 'indicacao_geografica',
        nome: 'IG Cerâmica de Vila Rica',
        subtexto: 'Barro e pigmentos minerais de cobalto da Bacia dos Inconfidentes.',
        regId: 'IG-VR-CERAM-04',
      },
      {
        tipo: 'organico',
        nome: 'Esmalte Mineral Atóxico 100% Natural',
        subtexto: 'Isento de chumbo e componentes tóxicos industriais.',
        regId: 'SAFE-GLAZE-MG',
      },
    ],
    imagem_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    imagens_galeria: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 9,
    artesao: 'Cerâmica Vila Rica - Ana e Pedro',
    atelie: 'Olaria das Chagas',
    cidade: 'Ouro Preto - MG',
    especificacoes: {
      'Capacidade': '180 ml cada xícara',
      'Quantidade': '6 xícaras + 6 pires em cerâmica',
      'Queima': 'Forno a lenha a 1220°C',
      'Pintura': 'Manual pigmentada com cobaltos e óxidos minerais',
      'Uso': 'Resistente a micro-ondas e lava-louças'
    },
    bullet_points: [
      '☕ **A HORA DO CAFÉ MINEIRO COM ESTILO**: Capacidade ideal para café passado na hora ou pão de queijo quentinho da tarde.',
      '🎨 **PINTURA MANUAL EXCLUSIVA**: Desenhos florais e arabescos barrocos aplicados à mão por ceramistas ouro-pretanos.',
      '🔥 **RESISTÊNCIA TÉRMICA**: Queimadas a mais de 1200°C, garantindo alta durabilidade e retenção de calor.',
      '🌱 **ESMALTE ATÓXICO ALIMENTAR**: Livre de chumbo e metais pesados, seguro para o consumo diário.',
      '📦 **KIT COMPLETO COM PIRES**: Inclui 6 xícaras de 180ml e 6 pires trabalhados em moldura rústica colonial.'
    ],
    descricao_detalhada: 'Sinta a hospitalidade das cozinhas de Minas com este jogo de xícaras barrocas. Feitas em barro selecionado e queimadas em fornos a lenha tradicionais, trazem um toque de charme e tradição para seu momento de café.'
  },
  {
    id: 'OP-QUEIJO-CANASTRA-CURADO-1KG',
    titulo: 'Queijo Minas Artesanal Real da Serra do Espinhaço 1kg - Curado 60 Dias em Tábua de Madeira Nobre',
    subtitulo: 'Casca florida dourada natural, interior macio e sabor amanteigado marcante. Produzido com leite cru.',
    categoria: 'Queijos & Laticínios Nobres',
    preco: 89.90,
    preco_original: 109.00,
    desconto_percentual: 17,
    nota_avaliacao: 4.96,
    quantidade_reviews: 219,
    selo_destaque: 'Medalha Super Ouro Minas',
    certificacoes: [
      {
        tipo: 'iphan',
        nome: 'IPHAN Patrimônio Cultural Imaterial',
        subtexto: 'Modo de Fazer o Queijo Minas Artesanal registrado pelo IPHAN.',
        regId: 'IPHAN-LIVRO-SABERES-01',
      },
      {
        tipo: 'indicacao_geografica',
        nome: 'IG Serra do Espinhaço',
        subtexto: 'Indicação Geográfica da flora e terroir serrano de Minas Gerais.',
        regId: 'IG-INPI-SERRA-ESP',
      },
      {
        tipo: 'organico',
        nome: '100% Leite Cru & Pingo Natural',
        subtexto: 'Gado a pasto livre sem conservantes sintéticos.',
        regId: 'LEITE-CRU-CERT',
      },
    ],
    imagem_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80',
    imagens_galeria: [
      'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 14,
    artesao: 'Mestre Queijeiro Zé do Espinhaço',
    atelie: 'Queijaria Reserva das Gerais',
    cidade: 'Região dos Inconfidentes - MG',
    especificacoes: {
      'Peso Líquido': 'Aprox. 1,0 kg',
      'Maturação': '60 dias em tábua de jacarandá',
      'Tipo de Leite': 'Leite cru integral de gado a pasto',
      'Origem': 'Região Serrana de Ouro Preto e Serra do Espinhaço',
      'Armazenamento': 'Local fresco e arejado ou sob refrigeração envolto em pano de algodão'
    },
    bullet_points: [
      '🧀 **MATURAÇÃO NATURAL DE 60 DIAS**: O processo tradicional em prateleiras de madeira confere textura untuosa e notas aromáticas complexas.',
      '🐄 **100% LEITE CRU DE GADO A PASTO**: Respeito rigoroso às normas do modo de fazer o Queijo Minas Artesanal, patrimônio cultural imaterial pelo IPHAN.',
      '🏆 **PREMIADO EM CONCURSOS REGIONAIS**: Reconhecido pela casca amarela rústica e sabor equilibrado entre leve acidez e final adocicado.',
      '🌿 **SEM CONSERVANTES OU ADITIVOS**: Produzido apenas com leite cru, coalho natural, pingo e sal marinho.',
      '🎁 **EMBALADO EM PANO DE ALGODÃO ARTESANAL**: Pronto para consumo imediato ou para continuar a maturação ao seu gosto.'
    ],
    descricao_detalhada: 'Produzido nas altitudes da Serra do Espinhaço, este Queijo Minas Artesanal de 1kg segue a tradição secular dos colonizadores do ciclo do ouro. Curado pacientemente por 60 dias em tábuas de madeira nobre, adquire uma casca dourada natural com interior extremamente amanteigado.'
  },
  {
    id: 'OP-TACHO-COBRE-5L',
    titulo: 'Tacho de Cobre Puro Maciço Batido à Mão 5 Litros com Alças em Bronze - Linha Colonial Gastronômica',
    subtitulo: 'Fabricação artesanal forjada em cobre de alta espessura. Ideal para doces de tacho, geleias e caramelos.',
    categoria: 'Utensílios de Cobre',
    preco: 329.90,
    preco_original: 389.00,
    desconto_percentual: 15,
    nota_avaliacao: 4.93,
    quantidade_reviews: 97,
    selo_destaque: 'Indispensável na Cozinha Mineira',
    certificacoes: [
      {
        tipo: 'iphan',
        nome: 'Ofício dos Mestres Funileiros de Ouro Preto',
        subtexto: 'Registro de salvaguarda da metalurgia tradicional colonial.',
        regId: 'IPHAN-COBRE-1812',
      },
      {
        tipo: 'indicacao_geografica',
        nome: 'IG Cobre Tradicional Ouro Preto',
        subtexto: 'Indicação Geográfica da forja manual de Ouro Preto.',
        regId: 'IG-OP-COBRE-02',
      },
      {
        tipo: 'artesanato_manual',
        nome: '100% Forjado & Martelado à Mão',
        subtexto: 'Cobre maciço puro 99,9% com fixação por rebites em bronze.',
        regId: 'PURE-COPPER-99',
      },
    ],
    imagem_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    imagens_galeria: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 6,
    artesao: 'Mestre Inácio da Fundição',
    atelie: 'Cobre Colonial de Ouro Preto',
    cidade: 'Ouro Preto - MG',
    especificacoes: {
      'Material': 'Cobre Puro Forjado 99,9% com Alças em Bronze Fundido',
      'Capacidade': '5,0 Litros',
      'Diâmetro': '30 cm na borda superior',
      'Profundidade': '13 cm',
      'Peso Aproximado': '2,3 kg',
      'Acabamento': 'Martelado e polido à mão'
    },
    bullet_points: [
      '🔥 **CONDUTIVIDADE TÉRMICA PERFEITA**: O cobre distribui o calor uniformemente sem pontos de queima, essencial para o ponto exato de doces de leite e goiabadas.',
      '🔨 **FORJADO E MARTELADO MANUALMENTE**: Cada tacho traz as marcas de martelamento exclusivo dos artesãos funileiros de Minas.',
      '✨ **ALÇAS EM BRONZE FUNDIDO**: Fixação tripla de segurança em rebites de cobre maciço para estabilidade total.',
      '🍯 **O SEGREDO DO VERDADEIRO DOCE MINEIRO**: O contato do doce com o tacho de cobre acentua a cor brilhante e o sabor inconfundível.',
      '🛡️ **PEÇA PARA GERAÇÕES**: Produto com durabilidade vitalícia que valoriza qualquer cozinha tradicional ou gourmet.'
    ],
    descricao_detalhada: 'O Tacho de Cobre Batido de 5 Litros é a peça-chave das cozinhas coloniais mineiras. Forjado à mão a partir de chapas espessas de cobre maciço com alças ornamentadas em bronze, este tacho é sinônimo de excelência na confecção de doces tradicionais, geleias e caldas.'
  },
  {
    id: 'OP-CACHACA-BALSAMO-5ANOS-750ML',
    titulo: 'Cachaça Artesanal Ouro Preto Reserva Especial 5 Anos em Tonéis de Bálsamo e Jequitibá Rosa 750ml',
    subtitulo: 'Destilada em alambique de cobre a lenha. Notas florais, especiarias e suave toque amadeirado.',
    categoria: 'Cachaças Nobres & Licores',
    preco: 119.90,
    preco_original: 145.00,
    desconto_percentual: 17,
    nota_avaliacao: 4.97,
    quantidade_reviews: 186,
    selo_destaque: 'Reserva Ouro das Geraes',
    certificacoes: [
      {
        tipo: 'organico',
        nome: '100% Orgânica Certificada',
        subtexto: 'Cana cultivada sem agrotóxicos e fermentação natural com fubá.',
        regId: 'ORG-CANA-MINAS',
      },
      {
        tipo: 'indicacao_geografica',
        nome: 'IG Cachaça de Amarantina (Ouro Preto)',
        subtexto: 'Indicação Geográfica de alambique centenário da Estrada Real.',
        regId: 'IG-AMARANTINA-05',
      },
      {
        tipo: 'iphan',
        nome: 'Alambique Colonial Tradicional',
        subtexto: 'Destilação em alambique de cobre de fogo direto certificado.',
        regId: 'ALAMB-HIST-OP',
      },
    ],
    imagem_url: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=800&q=80',
    imagens_galeria: [
      'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 22,
    artesao: 'Mestre Alambiqueiro Tião Bento',
    atelie: 'Alambique Engenho do Ouro',
    cidade: 'Distrito de Amarantina, Ouro Preto - MG',
    especificacoes: {
      'Volume': '750 ml',
      'Graduação Alcoólica': '40% vol.',
      'Envelhecimento': '5 anos (blended em Bálsamo e Jequitibá Rosa)',
      'Tipo de Destilação': 'Alambique de cobre descontínuo com coração da cana',
      'Garrafa': 'Vidro nobre com tampa em rolha natural selada com cera'
    },
    bullet_points: [
      '🥃 **ENVELHECIMENTO DE 5 ANOS EM MADEIRAS NOBRES**: Equilíbrio refinado entre o frescor herbáceo do Bálsamo e a maciez aveludada do Jequitibá Rosa.',
      '🌱 **CANA-DE-AÇÚCAR ORGÂNICA CULTIVADA NA SERRA**: Fermentação natural com leveduras nativas e fubá de milho da própria fazenda.',
      '🪵 **DESTILAÇÃO PURA DE CORAÇÃO**: Apenas a fração mais nobre da destilação é envasada, garantindo suavidade absoluta e ausência de queimação.',
      '🏆 **GARRAFA NUMERADA COM LACRE EM CERA**: Cada lote é único, com rotulagem artesanal e certificado de origem da Associação dos Produtores de Cachaça.',
      '🎁 **ACOMPANHA COPO DE DEGUSTAÇÃO DE DOSE EM VIDRO**: Perfeita para colecionadores, degustação pura ou harmonização gastronômica.'
    ],
    descricao_detalhada: 'A Cachaça Artesanal Reserva Especial 5 Anos representa o auge da destilação tradicional mineira. Produzida no histórico distrito de Amarantina em Ouro Preto, passa por uma dupla maturação em tonéis centenários de Bálsamo e Jequitibá Rosa, resultando em um destilado aveludado com buquê aromático floral.'
  }
];

// RAW JSON ARRAY PARA O PROMPT 2
export const RAW_PROMPT2_JSON_STRING = JSON.stringify(
  BEST_SELLERS_PRODUCTS.map(p => ({
    id: p.id,
    titulo: p.titulo,
    preco: p.preco,
    nota_avaliacao: p.nota_avaliacao,
    quantidade_reviews: p.quantidade_reviews,
    selo_destaque: p.selo_destaque,
  })),
  null,
  2
);

// RAW HTML & TAILWIND CODE PARA O PROMPT 1 (BUY BOX)
export const RAW_PROMPT1_BUY_BOX_HTML = `<div class="w-full max-w-sm rounded-xl border border-[#3A3D40]/20 bg-[#FDFBF7] p-5 shadow-lg text-[#2D3033] font-sans">
  <!-- Preço Principal e Condições -->
  <div class="mb-4 pb-4 border-b border-[#3A3D40]/10">
    <div class="flex items-baseline gap-2">
      <span class="text-3xl font-extrabold text-[#70360D]">R$ 249,90</span>
      <span class="text-xs text-[#3A3D40]/70 line-through">R$ 299,00</span>
      <span class="rounded bg-[#C85A32]/10 px-2 py-0.5 text-xs font-bold text-[#C85A32]">-16%</span>
    </div>
    <p class="mt-1 text-xs text-[#3A3D40]/80">
      em até <strong class="text-[#2D3033]">6x de R$ 41,65</strong> sem juros no cartão de crédito
    </p>
  </div>

  <!-- Frete e Previsão de Entrega -->
  <div class="mb-4 space-y-2 text-sm">
    <div class="flex items-center gap-1.5 font-semibold text-[#2E6B40]">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      <span>Frete GRÁTIS Ouro Preto Express</span>
    </div>
    <p class="text-xs text-[#3A3D40]">
      Entrega estimada: <strong class="text-[#2D3033] font-bold">Quarta-feira, 5 de Agosto</strong>
    </p>
    <div class="flex items-center gap-1 text-xs text-[#70360D] hover:underline cursor-pointer">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
      <span>Enviar para Ouro Preto - CEP 35400-000</span>
    </div>
  </div>

  <!-- Disponibilidade de Estoque -->
  <div class="mb-4">
    <span class="inline-block rounded-md bg-[#2E6B40]/10 px-2.5 py-1 text-xs font-bold text-[#2E6B40]">
      Em estoque • Apenas 5 unidades produzidas artesanalmente
    </span>
  </div>

  <!-- Seletor de Quantidade -->
  <div class="mb-5 flex items-center justify-between text-sm">
    <label for="qtd" class="font-medium text-[#3A3D40]">Quantidade:</label>
    <select id="qtd" class="rounded-lg border border-[#3A3D40]/30 bg-white px-3 py-1.5 text-sm font-semibold shadow-sm focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]">
      <option value="1">1 unidade</option>
      <option value="2">2 unidades</option>
      <option value="3">3 unidades</option>
    </select>
  </div>

  <!-- Botões de Ação (Cores Ouro Barroco e Terracota Mineira) -->
  <div class="space-y-2.5">
    <!-- Botão Principal: Adicionar ao Carrinho (Ouro Barroco) -->
    <button class="w-full rounded-lg bg-[#C59B27] py-3 text-sm font-bold text-[#1A1810] shadow-md hover:bg-[#B38A1F] transition-all active:scale-[0.99] flex items-center justify-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
      Adicionar ao Carrinho
    </button>

    <!-- Botão Secundário: Comprar Agora (Terracota Mineira) -->
    <button class="w-full rounded-lg bg-[#C85A32] py-3 text-sm font-bold text-white shadow-md hover:bg-[#B04C28] transition-all active:scale-[0.99] flex items-center justify-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      Comprar Agora
    </button>
  </div>

  <!-- Detalhes de Logística e Garantia -->
  <div class="mt-5 space-y-2 border-t border-[#3A3D40]/10 pt-4 text-xs text-[#3A3D40]">
    <div class="flex justify-between">
      <span class="text-[#3A3D40]/70">Vendido por:</span>
      <span class="font-semibold text-[#70360D]">Ateliê Mestre Valentim</span>
    </div>
    <div class="flex justify-between">
      <span class="text-[#3A3D40]/70">Enviado por:</span>
      <span class="font-semibold text-[#2D3033]">Mercado Ouro Preto Logística</span>
    </div>
    <div class="flex items-center gap-1.5 pt-2 text-[#2E6B40] font-medium">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
      <span>Transação Segura & Garantia de Autenticidade Barroca</span>
    </div>
  </div>

  <!-- Opção de Presente -->
  <div class="mt-4 pt-3 border-t border-[#3A3D40]/10">
    <label class="flex items-center gap-2 text-xs text-[#3A3D40] cursor-pointer">
      <input type="checkbox" class="rounded border-[#3A3D40]/30 text-[#C59B27] focus:ring-[#C59B27]" />
      <span>Incluir embalagem artesanal para presente e cartão personalizado</span>
    </label>
  </div>
</div>`;
