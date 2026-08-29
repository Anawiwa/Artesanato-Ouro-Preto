import React, { useState, useMemo } from 'react';
import { ShoppingCart, Zap, ShieldCheck, MapPin, Gift, Check, Copy, Code, Sparkles, Truck, ChevronRight, Compass, Printer, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { RAW_PROMPT1_BUY_BOX_HTML } from '../data/ouroPretoData';
import { calculateColonialShipping, OFFLINE_CEP_DATABASE } from '../data/colonialLogisticsData';
import { ColonialShippingSimulator } from './ColonialShippingSimulator';
import { LimitedStockAlert } from './LimitedStockAlert';
import { ProductDatasheetModal } from './ProductDatasheetModal';

interface BuyBoxProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, giftWrap: boolean) => void;
  onBuyNow: (product: Product, quantity: number, giftWrap: boolean) => void;
}

export const BuyBox: React.FC<BuyBoxProps> = ({ product, onAddToCart, onBuyNow }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [giftWrap, setGiftWrap] = useState<boolean>(false);
  const [cep, setCep] = useState<string>('35400-000');
  const [isEditingCep, setIsEditingCep] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [showShippingModal, setShowShippingModal] = useState<boolean>(false);
  const [showDatasheetModal, setShowDatasheetModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Dynamic shipping calculation for the Buy Box
  const shippingInfo = useMemo(() => {
    const raw = cep.replace(/\D/g, '') || '35400000';
    const offlineMatch = OFFLINE_CEP_DATABASE[raw];
    const city = offlineMatch?.city || (raw.startsWith('3540') ? 'Ouro Preto' : raw.startsWith('3542') ? 'Mariana' : 'Minas Gerais');
    const state = offlineMatch?.state || 'MG';
    const weight = product.titulo.toLowerCase().includes('panela') ? 4.2 : 2.0;

    return calculateColonialShipping(raw, city, state, product.preco, weight);
  }, [cep, product.preco, product.titulo]);

  const bestOption = shippingInfo.options[0];

  // Pre-filled WhatsApp message for custom negotiations
  const artisanWhatsappMessage = `Olá, ${product.artesao || 'Mestre Artesão'}! Tenho interesse no artefato "${product.titulo}" (R$ ${product.preco.toFixed(2).replace('.', ',')}) do Mercado Colonial de Ouro Preto. Gostaria de tirar dúvidas e negociar personalizações na peça.`;
  const artisanWhatsappUrl = `https://wa.me/5531998765432?text=${encodeURIComponent(artisanWhatsappMessage)}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(RAW_PROMPT1_BUY_BOX_HTML);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, giftWrap);
    setAddedToast('Adicionado ao Carrinho com Sucesso!');
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, giftWrap);
  };

  const formattedPrice = product.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const originalPriceFormatted = product.preco_original
    ? product.preco_original.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : null;
  const installmentValue = (product.preco / 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="relative font-sans w-full">
      {/* Toast Alert */}
      {addedToast && (
        <div className="absolute -top-12 left-0 right-0 z-20 bg-[#2E6B40] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg flex items-center justify-between animate-bounce">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            {addedToast}
          </span>
        </div>
      )}

      {/* PROMPT 1 BUY BOX CONTAINER - BENTO GRID THEME */}
      <div className="w-full max-w-sm rounded-2xl border border-[#E5E0D8] bg-white p-5 shadow-sm text-[#2C1E14]">
        {/* Header Tag */}
        <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
          <span className="text-[11px] font-bold tracking-wider text-[#B8860B] uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            Caixa de Compra (Buy Box)
          </span>
          <button
            onClick={() => setShowCodeModal(true)}
            className="text-[11px] font-semibold text-[#70360D] hover:text-[#B8860B] flex items-center gap-1 underline underline-offset-2 cursor-pointer"
            title="Ver o código HTML e Tailwind CSS gerado"
          >
            <Code className="w-3 h-3" />
            Ver Código
          </button>
        </div>

        {/* Price & Installment Section */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-[#2C1E14] tracking-tight">{formattedPrice}</span>
            {originalPriceFormatted && (
              <span className="text-xs text-gray-400 line-through">{originalPriceFormatted}</span>
            )}
            {product.desconto_percentual && (
              <span className="rounded bg-[#C85A32]/10 px-2 py-0.5 text-xs font-extrabold text-[#C85A32]">
                -{product.desconto_percentual}%
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-600">
            em até <strong className="text-[#2C1E14]">6x de {installmentValue}</strong> sem juros
          </p>
        </div>

        {/* Shipping & Delivery Estimate */}
        <div className="mb-4 space-y-2 text-sm bg-[#FDFBF7] p-3 rounded-xl border border-[#3A3D40]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#2E6B40] text-xs">
              <Truck className="w-4 h-4 shrink-0 text-[#2E6B40]" />
              <span>
                {bestOption.price === 0 ? 'Frete GRÁTIS' : `Frete R$ ${bestOption.price.toFixed(2).replace('.', ',')}`} ({bestOption.name.slice(0, 24)})
              </span>
            </div>
            {shippingInfo.isHistoricCityMG && (
              <span className="text-[9px] font-black bg-[#C59B27] text-[#1A1810] px-1.5 py-0.5 rounded">
                🏛️ Rota Histórica
              </span>
            )}
          </div>

          <p className="text-xs text-gray-600">
            Entrega estimada: <strong className="text-[#2C1E14] font-bold">{bestOption.deliveryDateEstimated}</strong>
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-xs">
            <div className="flex items-center gap-1 text-gray-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
              <span>Para:</span>
              {isEditingCep ? (
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={() => setIsEditingCep(false)}
                  className="w-24 bg-white border border-[#B8860B] px-1.5 py-0.5 rounded text-xs font-bold"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingCep(true)}
                  className="font-bold underline text-[#2C1E14] hover:text-[#B8860B] cursor-pointer"
                >
                  {shippingInfo.city} ({cep})
                </button>
              )}
            </div>

            <button
              onClick={() => setShowShippingModal(true)}
              className="text-[11px] font-bold text-[#70360D] hover:text-[#C59B27] underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Ver Opções</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Stock Status / Urgency Alert */}
        <div className="mb-4">
          <LimitedStockAlert
            product={product}
            threshold={8}
            compact={true}
          />
        </div>

        {/* Quantity Selector */}
        <div className="mb-5 flex items-center justify-between text-sm">
          <label htmlFor="quantity-select" className="font-medium text-gray-600">
            Quantidade:
          </label>
          <select
            id="quantity-select"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-[#2C1E14] shadow-sm focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] outline-none cursor-pointer"
          >
            {Array.from({ length: Math.min(product.estoque, 10) }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'unidade' : 'unidades'}
              </option>
            ))}
          </select>
        </div>

        {/* ACTION BUTTONS (BENTO STYLE GOLD & TERRACOTTA) */}
        <div className="space-y-2.5">
          {/* Main Button: Adicionar ao Carrinho (Ouro Barroco) */}
          <button
            onClick={handleAddToCart}
            className="w-full rounded-full bg-[#B8860B] hover:bg-[#a67c0a] py-2.5 text-sm font-medium text-white shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            id="btn-add-to-cart"
          >
            <ShoppingCart className="w-4 h-4" />
            Adicionar ao Carrinho
          </button>

          {/* Buy Now Button: Comprar Agora (Terracota Mineira) */}
          <button
            onClick={handleBuyNow}
            className="w-full rounded-full bg-[#F7CA00] hover:bg-[#e6bc00] py-2.5 text-sm font-medium text-black shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            id="btn-buy-now"
          >
            <Zap className="w-4 h-4" />
            Comprar Agora
          </button>

          {/* Talk to Artisan on WhatsApp (Negociações Personalizadas) */}
          <a
            href={artisanWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#1FA855]"
            id="btn-talk-to-artisan"
            title={`Conversar com ${product.artesao || 'o artesão'} no WhatsApp para dúvidas ou encomendas sob medida`}
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Falar com o Artesão</span>
          </a>
        </div>

        {/* Logistics & Seller Info */}
        <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Vendido por:</span>
            <span className="font-semibold text-blue-700">{product.atelie || 'Minas Gourmet'}</span>
          </div>
          <div className="flex justify-between">
            <span>Enviado por:</span>
            <span className="font-semibold text-blue-700">Artesanato OP</span>
          </div>
          <div className="flex items-center gap-1.5 pt-2 text-[#2E6B40] font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Transação Segura & Autenticidade Garantida</span>
          </div>

          {/* Ficha Técnica & Certificado Button */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-500">Documento Oficial:</span>
            <button
              type="button"
              onClick={() => setShowDatasheetModal(true)}
              className="text-[11px] font-bold text-[#70360D] hover:text-[#B8860B] flex items-center gap-1 underline underline-offset-2 cursor-pointer transition-colors"
              title="Gerar e imprimir Ficha Técnica e Certificado"
            >
              <Printer className="w-3 h-3 text-[#B8860B]" />
              <span>Imprimir Ficha Técnica</span>
            </button>
          </div>
        </div>

        {/* Gift Wrapping Option */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-[#B8860B] focus:ring-[#B8860B]"
            />
            <span>
              Incluir <strong className="text-[#2C1E14]">embalagem artesanal de chita mineira</strong> para presente (+ R$ 8,00)
            </span>
          </label>
        </div>
      </div>

      {/* SHIPPING SIMULATOR MODAL */}
      {showShippingModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#3A3D40]/20 overflow-hidden animate-fadeIn">
            <div className="p-4 bg-[#1A1810] text-white flex items-center justify-between border-b border-[#C59B27]/30">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#C59B27]" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Logística Colonial & Frete para {product.titulo}
                </h3>
              </div>
              <button
                onClick={() => setShowShippingModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <ColonialShippingSimulator
                currentProduct={product}
                defaultCep={cep}
                onSelectShippingOption={(opt, res) => {
                  setCep(res.cep);
                  setShowShippingModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CODE INSPECTOR MODAL FOR PROMPT 1 */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a130f] text-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-white/20">
            {/* Modal Header */}
            <div className="p-4 bg-[#261B15] rounded-t-2xl border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#B8860B]" />
                <h3 className="font-extrabold text-base text-white">
                  Código HTML & Tailwind CSS da Caixa de Compra
                </h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-white/60 hover:text-white text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-stone-200 bg-[#120D0A]">
              <div className="mb-3 text-[#B8860B] text-[11px] font-sans bg-[#B8860B]/10 p-2.5 rounded border border-[#B8860B]/30">
                📌 <strong>Estrutura da Caixa de Compra:</strong> Estrutura oficial da Amazon Brasil aplicada com observação das cores Ouro Preto:
                Botão Principal em <strong>Ouro Barroco (#B8860B)</strong> e fundo em <strong>Branco Colonial (#FDFBF7)</strong>.
              </div>
              <pre className="whitespace-pre-wrap break-all p-3 bg-black/40 rounded-lg text-emerald-300">
                {RAW_PROMPT1_BUY_BOX_HTML}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#261B15] rounded-b-2xl border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/60">Tailwind CSS v4 & React Component</span>
              <button
                onClick={handleCopyCode}
                className="bg-[#B8860B] hover:bg-[#a67c0a] text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedCode ? 'Código Copiado!' : 'Copiar Código HTML/Tailwind'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Technical Datasheet & Authenticity Certificate */}
      <ProductDatasheetModal
        product={product}
        isOpen={showDatasheetModal}
        onClose={() => setShowDatasheetModal(false)}
      />
    </div>
  );
};
