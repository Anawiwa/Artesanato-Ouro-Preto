import React, { useState } from 'react';
import { Feather, Check, Copy, Sparkles, Award, HeartHandshake, ShieldCheck, Star, Printer, FileText } from 'lucide-react';
import { Product } from '../types';
import { BuyBox } from './BuyBox';
import { RotatingProductImage } from './RotatingProductImage';
import { RecommendationSystem } from './RecommendationSystem';
import { CustomerTestimonials } from './CustomerTestimonials';
import { ColonialShippingSimulator } from './ColonialShippingSimulator';
import { LimitedStockAlert } from './LimitedStockAlert';
import { ProductDatasheetModal } from './ProductDatasheetModal';
import { ProductBadges } from './ProductBadges';

interface CopywritingSectionProps {
  product: Product;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, giftWrap: boolean) => void;
  onBuyNow: (product: Product, quantity: number, giftWrap: boolean) => void;
  onAddMultipleToCart?: (products: Product[]) => void;
}

export const CopywritingSection: React.FC<CopywritingSectionProps> = ({
  product,
  allProducts = [],
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onAddMultipleToCart,
}) => {
  const [copiedCopy, setCopiedCopy] = useState<boolean>(false);
  const [showDatasheetModal, setShowDatasheetModal] = useState<boolean>(false);

  const fullCopyText = `PRODUTO: ${product.titulo}
PREÇO: R$ ${product.preco.toFixed(2)}

BULLET POINTS (ESTILO AMAZON):
${product.bullet_points.join('\n\n')}

DESCRIÇÃO DETALHADA E SEO:
${product.descricao_detalhada}

ESPECIFICAÇÕES TÉCNICAS:
${Object.entries(product.especificacoes)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join('\n')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCopyText);
    setCopiedCopy(true);
    setTimeout(() => setCopiedCopy(false), 3000);
  };

  return (
    <div className="bg-[#F5F2ED] py-8 px-6 font-sans text-[#2C1E14]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner Alert Prompt 3 - Bento Style */}
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B8860B] flex items-center justify-center text-white shrink-0 font-bold shadow-sm">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">
                  Copywriting & SEO estilo Amazon
                </span>
                <span className="bg-[#2E6B40] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Tom Vendedor & Tradicional
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#2C1E14] mt-0.5">
                Doce de Leite Artesanal com Nozes de Ouro Preto (500g)
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Estrutura completa com 5 Bullet Points em caixa alta, parágrafos persuasivos de SEO e histórico do tacho de cobre colonial.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowDatasheetModal(true)}
              className="flex items-center gap-2 bg-[#2C1E14] hover:bg-[#3D2B1E] text-[#E8C547] px-4 py-2.5 rounded-xl text-xs font-bold shadow border border-[#C59B27]/40 transition-all cursor-pointer"
              id="btn-print-datasheet-top"
              title="Gerar e imprimir Ficha Técnica e Certificado de Autenticidade"
            >
              <Printer className="w-4 h-4 text-[#E8C547]" />
              <span>Imprimir Ficha Técnica</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-[#B8860B] hover:bg-[#a67c0a] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
            >
              {copiedCopy ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedCopy ? 'Copy Copiada!' : 'Copiar Texto Completo'}
            </button>
          </div>
        </div>

        {/* Main Product Layout (Bento Grid Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: GALLERY & ARTISAN CARD (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <RotatingProductImage
              src={product.imagem_url}
              alt={product.titulo}
              heightClass="h-80"
              autoRotateDefault={false}
              badgeText="Giro 360° Interativo"
            />

            {/* Artisan Spotlight Card */}
            <div className="bg-white rounded-2xl p-4 border border-[#E5E0D8] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B]">
                <HeartHandshake className="w-4 h-4 text-[#B8860B]" />
                <span>Feito por Mãos Artesãs de Ouro Preto</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Produzido por <strong className="text-[#2C1E14]">{product.artesao}</strong> no ateliê{' '}
                <strong className="text-[#B8860B]">{product.atelie}</strong> em {product.cidade}.
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Processo: 100% Manual</span>
                <span className="font-bold text-[#2E6B40]">Selo IPHAN nº 842</span>
              </div>
            </div>
          </div>

          {/* CENTER: PRODUCT TITLE, RATING & BULLET POINTS (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Category & Badge */}
            <div>
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-wider block">
                {product.categoria} • Origem: Distrito de São Bartolomeu
              </span>
              <h1 className="text-2xl font-serif font-bold text-[#2C1E14] leading-snug mt-1">
                {product.titulo}
              </h1>
              <p className="text-xs text-stone-500 mt-1 italic">{product.subtitulo}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 border-y border-[#E5E0D8] py-2.5 text-xs">
              <div className="flex text-[#B8860B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#B8860B]" />
                ))}
              </div>
              <span className="font-bold text-[#2C1E14]">{product.nota_avaliacao} de 5</span>
              <span className="text-stone-300">|</span>
              <a href="#reviews" className="text-blue-700 hover:underline font-medium">
                {product.quantidade_reviews} avaliações
              </a>
              <span className="text-stone-300">|</span>
              <span className="bg-[#2E6B40]/10 text-[#2E6B40] px-2 py-0.5 rounded font-bold">
                Autêntico Mineiro
              </span>
            </div>

            {/* Visual Certification Badges (IPHAN, Orgânico, Indicação Geográfica) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Selos Oficiais de Autenticidade:
              </span>
              <ProductBadges certifications={product.certificacoes} variant="expanded" />
            </div>

            {/* DYNAMIC ARTISAN LIMITED STOCK ALERT */}
            <LimitedStockAlert
              product={product}
              threshold={8}
              onAddToCart={() => onAddToCart(product, 1, false)}
              onBuyNow={() => onBuyNow(product, 1, false)}
              showSimulateControls={true}
            />

            {/* PROMPT 3: 5 BULLET POINTS ESTILO AMAZON */}
            <div className="space-y-3 bg-white rounded-2xl p-5 border border-[#E5E0D8] shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2C1E14] flex items-center gap-2 border-b border-stone-100 pb-2">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                Destaques da Tradição
              </h3>
              <ul className="space-y-3 text-xs leading-relaxed text-stone-700">
                {product.bullet_points.map((bp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#B8860B] font-bold text-sm shrink-0">✓</span>
                    <span dangerouslySetInnerHTML={{ __html: bp.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#2C1E14]">$1</strong>') }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* SEO Narrative Description */}
            <div className="space-y-3 bg-white rounded-2xl p-5 border border-[#E5E0D8] shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2C1E14] border-b border-stone-100 pb-2">
                Descrição do Produto (SEO & Tradição Mineira)
              </h3>
              <div className="text-xs text-stone-600 leading-relaxed space-y-3">
                <p>
                  Descubra o verdadeiro sabor das Minas Gerais com o{' '}
                  <strong className="text-[#2C1E14]">Doce de Leite Artesanal com Nozes de Ouro Preto</strong>. Cada pote carrega a essência da culinária colonial barroca nascida no histórico distrito de São Bartolomeu, reconhecido patrimônio imaterial da doçaria mineira.
                </p>
                <p>
                  O leite fresco de fazendas locais é lentamente apurado em tachos de cobre batidos à mão em fogões a lenha por mais de 6 horas. Esse processo confere o tom caramelo dourado inconfundível, cremosismo aveludado único e um leve toque defumado refinado. As nozes nobres são torradas na hora e incorporadas generosamente.
                </p>
                <div className="bg-[#F5F2ED] p-3 rounded-lg border-l-4 border-[#B8860B] font-medium text-[11px] text-[#2C1E14]">
                  <p className="font-serif italic text-stone-600">
                    "O verdadeiro sabor mineiro preservado por gerações na doçaria artesanal colonial." — Mestre Santeiro
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BUY BOX COMPONENT (3 Columns) */}
          <div className="lg:col-span-3">
            <BuyBox product={product} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E0D8] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
            <h3 className="text-base font-serif font-bold text-[#2C1E14] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#B8860B]" />
              <span>Especificações Técnicas e Procedência</span>
            </h3>
            <button
              onClick={() => setShowDatasheetModal(true)}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EDE2] text-[#70360D] text-xs font-bold border border-[#D5CCC0] transition-colors cursor-pointer"
              title="Visualizar e Imprimir Ficha Técnica Completa"
            >
              <Printer className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Imprimir Ficha Técnica</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.entries(product.especificacoes).map(([key, val]) => (
              <div key={key} className="flex justify-between p-2.5 rounded-lg bg-[#F5F2ED] border border-[#E5E0D8]">
                <span className="font-semibold text-stone-600">{key}:</span>
                <span className="font-bold text-[#2C1E14] text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Colonial Shipping Simulator & Estrada Real Logistics */}
        <div className="pt-4">
          <ColonialShippingSimulator
            currentProduct={product}
            allProducts={allProducts}
          />
        </div>

        {/* Dynamic Recommendation System (Amazon & Mercado Livre Engine) */}
        {allProducts.length > 1 && (
          <div className="pt-4">
            <RecommendationSystem
              currentProduct={product}
              allProducts={allProducts}
              onSelectProduct={onSelectProduct || (() => {})}
              onAddToCart={onAddToCart}
              onAddMultipleToCart={onAddMultipleToCart}
            />
          </div>
        )}

        {/* Customer Reviews & Social Proof */}
        <div className="pt-4">
          <CustomerTestimonials
            products={allProducts}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
          />
        </div>
      </div>

      {/* Printable Certificate & Technical Sheet Modal */}
      <ProductDatasheetModal
        product={product}
        isOpen={showDatasheetModal}
        onClose={() => setShowDatasheetModal(false)}
      />
    </div>
  );
};
