import React, { useState } from 'react';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Gift, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Plus, 
  CreditCard, 
  QrCode, 
  FileText, 
  Building2, 
  Copy, 
  Check, 
  ChevronLeft, 
  Lock,
  Percent
} from 'lucide-react';
import { CartItem, Product, PaymentMethod, PaymentRecord, OrderItemDetail } from '../types';
import { BRAZILIAN_BANKS, generatePixPayload, generateBoletoLine } from '../data/banking';
import { getSupabase } from '../lib/supabase';
import { createNewOrderFromCheckout } from '../data/ordersData';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  allProducts?: Product[];
  onAddToCart?: (product: Product, quantity: number, giftWrap: boolean) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onToggleGiftWrap: (productId: string) => void;
  onClearCart: () => void;
  onOpenOrders?: () => void;
}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  allProducts = [],
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onToggleGiftWrap,
  onClearCart,
  onOpenOrders,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [completedPayment, setCompletedPayment] = useState<PaymentRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('Mariana Silva Alvarenga');
  const [customerEmail, setCustomerEmail] = useState('mariana.silva@email.com');
  const [customerDocument, setCustomerDocument] = useState('123.456.789-00');
  const [customerPhone, setCustomerPhone] = useState('(31) 98765-4321');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('pix');
  const [selectedBankCode, setSelectedBankCode] = useState<string>('260'); // Nubank default
  const [installments, setInstallments] = useState<number>(1);
  const [cardBrand, setCardBrand] = useState<string>('Mastercard');
  const [cardNumber, setCardNumber] = useState<string>('•••• •••• •••• 4821');

  if (!isOpen) return null;

  const cartProductIds = new Set(cartItems.map((i) => i.product.id));
  const suggestedProducts = allProducts.filter((p) => !cartProductIds.has(p.id)).slice(0, 3);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.preco * item.quantity + (item.giftWrap ? 8 * item.quantity : 0),
    0
  );

  // PIX gets 5% discount
  const pixDiscount = selectedMethod === 'pix' ? subtotal * 0.05 : 0;
  const finalTotal = subtotal - pixDiscount;

  const selectedBank = BRAZILIAN_BANKS.find((b) => b.code === selectedBankCode) || BRAZILIAN_BANKS[0];

  const handleProceedToPayment = () => {
    setStep('checkout');
  };

  const handleExecuteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedOrderNum = `OP-${Date.now().toString().slice(-6)}`;
    const generatedPaymentId = `PAY-${selectedMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrderNum);

    const now = new Date().toISOString();

    // Build Payment Record
    const paymentRecord: PaymentRecord = {
      id: generatedPaymentId,
      order_id: generatedOrderNum,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_document: customerDocument,
      customer_phone: customerPhone,
      payment_method: selectedMethod,
      bank_code: selectedBank.code,
      bank_name: selectedBank.name,
      amount: finalTotal,
      installments: selectedMethod === 'cartao_credito' ? installments : 1,
      status: selectedMethod === 'pix' || selectedMethod.includes('cartao') ? 'pago' : 'pendente',
      created_at: now,
      paid_at: selectedMethod === 'pix' || selectedMethod.includes('cartao') ? now : undefined,
    };

    if (selectedMethod === 'pix') {
      paymentRecord.pix_key = 'pix@ouropretominas.com.br';
      paymentRecord.pix_key_type = 'email';
      paymentRecord.pix_txid = `TXID-${Date.now().toString().slice(-8)}`;
      paymentRecord.pix_end_to_end_id = `E${selectedBank.ispb || '00000000'}${Date.now()}`;
      paymentRecord.pix_copy_paste = generatePixPayload(finalTotal, paymentRecord.pix_txid, selectedBank.name);
    } else if (selectedMethod === 'boleto') {
      const bInfo = generateBoletoLine(selectedBank.code, finalTotal);
      paymentRecord.boleto_barcode = bInfo.barcode;
      paymentRecord.boleto_digitable_line = bInfo.digitableLine;
      paymentRecord.boleto_due_date = bInfo.dueDate;
    } else if (selectedMethod === 'cartao_credito' || selectedMethod === 'cartao_debito') {
      paymentRecord.card_brand = cardBrand;
      paymentRecord.card_last_digits = cardNumber.slice(-4) || '4821';
      paymentRecord.card_holder_name = customerName.toUpperCase();
      paymentRecord.gateway_transaction_id = `AUTH-${selectedBank.code}-${Date.now().toString().slice(-6)}`;
    } else if (selectedMethod === 'transferencia_ted') {
      paymentRecord.bank_agency = '0001';
      paymentRecord.bank_account = '984102-3';
    }

    setCompletedPayment(paymentRecord);

    // Save to local payment cache for Admin view
    try {
      const savedLocal = localStorage.getItem('ouro_saved_payments');
      const existing = savedLocal ? JSON.parse(savedLocal) : [];
      localStorage.setItem('ouro_saved_payments', JSON.stringify([paymentRecord, ...existing]));
    } catch (err) {
      console.warn('Erro ao salvar pagamento no cache local:', err);
    }

    // Create & Save Customer Order for 'Meus Pedidos' & Live Tracking
    try {
      const orderItemsDetail: OrderItemDetail[] = cartItems.map((item) => ({
        productId: item.product.id,
        title: item.product.titulo,
        artisan: item.product.artesao,
        atelier: item.product.atelie,
        category: item.product.categoria,
        imageUrl: item.product.imagem_url,
        quantity: item.quantity,
        unitPrice: item.product.preco,
        totalPrice: item.product.preco * item.quantity,
        weight: item.product.peso,
        giftWrap: item.giftWrap,
        specSummary: item.product.dimensoes,
      }));

      createNewOrderFromCheckout({
        orderId: generatedOrderNum,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        customerDocument: customerDocument,
        shippingAddress: {
          street: 'Rua Direita',
          number: '48',
          neighborhood: 'Centro Histórico',
          city: 'Ouro Preto',
          state: 'MG',
          cep: '35400-000',
          isHistoricCityMG: true,
        },
        carrierName: 'Carruagem Expressa Colonial (Portador Mineiro)',
        shippingTier: 'Entrega Expressa Estrada Real',
        shippingPrice: 0,
        items: orderItemsDetail,
        subtotal: subtotal,
        discount: pixDiscount,
        total: finalTotal,
        payment: paymentRecord,
      });
    } catch (orderErr) {
      console.warn('Erro ao gerar pedido do cliente:', orderErr);
    }

    // Insert into Supabase
    try {
      const client = getSupabase();
      if (client && cartItems.length > 0) {
        // 1. Insert into orders table
        const { data: newOrder } = await client
          .from('orders')
          .insert([
            {
              customer_name: customerName,
              customer_email: customerEmail,
              subtotal: subtotal,
              shipping_cost: 0,
              total: finalTotal,
              status: selectedMethod === 'pix' || selectedMethod.includes('cartao') ? 'pago' : 'pendente',
              notes: `Pedido #${generatedOrderNum} via Vitrine (${selectedMethod.toUpperCase()} - ${selectedBank.name})`,
            },
          ])
          .select();

        // 2. Insert order items
        if (newOrder && newOrder[0]?.id) {
          const itemsToInsert = cartItems.map((item) => ({
            order_id: newOrder[0].id,
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.preco,
            gift_wrap: item.giftWrap,
          }));
          await client.from('order_items').insert(itemsToInsert);
        }

        // 3. Insert into payments table (if table exists)
        try {
          const remotePayment = {
            ...paymentRecord,
            order_id: newOrder && newOrder[0]?.id ? newOrder[0].id : generatedOrderNum,
          };
          await client.from('payments').insert([remotePayment]);
        } catch (payErr) {
          console.warn('Tabela payments no Supabase não encontrada ou RLS restrito:', payErr);
        }
      }
    } catch (e) {
      console.warn('Erro geral de checkout no Supabase:', e);
    } finally {
      setIsProcessing(false);
      setStep('success');
      onClearCart();
    }
  };

  const handleCopyCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleCloseAfterSuccess = () => {
    setStep('cart');
    setCompletedPayment(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end font-sans">
      <div className="bg-[#F5F2ED] w-full max-w-md h-full flex flex-col shadow-2xl border-l border-[#E5E0D8] text-[#2C1E14] overflow-hidden">
        
        {/* Cart Header */}
        <div className="p-4 bg-[#1a130f] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button
                onClick={() => setStep('cart')}
                className="p-1 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 mr-1 cursor-pointer"
                title="Voltar ao carrinho"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-[#B8860B]" />
            <h3 className="font-serif font-bold text-base">
              {step === 'cart' ? 'Carrinho Ouro Preto' : step === 'checkout' ? 'Pagamento & Checkout' : 'Recibo do Pedido'}
            </h3>
            {step === 'cart' && (
              <span className="bg-[#B8860B] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} itens
              </span>
            )}
          </div>
          <button
            onClick={step === 'success' ? handleCloseAfterSuccess : onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART ITEMS VIEW */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                  <p className="text-sm font-bold text-[#2C1E14]">Seu carrinho está vazio.</p>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Navegue pelas panelas de pedra-sabão, doces tradicionais e esculturas para adicionar produtos artesanais.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-xl p-3 border border-[#E5E0D8] shadow-sm space-y-2"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.product.imagem_url}
                        alt={item.product.titulo}
                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#2C1E14] line-clamp-2 leading-tight">
                          {item.product.titulo}
                        </h4>
                        <span className="text-[10px] text-[#B8860B] font-semibold block mt-0.5">
                          {item.product.atelie}
                        </span>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm text-[#2C1E14]">
                            {(item.product.preco * item.quantity).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>

                          <div className="flex items-center gap-1 border border-stone-200 rounded px-1">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="px-1.5 py-0.5 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold px-1">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-1.5 py-0.5 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                      <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.giftWrap}
                          onChange={() => onToggleGiftWrap(item.product.id)}
                          className="rounded text-[#B8860B] focus:ring-[#B8860B]"
                        />
                        <Gift className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Embalagem presente (+ R$ 8,00)</span>
                      </label>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-red-600 text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Cross-Sell Recommendations */}
              {suggestedProducts.length > 0 && onAddToCart && (
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C1E14]">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Aproveite e leve junto (Artesanato Mineiro):</span>
                  </div>

                  <div className="space-y-2">
                    {suggestedProducts.map((sug) => (
                      <div
                        key={sug.id}
                        className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[#E5E0D8] text-xs hover:border-[#B8860B] transition-colors"
                      >
                        <img
                          src={sug.imagem_url}
                          alt={sug.titulo}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-[#2C1E14] line-clamp-1 text-[11px]">
                            {sug.titulo}
                          </h5>
                          <span className="font-black text-[#70360D] text-xs">
                            R$ {sug.preco.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <button
                          onClick={() => onAddToCart(sug, 1, false)}
                          className="bg-[#B8860B] hover:bg-[#a67c0a] text-white p-1.5 rounded-lg flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                          title="Adicionar ao carrinho"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-white border-t border-[#E5E0D8] space-y-3 shadow-lg shrink-0">
                <div className="space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal dos Produtos:</span>
                    <span className="font-bold text-[#2C1E14]">
                      {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#2E6B40] font-semibold">
                    <span>Frete Ouro Preto Express:</span>
                    <span>GRÁTIS</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-100 text-sm font-bold text-[#2C1E14]">
                    <span>Total do Pedido:</span>
                    <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-[#B8860B] hover:bg-[#a67c0a] text-white py-3 rounded-full font-bold text-sm shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar para Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B40]" />
                  <span>Ambiente seguro com PIX Instantâneo e Cartão</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT & PAYMENT MODALITIES */}
        {step === 'checkout' && (
          <form onSubmit={handleExecuteCheckout} className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              {/* Customer Details Box */}
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm space-y-2.5">
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>1. Dados do Comprador / Pagador</span>
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Nome Completo:</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2 text-xs border border-stone-200 rounded-lg focus:border-[#B8860B]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-0.5">CPF / Documento:</label>
                      <input
                        type="text"
                        required
                        value={customerDocument}
                        onChange={(e) => setCustomerDocument(e.target.value)}
                        className="w-full p-2 text-xs border border-stone-200 rounded-lg focus:border-[#B8860B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Telefone / WhatsApp:</label>
                      <input
                        type="text"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2 text-xs border border-stone-200 rounded-lg focus:border-[#B8860B]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-0.5">E-mail para Recibo:</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full p-2 text-xs border border-stone-200 rounded-lg focus:border-[#B8860B]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Modalities Selector */}
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>2. Escolha a Modalidade de Pagamento</span>
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* PIX Option */}
                  <label
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      selectedMethod === 'pix'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-sm'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="pix"
                      checked={selectedMethod === 'pix'}
                      onChange={() => setSelectedMethod('pix')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold text-xs">PIX Instantâneo</span>
                      </div>
                      <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                        5% OFF
                      </span>
                    </div>
                  </label>

                  {/* Cartão de Crédito */}
                  <label
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      selectedMethod === 'cartao_credito'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cartao_credito"
                      checked={selectedMethod === 'cartao_credito'}
                      onChange={() => setSelectedMethod('cartao_credito')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold text-xs">Cartão de Crédito</span>
                      </div>
                      <span className="text-[9px] text-stone-500 block mt-0.5">Até 12x sem juros</span>
                    </div>
                  </label>

                  {/* Boleto Bancário */}
                  <label
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      selectedMethod === 'boleto'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-900 shadow-sm'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="boleto"
                      checked={selectedMethod === 'boleto'}
                      onChange={() => setSelectedMethod('boleto')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-bold text-xs">Boleto Bancário</span>
                      </div>
                      <span className="text-[9px] text-stone-500 block mt-0.5">Vencimento 3 dias</span>
                    </div>
                  </label>

                  {/* Transferência / TED */}
                  <label
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      selectedMethod === 'transferencia_ted'
                        ? 'border-stone-600 bg-stone-100 text-stone-900 shadow-sm'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="transferencia_ted"
                      checked={selectedMethod === 'transferencia_ted'}
                      onChange={() => setSelectedMethod('transferencia_ted')}
                      className="text-stone-600 focus:ring-stone-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-stone-600" />
                        <span className="font-bold text-xs">TED / Bancária</span>
                      </div>
                      <span className="text-[9px] text-stone-500 block mt-0.5">Contas dos Ateliês</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Banking Institution Selection */}
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm space-y-2">
                <label className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>3. Instituição Bancária (Origem / Emissor)</span>
                </label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full p-2 text-xs border border-stone-200 rounded-lg bg-stone-50 font-bold text-stone-800 focus:border-[#B8860B]"
                >
                  {BRAZILIAN_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code} - {b.name} ({b.fullName})
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedBank.color || '#B8860B' }}
                  />
                  <span>
                    Banco Selecionado: <strong>{selectedBank.name}</strong> • Conectado à Rede SPI / Bacen
                  </span>
                </div>
              </div>

              {/* Installments selector if Credit Card */}
              {selectedMethod === 'cartao_credito' && (
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-blue-900">Parcelamento no Cartão:</label>
                    <span className="text-[10px] text-blue-700 font-semibold">Sem juros em Ouro Preto</span>
                  </div>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full p-2 text-xs border border-blue-300 rounded-lg bg-white font-bold text-blue-950"
                  >
                    {[1, 2, 3, 4, 5, 6, 10, 12].map((inst) => (
                      <option key={inst} value={inst}>
                        {inst}x de {(finalTotal / inst).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}{' '}
                        {inst === 1 ? '(À vista)' : '(Sem juros)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Checkout Footer Action */}
            <div className="p-4 bg-white border-t border-[#E5E0D8] space-y-3 shadow-lg shrink-0">
              <div className="space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                {selectedMethod === 'pix' && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3 h-3" /> Desconto Especial PIX (5%):
                    </span>
                    <span>-{pixDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-stone-100 text-sm font-black text-[#2C1E14]">
                  <span>Total Final:</span>
                  <span className="text-emerald-800">
                    {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#2E6B40] hover:bg-[#235331] text-white py-3 rounded-full font-bold text-sm shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registrando Pagamento no Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Pagamento ({selectedMethod.toUpperCase()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS & DETAILED RECEIPT */}
        {step === 'success' && completedPayment && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-serif font-bold text-[#2C1E14]">
                {completedPayment.payment_method === 'pix' ? 'Pagamento PIX Gerado!' : 'Pedido & Pagamento Registrado!'}
              </h4>
              <p className="text-xs text-stone-600">
                Seu pagamento foi vinculado ao ateliê e armazenado na tabela de transações.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] text-xs text-left w-full space-y-2.5 shadow-sm">
              <div className="flex justify-between font-bold border-b pb-2 border-stone-100">
                <span className="text-stone-500">Código do Pedido:</span>
                <span className="text-[#B8860B] font-mono">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">ID da Transação:</span>
                <span className="font-mono text-[11px] text-stone-700">{completedPayment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Instituição Bancária:</span>
                <span className="font-bold text-stone-800">{completedPayment.bank_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Modalidade:</span>
                <span className="font-bold uppercase text-emerald-800">
                  {completedPayment.payment_method.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-100 text-sm font-black">
                <span>Valor Registrado:</span>
                <span className="text-emerald-700">
                  {completedPayment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            {/* PIX Details */}
            {completedPayment.payment_method === 'pix' && completedPayment.pix_copy_paste && (
              <div className="w-full bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-emerald-700" /> PIX Copia e Cola:
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                    Bacen 24/7
                  </span>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-300 font-mono text-[10px] text-stone-700 break-all select-all">
                  {completedPayment.pix_copy_paste}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(completedPayment.pix_copy_paste || '')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Código PIX Copiado!' : 'Copiar Código PIX'}</span>
                </button>
              </div>
            )}

            {/* Boleto Details */}
            {completedPayment.payment_method === 'boleto' && completedPayment.boleto_digitable_line && (
              <div className="w-full bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-left space-y-2">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-amber-700" /> Linha Digitável do Boleto:
                </span>
                <div className="bg-white p-2 rounded border border-amber-300 font-mono text-[10px] text-stone-700 select-all">
                  {completedPayment.boleto_digitable_line}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(completedPayment.boleto_digitable_line || '')}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Linha Digitável Copiada!' : 'Copiar Linha Digitável'}</span>
                </button>
              </div>
            )}

            <div className="w-full space-y-2 pt-2">
              {onOpenOrders && (
                <button
                  type="button"
                  onClick={() => {
                    handleCloseAfterSuccess();
                    onOpenOrders();
                  }}
                  className="w-full bg-[#70360D] hover:bg-[#542809] text-[#E8C547] py-3 rounded-full font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#C59B27]/40"
                >
                  <span>📦 Rastrear Encomenda na Estrada Real</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCloseAfterSuccess}
                className="w-full bg-stone-200 hover:bg-stone-300 text-stone-800 py-2.5 rounded-full font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                Voltar à Vitrine
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
