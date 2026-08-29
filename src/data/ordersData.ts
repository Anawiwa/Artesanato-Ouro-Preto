import { CustomerOrder, OrderTrackingEvent, OrderItemDetail, PaymentRecord } from '../types';
import { BEST_SELLERS_PRODUCTS } from './ouroPretoData';

export const INITIAL_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 'OP-2026-9841',
    displayId: '#OP-2026-9841',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(), // 1.5 days ago
    estimatedDeliveryDate: new Date(Date.now() + 3600000 * 4).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    customer_name: 'Mariana Silva Alvarenga',
    customer_email: 'mariana.silva@email.com',
    customer_phone: '(31) 98765-4321',
    customer_document: '123.456.789-00',
    shipping_address: {
      street: 'Rua Direita',
      number: '48',
      complement: 'Casarão Solar das Rosas',
      neighborhood: 'Centro Histórico',
      city: 'Ouro Preto',
      state: 'MG',
      cep: '35400-000',
      isHistoricCityMG: true,
    },
    shipping_carrier: 'Carruagem Expressa Colonial (Portador Mineiro)',
    shipping_tier: 'Entrega Expressa Ouro Preto & Mariana',
    shipping_price: 0.0,
    tracking_code: 'ER-MG-9841-OPX',
    tracking_url: 'https://rastreio.ouropretominas.com.br/ER-MG-9841-OPX',
    status: 'saiu_para_entrega',
    status_label: 'Saiu para Entrega no Casario Histórico',
    artisan_workshop_city: 'Cachoeira do Campo - Ouro Preto/MG',
    authenticity_certificate_code: 'CERT-IPHAN-OP-2026-9841-PS',
    items: [
      {
        productId: 'panela-pedra-sabao-3l',
        title: 'Panela de Pedra-Sabão Tradicional 3.0L com Tampa e Alças de Cobre',
        artisan: 'Mestre Tião do Esteatito',
        atelier: 'Ateliê Cachoeira do Campo',
        category: 'Panela de Pedra-Sabão',
        imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop',
        quantity: 1,
        unitPrice: 249.9,
        totalPrice: 249.9,
        weight: '4.2 kg',
        giftWrap: true,
        specSummary: 'Volume 3.0 Litros • Peça já curada com óleo mineral e fogo brando.',
      },
    ],
    subtotal: 249.9,
    discount: 12.5, // 5% PIX discount
    total: 237.4,
    payment: {
      id: 'PAY-PIX-882194',
      order_id: 'OP-2026-9841',
      customer_name: 'Mariana Silva Alvarenga',
      customer_email: 'mariana.silva@email.com',
      payment_method: 'pix',
      bank_code: '260',
      bank_name: 'Nubank (Nu Pagamentos)',
      amount: 237.4,
      installments: 1,
      status: 'pago',
      pix_key: 'pix@ouropretominas.com.br',
      pix_key_type: 'email',
      pix_txid: 'TXID-PIX-9841289412',
      pix_end_to_end_id: 'E182361202026082018209841289412',
      created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
      paid_at: new Date(Date.now() - 3600000 * 36 + 12000).toISOString(),
    },
    tracking_timeline: [
      {
        step: 1,
        title: 'Pedido Confirmado & Pagamento Aprovado via PIX',
        subtitle: 'Ateliê em Cachoeira do Campo notificado instantaneamente.',
        location: 'Ouro Preto - MG',
        timestamp: new Date(Date.now() - 3600000 * 36).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'Pagamento de R$ 237,40 compensado com sucesso no Banco Nubank (TXID: 9841289412).',
      },
      {
        step: 2,
        title: 'Lapidação Final & Processo de Cura Artesanal',
        subtitle: 'Mestre Tião concluiu a hidratação mineral e selagem térmica.',
        location: 'Ateliê Mestre Tião • Cachoeira do Campo',
        timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'A pedra-sabão passou pelo teste de condutividade e recebeu gravação do brasão colonial.',
        artisanNote: 'Peça selecionada com veios nobres cinza-chumbo e alças reforçadas de cobre legítimo batido.',
      },
      {
        step: 3,
        title: 'Embalagem Protetora Colonial & Engradado de Madeira',
        subtitle: 'Acomodada em estofo natural de palha de milho e engradado com laudo de autenticidade.',
        location: 'Centro de Triagem Estrada Real • Ouro Preto',
        timestamp: new Date(Date.now() - 3600000 * 12).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'Certificado de Autenticidade IPHAN anexado e seguro antiquebra 100% ativo.',
      },
      {
        step: 4,
        title: 'Despachado pela Estrada Real',
        subtitle: 'Em trânsito com portador express da Carruagem Colonial.',
        location: 'Rota Real Ouro Preto / Mariana',
        timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'Código de Rastreio ativado: ER-MG-9841-OPX.',
      },
      {
        step: 5,
        title: 'Saiu para Entrega no Casario Histórico',
        subtitle: 'Portador a caminho do endereço (Rua Direita, 48 - Centro Histórico).',
        location: 'Ouro Preto - MG',
        timestamp: new Date(Date.now() - 3600000 * 1).toLocaleString('pt-BR'),
        completed: false,
        current: true,
        detail: 'Previsão de entrega hoje até as 18:00 horas com aviso por WhatsApp.',
      },
    ],
  },
  {
    id: 'OP-2026-7732',
    displayId: '#OP-2026-7732',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
    estimatedDeliveryDate: new Date(Date.now() - 86400000 * 2).toLocaleDateString('pt-BR'),
    delivered_at: new Date(Date.now() - 86400000 * 2 + 3600000 * 14).toLocaleString('pt-BR'),
    customer_name: 'Mariana Silva Alvarenga',
    customer_email: 'mariana.silva@email.com',
    customer_phone: '(31) 98765-4321',
    customer_document: '123.456.789-00',
    shipping_address: {
      street: 'Rua Direita',
      number: '48',
      complement: 'Casarão Solar das Rosas',
      neighborhood: 'Centro Histórico',
      city: 'Ouro Preto',
      state: 'MG',
      cep: '35400-000',
      isHistoricCityMG: true,
    },
    shipping_carrier: 'Minas Express Rodoviário',
    shipping_tier: 'Expedição Estrada Real Segura',
    shipping_price: 18.5,
    tracking_code: 'MR-MG-7732-VCS',
    tracking_url: 'https://rastreio.ouropretominas.com.br/MR-MG-7732-VCS',
    status: 'entregue',
    status_label: 'Entregue com Sucesso',
    artisan_workshop_city: 'Viçosa & São Bartolomeu/MG',
    authenticity_certificate_code: 'SELO-DOCE-MG-2026-7732',
    items: [
      {
        productId: 'doce-leite-vicosa-800g',
        title: 'Doce de Leite Tradicional Viçosa 800g - Eleito Melhor do Brasil',
        artisan: 'Cooperativa dos Produtores de Viçosa',
        atelier: 'Doces Coloniais Viçosa',
        category: 'Doces Tradicionais',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop',
        quantity: 2,
        unitPrice: 42.9,
        totalPrice: 85.8,
        weight: '1.6 kg',
        giftWrap: false,
        specSummary: 'Apurado lentamente em tacho por 6h • Textura aveludada sem amido.',
      },
      {
        productId: 'xicara-cafe-barro-esmaltado',
        title: 'Jogo com 4 Xícaras de Café Colonial em Barro Esmaltado',
        artisan: 'Oleiros de Santa Luzia',
        atelier: 'Olaria Barro & Fogo',
        category: 'Utensílios & Cerâmica',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
        quantity: 1,
        unitPrice: 79.0,
        totalPrice: 79.0,
        weight: '1.1 kg',
        giftWrap: true,
        specSummary: 'Queima em alta temperatura • Interior verde-musgo esmaltado.',
      },
    ],
    subtotal: 164.8,
    discount: 0,
    total: 183.3,
    payment: {
      id: 'PAY-CARD-449102',
      order_id: 'OP-2026-7732',
      customer_name: 'Mariana Silva Alvarenga',
      customer_email: 'mariana.silva@email.com',
      payment_method: 'cartao_credito',
      bank_code: '341',
      bank_name: 'Itaú Unibanco',
      amount: 183.3,
      installments: 2,
      status: 'pago',
      card_brand: 'Mastercard',
      card_last_digits: '4821',
      card_holder_name: 'MARIANA S ALVARENGA',
      created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
      paid_at: new Date(Date.now() - 86400000 * 6 + 5000).toISOString(),
    },
    tracking_timeline: [
      {
        step: 1,
        title: 'Pedido Confirmado & Pagamento Aprovado',
        subtitle: 'Cartão de Crédito Mastercard final 4821 em 2x sem juros.',
        location: 'São Paulo / Ouro Preto',
        timestamp: new Date(Date.now() - 86400000 * 6).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'Transação autorizada com proteção antifraude.',
      },
      {
        step: 2,
        title: 'Seleção do Lote Fresco e Queima de Cerâmica',
        subtitle: 'Doces de leite separados diretamente da safra matinal de Viçosa.',
        location: 'Viçosa & Santa Luzia - MG',
        timestamp: new Date(Date.now() - 86400000 * 5).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'Xícaras inspecionadas uma a uma quanto à resistência térmica.',
      },
      {
        step: 3,
        title: 'Embalagem Térmica e Proteção Anti-Impacto',
        subtitle: 'Potes protegidos com plástico-bolha biodegradável e selo de garantia.',
        location: 'Hub Central • Belo Horizonte - MG',
        timestamp: new Date(Date.now() - 86400000 * 4).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'Etiqueta de fragilidade colonial aplicada.',
      },
      {
        step: 4,
        title: 'Em Trânsito pela Estrada Real',
        subtitle: 'Transferência da carga rodoviária para Ouro Preto.',
        location: 'BR-356 / Estrada Real',
        timestamp: new Date(Date.now() - 86400000 * 3).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'Carga transportada com temperatura controlada.',
      },
      {
        step: 5,
        title: 'Entregue com Sucesso',
        subtitle: 'Recebido por Mariana Alvarenga com assinatura e termo de integridade.',
        location: 'Ouro Preto - MG (Centro Histórico)',
        timestamp: new Date(Date.now() - 86400000 * 2 + 3600000 * 14).toLocaleString('pt-BR'),
        completed: true,
        current: true,
        detail: 'Pacote entregue sem avarias. Avaliação 5 estrelas registrada.',
      },
    ],
  },
  {
    id: 'OP-2026-6510',
    displayId: '#OP-2026-6510',
    created_at: new Date(Date.now() - 3600000 * 16).toISOString(), // 16 hours ago
    estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    customer_name: 'Mariana Silva Alvarenga',
    customer_email: 'mariana.silva@email.com',
    customer_phone: '(31) 98765-4321',
    shipping_address: {
      street: 'Rua Direita',
      number: '48',
      neighborhood: 'Centro Histórico',
      city: 'Ouro Preto',
      state: 'MG',
      cep: '35400-000',
      isHistoricCityMG: true,
    },
    shipping_carrier: 'Expedição Estrada Real Segura',
    shipping_tier: 'Frete Seguro com Engradado de Madeira',
    shipping_price: 24.9,
    tracking_code: 'ER-MG-6510-RCH',
    tracking_url: 'https://rastreio.ouropretominas.com.br/ER-MG-6510-RCH',
    status: 'embalado_madeira',
    status_label: 'Embalagem em Engradado de Madeira no Ateliê',
    artisan_workshop_city: 'Santa Rita de Ouro Preto/MG',
    authenticity_certificate_code: 'CERT-ESC-OP-2026-6510',
    items: [
      {
        productId: 'rechaud-pedra-sabao-grelha-cobre',
        title: 'Rechaud Gourmet em Pedra-Sabão com Grelha e Queimador em Cobre Puro',
        artisan: 'Mestre Gilberto das Pedras',
        atelier: 'Oficina das Minas de Santa Rita',
        category: 'Panela de Pedra-Sabão',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
        quantity: 1,
        unitPrice: 289.0,
        totalPrice: 289.0,
        weight: '5.8 kg',
        giftWrap: true,
        specSummary: 'Grelha grossa de esteatito cinzento • Acompanha abafador de chama em cobre.',
      },
    ],
    subtotal: 289.0,
    discount: 14.45,
    total: 299.45,
    payment: {
      id: 'PAY-PIX-331092',
      order_id: 'OP-2026-6510',
      customer_name: 'Mariana Silva Alvarenga',
      customer_email: 'mariana.silva@email.com',
      payment_method: 'pix',
      bank_code: '001',
      bank_name: 'Banco do Brasil',
      amount: 299.45,
      installments: 1,
      status: 'pago',
      pix_key: 'pix@ouropretominas.com.br',
      created_at: new Date(Date.now() - 3600000 * 16).toISOString(),
      paid_at: new Date(Date.now() - 3600000 * 16 + 20000).toISOString(),
    },
    tracking_timeline: [
      {
        step: 1,
        title: 'Pedido Recebido & Pagamento Aprovado via PIX',
        subtitle: 'Ateliê iniciou os preparativos de montagem.',
        location: 'Santa Rita de Ouro Preto - MG',
        timestamp: new Date(Date.now() - 3600000 * 16).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'Pagamento validado no Banco do Brasil.',
      },
      {
        step: 2,
        title: 'Montagem das Peças de Cobre e Teste de Encaixe',
        subtitle: 'Grelha e queimador ajustados com precisão milimétrica.',
        location: 'Ateliê Santa Rita',
        timestamp: new Date(Date.now() - 3600000 * 8).toLocaleString('pt-BR'),
        completed: true,
        current: false,
        detail: 'Pedra-sabão polida com acabamento acetinado de alta durabilidade.',
      },
      {
        step: 3,
        title: 'Embalagem em Engradado de Madeira Protetora',
        subtitle: 'Acondicionamento reforçado para peças pesadas de pedra e cobre.',
        location: 'Setor de Expedição Colonial',
        timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString('pt-BR'),
        completed: false,
        current: true,
        detail: 'Engradado de pinus de reflorestamento com travas de segurança.',
        artisanNote: 'Engradado reforçado com 4 travas laterais para suportar os 5.8 kg com segurança total na Estrada Real.',
      },
      {
        step: 4,
        title: 'Despacho & Coleta pela Transportadora Estrada Real',
        subtitle: 'Aguardando veículo coletor com seguro total de quebra.',
        location: 'Ouro Preto - MG',
        timestamp: 'Previsto para hoje',
        completed: false,
        current: false,
      },
      {
        step: 5,
        title: 'Entrega no Endereço do Destinatário',
        subtitle: 'Previsão de entrega no casarão.',
        location: 'Ouro Preto - MG',
        timestamp: 'Em até 2 dias úteis',
        completed: false,
        current: false,
      },
    ],
  },
];

const LOCAL_STORAGE_ORDERS_KEY = 'ouro_customer_orders';

export function getSavedCustomerOrders(): CustomerOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_CUSTOMER_ORDERS));
      return INITIAL_CUSTOMER_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CUSTOMER_ORDERS;
  } catch (err) {
    console.warn('Erro ao carregar pedidos do localStorage:', err);
    return INITIAL_CUSTOMER_ORDERS;
  }
}

export function saveCustomerOrder(newOrder: CustomerOrder): CustomerOrder[] {
  try {
    const existing = getSavedCustomerOrders();
    const updated = [newOrder, ...existing.filter((o) => o.id !== newOrder.id)];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Erro ao salvar pedido no localStorage:', err);
    return [newOrder];
  }
}

export function createNewOrderFromCheckout(params: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDocument?: string;
  shippingAddress: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    isHistoricCityMG?: boolean;
  };
  carrierName: string;
  shippingTier: string;
  shippingPrice: number;
  items: OrderItemDetail[];
  subtotal: number;
  discount: number;
  total: number;
  payment: PaymentRecord;
}): CustomerOrder {
  const now = new Date();
  const deliveryDays = params.shippingAddress.isHistoricCityMG ? 1 : 4;
  const estimatedDate = new Date(now.getTime() + 86400000 * deliveryDays).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const trackingCode = `ER-MG-${params.orderId.replace(/[^0-9]/g, '').slice(-4) || '8841'}-COL`;

  const timeline: OrderTrackingEvent[] = [
    {
      step: 1,
      title: 'Pedido Recebido & Pagamento Processado',
      subtitle: `Pagamento via ${params.payment.payment_method.toUpperCase()} (${params.payment.bank_name}).`,
      location: 'Ouro Preto - MG',
      timestamp: now.toLocaleString('pt-BR'),
      completed: true,
      current: false,
      detail: `Valor total de R$ ${params.total.toFixed(2)} registrado com sucesso.`,
    },
    {
      step: 2,
      title: 'Notificação do Ateliê & Lapidação Manual',
      subtitle: `Os mestres artesãos iniciaram a preparação das ${params.items.length} peças.`,
      location: 'Ateliê Colonial • Ouro Preto',
      timestamp: 'Em andamento',
      completed: false,
      current: true,
      detail: 'Peças em processo de inspeção de esteatito e selagem tradicional.',
    },
    {
      step: 3,
      title: 'Embalagem Protetora em Engradado de Madeira',
      subtitle: 'Acomodação com estofo natural e selo IPHAN de autenticidade.',
      location: 'Centro de Expedição Estrada Real',
      timestamp: 'Próxima etapa',
      completed: false,
      current: false,
    },
    {
      step: 4,
      title: 'Despacho & Transporte pela Rota da Estrada Real',
      subtitle: `Transporte via ${params.carrierName}.`,
      location: 'Rota Colonial',
      timestamp: 'Aguardando coleta',
      completed: false,
      current: false,
    },
    {
      step: 5,
      title: `Entrega no Destino (${params.shippingAddress.city} - ${params.shippingAddress.state})`,
      subtitle: `Previsão estimada: ${estimatedDate}.`,
      location: `${params.shippingAddress.city} - ${params.shippingAddress.state}`,
      timestamp: 'Previsto',
      completed: false,
      current: false,
    },
  ];

  const order: CustomerOrder = {
    id: params.orderId,
    displayId: `#${params.orderId}`,
    created_at: now.toISOString(),
    estimatedDeliveryDate: estimatedDate,
    customer_name: params.customerName,
    customer_email: params.customerEmail,
    customer_phone: params.customerPhone,
    customer_document: params.customerDocument,
    shipping_address: params.shippingAddress,
    shipping_carrier: params.carrierName,
    shipping_tier: params.shippingTier,
    shipping_price: params.shippingPrice,
    tracking_code: trackingCode,
    tracking_url: `https://rastreio.ouropretominas.com.br/${trackingCode}`,
    status: 'em_producao',
    status_label: 'Em Produção & Lapidação no Ateliê',
    items: params.items,
    subtotal: params.subtotal,
    discount: params.discount,
    total: params.total,
    payment: params.payment,
    tracking_timeline: timeline,
    authenticity_certificate_code: `CERT-OP-2026-${params.orderId.slice(-4)}`,
    artisan_workshop_city: 'Cachoeira do Campo & Ouro Preto/MG',
  };

  saveCustomerOrder(order);
  return order;
}
