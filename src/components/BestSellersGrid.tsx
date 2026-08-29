import React, { useState, useMemo } from 'react';
import {
  Star,
  FileJson,
  Copy,
  Check,
  ShoppingCart,
  Award,
  ArrowRight,
  Edit3,
  RotateCw,
  Sparkles,
  Flame,
  Printer,
  FileText,
  SlidersHorizontal,
  RotateCcw,
  DollarSign,
  Filter,
  SearchX,
} from 'lucide-react';
import { Product } from '../types';
import { BEST_SELLERS_PRODUCTS, RAW_PROMPT2_JSON_STRING } from '../data/ouroPretoData';
import { ParallaxGalleryImage } from './ParallaxGalleryImage';
import { ProductDatasheetModal } from './ProductDatasheetModal';
import { ProductBadges } from './ProductBadges';

interface BestSellersGridProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, giftWrap: boolean) => void;
  onEditProduct?: (product: Product) => void;
  isAdminLogged?: boolean;
}

export const BestSellersGrid: React.FC<BestSellersGridProps> = ({ 
  products = BEST_SELLERS_PRODUCTS, 
  onSelectProduct, 
  onAddToCart,
  onEditProduct,
  isAdminLogged = false,
}) => {
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [rotatingCardId, setRotatingCardId] = useState<string | null>(null);
  const [datasheetProduct, setDatasheetProduct] = useState<Product | null>(null);

  // Price boundaries calculation
  const { calculatedMin, calculatedMax } = useMemo(() => {
    if (!products.length) return { calculatedMin: 0, calculatedMax: 500 };
    const prices = products.map((p) => p.preco);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    return {
      calculatedMin: min,
      calculatedMax: Math.max(max, 450),
    };
  }, [products]);

  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number>(calculatedMax);
  const [selectedMinPrice, setSelectedMinPrice] = useState<number>(0);

  // Ensure slider max adjusts when products change
  React.useEffect(() => {
    setSelectedMaxPrice((prev) => (prev < calculatedMin ? calculatedMax : prev > calculatedMax ? calculatedMax : prev));
  }, [calculatedMax, calculatedMin]);

  // Filter products by price range
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) => p.preco >= selectedMinPrice && p.preco <= selectedMaxPrice
    );
  }, [products, selectedMinPrice, selectedMaxPrice]);

  const isFilterActive = selectedMaxPrice < calculatedMax || selectedMinPrice > 0;

  const handleResetFilter = () => {
    setSelectedMinPrice(0);
    setSelectedMaxPrice(calculatedMax);
  };

  const handleCardSpin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRotatingCardId(id);
    setTimeout(() => {
      setRotatingCardId((prev) => (prev === id ? null : prev));
    }, 1600);
  };

  const rawJsonString = JSON.stringify(
    filteredProducts.map(p => ({
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

  const handleCopyJson = () => {
    navigator.clipboard.writeText(rawJsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 3000);
  };

  return (
    <section className="py-8 px-6 font-sans bg-[#F5F2ED]" id="catalogo-ouro-preto">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#E5E0D8] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B8860B]">
              <Award className="w-4 h-4 text-[#B8860B]" />
              <span>Catálogo de Produtos</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#2C1E14] mt-1 flex items-center gap-2">
              Mais Vendidos de Ouro Preto
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Seleção artesanal dos produtos mais desejados com estrutura de dados idêntica ao catálogo Amazon.
            </p>
          </div>

          <button
            onClick={() => setShowJsonModal(true)}
            className="self-start sm:self-auto flex items-center gap-2 bg-[#70360D] hover:bg-[#5a2b0a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <FileJson className="w-4 h-4 text-[#B8860B]" />
            <span>Ver Array JSON ({filteredProducts.length})</span>
          </button>
        </div>

        {/* PRICE RANGE FILTER SLIDER BAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E0D8] shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Slider Title & Active Budget Readout */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] flex items-center justify-center text-[#70360D] shrink-0">
                <SlidersHorizontal className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#70360D]">
                    Filtrar por Orçamento
                  </span>
                  {isFilterActive && (
                    <span className="bg-amber-100 text-[#70360D] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                      Filtro Ativo
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xs text-stone-500">Valor máximo:</span>
                  <span className="text-base font-serif font-black text-[#2C1E14]">
                    R$ {selectedMaxPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>

            {/* Slider Control & Range Inputs */}
            <div className="flex-1 max-w-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>R$ 0,00</span>
                <span className="font-bold text-[#70360D] bg-[#FAF8F5] px-2.5 py-0.5 rounded-md border border-[#E5DDD0]">
                  Até R$ {selectedMaxPrice.toFixed(0)}
                </span>
                <span>R$ {calculatedMax.toFixed(0)}</span>
              </div>

              <div className="relative flex items-center">
                <input
                  type="range"
                  min="30"
                  max={calculatedMax}
                  step="5"
                  value={selectedMaxPrice}
                  onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#E8E1D5] rounded-lg appearance-none cursor-pointer accent-[#C59B27] focus:outline-none focus:ring-2 focus:ring-[#C59B27]/50"
                  aria-label="Filtro de preço máximo"
                />
              </div>

              {/* Quick Budget Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-stone-500 font-medium mr-1 hidden sm:inline">
                  Atalhos:
                </span>
                {[
                  { label: 'Todos', max: calculatedMax },
                  { label: 'Até R$ 50', max: 50 },
                  { label: 'Até R$ 180', max: 180 },
                  { label: 'Até R$ 260', max: 260 },
                  { label: 'Até R$ 400', max: 400 },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMaxPrice(chip.max)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                      selectedMaxPrice === chip.max
                        ? 'bg-[#2C1E14] text-[#E8C547] shadow-xs'
                        : 'bg-[#FAF8F5] hover:bg-[#EFE9DF] text-[#5A493D] border border-[#E5DDD0]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}

                {isFilterActive && (
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="ml-auto text-xs font-semibold text-[#8B2500] hover:text-[#5a1800] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Redefinir</span>
                  </button>
                )}
              </div>
            </div>

            {/* Results Count Badge */}
            <div className="lg:border-l lg:border-stone-200 lg:pl-5 flex lg:flex-col items-center lg:items-end justify-between text-right">
              <span className="text-[11px] text-stone-500">Exibindo</span>
              <span className="text-xs font-bold text-[#70360D]">
                {filteredProducts.length} de {products.length} artefatos
              </span>
            </div>

          </div>
        </div>

        {/* Products Grid - Bento Card Theme */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod, index) => {
              const priceFormatted = prod.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              const origPriceFormatted = prod.preco_original
                ? prod.preco_original.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : null;

              return (
                <div
                  key={prod.id}
                  className="group flex flex-col justify-between bg-white rounded-xl border border-[#E5E0D8] p-4 shadow-sm hover:shadow-md transition-all duration-300 relative"
                >
                  {/* Ranking Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-[#1a130f] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                    <span className="text-[#B8860B] font-extrabold">#{index + 1}</span>
                    <span>Mais Vendido</span>
                  </div>

                  {/* Discount Badge */}
                  {prod.desconto_percentual && (
                    <div className="absolute top-3 right-3 z-10 bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded">
                      -{prod.desconto_percentual}%
                    </div>
                  )}

                  {/* Product Image with Parallax & Baroque Gallery Lighting */}
                  <div className="mb-3">
                    <ParallaxGalleryImage
                      src={prod.imagem_url}
                      alt={prod.titulo}
                      heightClass="h-44"
                      category={prod.categoria}
                      onClick={() => onSelectProduct(prod)}
                      showRotateBtn={true}
                      onRotateClick={(e) => handleCardSpin(e, prod.id)}
                      isRotating={rotatingCardId === prod.id}
                      galleryStyle="colonial_pedestal"
                      intensity={1.1}
                    />
                  </div>

                  {/* Category & Badge */}
                  <div className="mb-1 flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider truncate">
                      {prod.categoria}
                    </span>
                    {prod.estoque <= 5 && (
                      <span className="shrink-0 flex items-center gap-0.5 text-[9px] font-black bg-red-100 text-red-700 px-1.5 py-0.2 rounded border border-red-200">
                        <Flame className="w-2.5 h-2.5 text-red-600 fill-current" />
                        {prod.estoque} no ateliê
                      </span>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3
                    onClick={() => onSelectProduct(prod)}
                    className="font-bold text-xs text-[#2C1E14] hover:text-[#B8860B] cursor-pointer line-clamp-2 leading-snug mb-2"
                    title={prod.titulo}
                  >
                    {prod.titulo}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs mb-2">
                    <div className="flex text-[#B8860B]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(prod.nota_avaliacao) ? 'fill-[#B8860B]' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-[#2C1E14] text-xs">{prod.nota_avaliacao}</span>
                    <span className="text-stone-400 text-[11px]">({prod.quantidade_reviews})</span>
                  </div>

                  {/* Visual Certification Badges (IPHAN, Orgânico, IG Mineira) */}
                  <ProductBadges certifications={prod.certificacoes} variant="compact" className="mb-2.5" />

                  {/* Price & Artisan */}
                  <div className="pt-2 border-t border-gray-100 mt-auto">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-lg font-bold text-[#2C1E14]">{priceFormatted}</span>
                      {origPriceFormatted && (
                        <span className="text-xs text-stone-400 line-through">{origPriceFormatted}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mb-3 truncate">
                      Por <strong className="text-stone-700">{prod.artesao}</strong> ({prod.cidade})
                    </p>

                    {/* Admin Quick Edit Button */}
                    {onEditProduct && (isAdminLogged || sessionStorage.getItem('ouro_admin_logged') === 'true') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct(prod);
                        }}
                        className="w-full mb-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 py-1 rounded-md text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-amber-800" />
                        <span>Editar (Admin)</span>
                      </button>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="w-full bg-[#F5F2ED] hover:bg-stone-200 text-[#2C1E14] border border-[#E5E0D8] py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Detalhes</span>
                        <ArrowRight className="w-3 h-3 text-[#B8860B]" />
                      </button>
                      <button
                        onClick={() => onAddToCart(prod, 1, false)}
                        className="w-full bg-[#B8860B] hover:bg-[#a67c0a] text-white py-1.5 rounded-md text-xs font-medium shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Comprar</span>
                      </button>
                    </div>

                    {/* Print Datasheet Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDatasheetProduct(prod);
                      }}
                      className="w-full bg-white hover:bg-[#FAF8F5] text-[#70360D] hover:text-[#B8860B] border border-[#E5DDD0] py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Imprimir Ficha Técnica e Certificado"
                    >
                      <Printer className="w-3 h-3 text-[#B8860B]" />
                      <span>Imprimir Ficha Técnica</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* NO PRODUCTS IN THIS PRICE RANGE EMPTY STATE */
          <div className="bg-white rounded-2xl p-8 border border-[#E5E0D8] text-center max-w-lg mx-auto space-y-3">
            <SearchX className="w-10 h-10 text-[#C59B27] mx-auto opacity-70" />
            <h3 className="font-serif text-base font-bold text-[#2C1E14]">
              Nenhum produto até R$ {selectedMaxPrice.toFixed(2).replace('.', ',')}
            </h3>
            <p className="text-xs text-stone-600">
              Não encontramos artefatos catalogados nesta faixa de orçamento. Deslize o slider para a direita para visualizar mais opções do acervo.
            </p>
            <button
              type="button"
              onClick={handleResetFilter}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#2C1E14] hover:bg-[#3D2B1E] text-[#E8C547] text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ver Todos os Preços (Até R$ {calculatedMax.toFixed(0)})</span>
            </button>
          </div>
        )}

        {/* JSON INSPECTOR MODAL FOR PROMPT 2 */}
        {showJsonModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <div className="bg-[#1a130f] text-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-white/20">
              {/* Modal Header */}
              <div className="p-4 bg-[#261B15] rounded-t-2xl border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-[#B8860B]" />
                  <h3 className="font-extrabold text-base text-white">
                    Estrutura de Dados em JSON ({filteredProducts.length} Produtos Filtrados)
                  </h3>
                </div>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="text-white/60 hover:text-white text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 cursor-pointer"
                >
                  ✕ Fechar
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-stone-200 bg-[#120D0A]">
                <div className="mb-3 text-[#B8860B] text-[11px] font-sans bg-[#B8860B]/10 p-2.5 rounded border border-[#B8860B]/30">
                  📌 <strong>Estrutura de Dados em JSON:</strong> Array JSON com produtos filtrados por faixa de preço contendo a estrutura oficial: <code>id</code>, <code>titulo</code>, <code>preco</code>, <code>nota_avaliacao</code>, <code>quantidade_reviews</code> e <code>selo_destaque</code>.
                </div>
                <pre className="whitespace-pre-wrap break-all p-4 bg-black/60 rounded-xl text-emerald-300">
                  {rawJsonString}
                </pre>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#261B15] rounded-b-2xl border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/60">Validação JSON: 100% Válido</span>
                <button
                  onClick={handleCopyJson}
                  className="bg-[#B8860B] hover:bg-[#a67c0a] text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedJson ? 'JSON Copiado!' : 'Copiar Array em JSON'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Technical Datasheet & Certificate Modal */}
        {datasheetProduct && (
          <ProductDatasheetModal
            product={datasheetProduct}
            isOpen={!!datasheetProduct}
            onClose={() => setDatasheetProduct(null)}
          />
        )}
      </div>
    </section>
  );
};

