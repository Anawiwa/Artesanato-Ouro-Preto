export type CertificationType =
  | 'iphan'
  | 'organico'
  | 'indicacao_geografica'
  | 'patrimonio_imaterial'
  | 'artesanato_manual';

export interface ProductCertification {
  tipo: CertificationType;
  nome: string;
  subtexto?: string;
  seloOficial?: string;
  regId?: string;
}

export interface Product {
  id: string;
  titulo: string;
  subtitulo?: string;
  categoria: string;
  preco: number;
  preco_original?: number;
  desconto_percentual?: number;
  nota_avaliacao: number;
  quantidade_reviews: number;
  selo_destaque?: string;
  certificacoes?: ProductCertification[];
  imagem_url: string;
  imagens_galeria?: string[];
  estoque: number;
  artesao: string;
  atelie: string;
  cidade: string;
  especificacoes: Record<string, string>;
  bullet_points: string[];
  descricao_detalhada: string;
  dimensoes?: string;
  peso?: string;
  tempo_preparo_envio?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  giftWrap: boolean;
}

export interface ColorPaletteItem {
  name: string;
  hex: string;
  role: string;
  description: string;
  textColor: string;
}

export type ActiveTab = 'all' | 'prompt1' | 'prompt2' | 'prompt3';

export type PaymentMethod =
  | 'pix'
  | 'cartao_credito'
  | 'cartao_debito'
  | 'boleto'
  | 'transferencia_ted';

export type PaymentStatus =
  | 'pendente'
  | 'processando'
  | 'pago'
  | 'recusado'
  | 'estornado'
  | 'cancelado';

export interface BankInstitution {
  code: string; // COMPE code, ex: '001', '341', '260'
  name: string;
  fullName: string;
  ispb?: string;
  pixSupported: boolean;
  boletoSupported: boolean;
  tedSupported: boolean;
  color?: string;
  iconType?: string;
}

export interface PaymentRecord {
  id: string;
  order_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_document?: string;
  customer_phone?: string;
  payment_method: PaymentMethod;
  bank_code: string;
  bank_name: string;
  amount: number;
  installments: number;
  status: PaymentStatus;
  
  // PIX details
  pix_key?: string;
  pix_key_type?: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  pix_qr_code?: string;
  pix_copy_paste?: string;
  pix_txid?: string;
  pix_end_to_end_id?: string;

  // Boleto details
  boleto_barcode?: string;
  boleto_digitable_line?: string;
  boleto_due_date?: string;

  // Card details
  card_brand?: string;
  card_last_digits?: string;
  card_holder_name?: string;
  card_installments_fee?: number;

  // Transfer details
  bank_agency?: string;
  bank_account?: string;

  gateway_name?: string;
  gateway_transaction_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  paid_at?: string;
}

export interface CustomerTestimonial {
  id: string;
  customerName: string;
  cityState: string;
  productPurchased: string;
  productId?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  tags: string[];
  helpfulCount: number;
  artisanOrCategoryMentioned?: string;
  avatarColor?: string;
  isAiGenerated?: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  price: number;
  originalPrice?: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  deliveryDateEstimated: string;
  isColonialSpecial: boolean;
  badge?: string;
  description: string;
  iconType: 'horse_carriage' | 'truck' | 'plane' | 'box';
  insuranceIncluded: boolean;
  specialPackaging: string;
}

export interface ShippingSimulationResult {
  cep: string;
  city: string;
  state: string;
  neighborhood?: string;
  street?: string;
  isHistoricCityMG: boolean;
  historicCityName?: string;
  historicCityPerk?: string;
  distanceKmEstimated?: number;
  originHub: string;
  calculatedAt: string;
  options: ShippingOption[];
}

export interface OrderTrackingEvent {
  step: number; // 1 to 5
  title: string;
  subtitle: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  detail?: string;
  artisanNote?: string;
}

export interface OrderItemDetail {
  productId: string;
  title: string;
  artisan: string;
  atelier: string;
  category: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  weight?: string;
  giftWrap?: boolean;
  specSummary?: string;
}

export type OrderFulfillmentStatus =
  | 'em_producao'
  | 'embalado_madeira'
  | 'despachado_estrada_real'
  | 'em_transito'
  | 'saiu_para_entrega'
  | 'entregue'
  | 'cancelado';

export interface CustomerOrder {
  id: string; // ex: ORP-2026-9841
  displayId: string;
  created_at: string;
  estimatedDeliveryDate: string;
  delivered_at?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_document?: string;
  shipping_address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    isHistoricCityMG?: boolean;
  };
  shipping_carrier: string;
  shipping_tier: string;
  shipping_price: number;
  tracking_code: string;
  tracking_url?: string;
  status: OrderFulfillmentStatus;
  status_label: string;
  items: OrderItemDetail[];
  subtotal: number;
  discount: number;
  total: number;
  payment: PaymentRecord;
  tracking_timeline: OrderTrackingEvent[];
  authenticity_certificate_code: string;
  artisan_workshop_city: string;
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsappOptIn: boolean;
  interests: string[];
  subscribedAt: string;
  frequency: 'quinzenal';
  couponCode: string;
  status: 'active' | 'unsubscribed';
}
