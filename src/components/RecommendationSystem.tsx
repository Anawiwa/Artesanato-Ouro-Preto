import React from 'react';
import { Sparkles, ShoppingCart, Plus, Check, Star, Zap, Flame, Compass, PackagePlus } from 'lucide-react';
import { Product } from '../types';
import { ParallaxGalleryImage } from './ParallaxGalleryImage';
import { ProductBadges } from './ProductBadges';

interface RecommendationSystemProps {
  currentProduct?: Product;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, giftWrap: boolean) => void;
  onAddMultipleToCart?: (products: Product[]) => void;
}

export const RecommendationSystem: React.FC<RecommendationSystemProps> = ({
  currentProduct,
  allProducts,
  onSelectProduct,
  onAddToCart,
  onAddMultipleToCart,
}) => {
  if (!allProducts || allProducts.length === 0) return null;

  const targetProduct = currentProduct || allProducts[0];

  // 1. "Comprados Juntos Frequentemente" (Amazon Frequently Bought Together / Bundle)
  // Pick 2 complementary items (different from target)
  const bundleCandidates = allProducts.filter(p => p.id !== targetProduct.id);
  const bundleItems = bundleCandidates.slice(0, 2);
  const fullBundle = [targetProduct, ...bundleItems];
  const bundleTotalPrice = fullBundle.reduce((acc, item) => acc + item.preco, 0);
  const bundleOriginalPrice = fullBundle.reduce((acc, item) => acc + (item.preco_original || item.preco * 1.15), 0);
  const bundleSavings = bundleOriginalPrice - bundleTotalPrice;

  // 2. "Quem viu este produto também comprou" (Customers Also Bought)
  const relatedSameCategory = allProducts.filter(
    p => p.id !== targetProduct.id && p.categoria === targetProduct.categoria
  );
  const otherCategoryItems = allProducts.filter(
    p => p.id !== targetProduct.id && p.categoria !== targetProduct.categoria
  );
  const customersAlsoBought = [...relatedSameCategory, ...otherCategoryItems].slice(0, 4);

  // 3. "Produtos similares e Comparativo" (Similar items & comparison)
  const similarItems = allProducts.filter(p => p.id !== targetProduct.id).slice(0, 3);

  // 4. "Tendências em Ouro Preto / Inspirados em suas visitas" (Trending & Inspired by browsing)
  const trendingItems = [...allProducts]
    .sort((a, b) => (b.quantidade_reviews || 0) - (a.quantidade_reviews || 0))
    .filter(p => p.id !== targetProduct.id)
    .slice(0, 4);

  const handleAddBundleToCart = () => {
    if (onAddMultipleToCart) {
      onAddMultipleToCart(fullBundle);
    } else {
      fullBundle.forEach(item => onAddToCart(item, 1, false));
    }
  };

  return (
    <section className="space-y-8 font-sans text-[#2C1E14]">
      {/* ------------------------------------------------------------- */}
      {/* MODULE 1: COMPRADOS JUNTOS FREQUENTEMENTE (AMAZON / ML BUNDLE) */}
      {/* ------------------------------------------------------------- */}
      {bundleItems.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E0D8] shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
            <PackagePlus className="w-5 h-5 text-[#B8860B]" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#2C1E14]">
              Comprados juntos frequentemente
            </h3>
            <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full ml-auto">
              Economize R$ {bundleSavings.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Items display with "+" signs */}
            <div className="lg:col-span-8 flex flex-wrap items-center gap-3 sm:gap-4 justify-center sm:justify-start">
              {fullBundle.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {idx > 0 && (
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold shrink-0">
                      <Plus className="w-4 h-4" />
                    </div>
                  )}

                  <div 
                    onClick={() => onSelectProduct(item)}
                    className={`flex flex-col items-center bg-[#FAF7F2] p-3 rounded-xl border transition-all cursor-pointer w-36 sm:w-44 text-center group ${
                      item.id === targetProduct.id ? 'border-[#B8860B]/60 ring-2 ring-[#B8860B]/20' : 'border-[#E5E0D8] hover:border-[#B8860B]'
                    }`}
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 mb-2">
                      <ParallaxGalleryImage
                        src={item.imagem_url}
                        alt={item.titulo}
                        heightClass="h-24 sm:h-28"
                        badge={item.id === targetProduct.id ? 'Este item' : undefined}
                        intensity={0.8}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#2C1E14] line-clamp-2 leading-tight group-hover:text-[#B8860B]">
                      {item.titulo}
                    </span>
                    <span className="text-xs font-black text-[#70360D] mt-1.5">
                      R$ {item.preco.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Bundle Buy Action Box */}
            <div className="lg:col-span-4 bg-[#FDFBF7] p-4 sm:p-5 rounded-2xl border border-[#B8860B]/30 space-y-3">
              <div className="text-xs text-stone-600 space-y-1">
                <div className="flex justify-between">
                  <span>Preço Total dos 3 itens:</span>
                  <span className="text-stone-400 line-through">
                    R$ {bundleOriginalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-stone-200">
                  <span className="font-bold text-[#2C1E14] text-sm">Leve o Kit Junto por:</span>
                  <span className="text-lg font-black text-[#70360D]">
                    R$ {bundleTotalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ Frete Grátis Ouro Preto Express para o combo completo.
                </p>
              </div>

              <button
                onClick={handleAddBundleToCart}
                className="w-full py-3 bg-[#B8860B] hover:bg-[#a67c0a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Adicionar os 3 ao Carrinho</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODULE 2: QUEM VIU ESTE PRODUTO TAMBÉM COMPROU (ALGORITMO ML)  */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E0D8] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B8860B]" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#2C1E14]">
              Clientes que visualizaram este item também compraram
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Recomendações baseadas nas preferências de outros compradores
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {customersAlsoBought.map((prod) => (
            <div
              key={prod.id}
              className="flex flex-col justify-between bg-[#FAF7F2] rounded-xl border border-[#E5E0D8] p-3.5 hover:border-[#B8860B] hover:shadow-md transition-all group"
            >
              <div 
                onClick={() => onSelectProduct(prod)}
                className="cursor-pointer space-y-2.5"
              >
                <div className="w-full h-40 mb-1">
                  <ParallaxGalleryImage
                    src={prod.imagem_url}
                    alt={prod.titulo}
                    heightClass="h-40"
                    badge={prod.selo_destaque || undefined}
                    intensity={0.9}
                  />
                </div>

                <div>
                  <span className="text-[10px] text-[#B8860B] font-bold uppercase tracking-wider block">
                    {prod.categoria}
                  </span>
                  <h4 className="text-xs font-bold text-[#2C1E14] line-clamp-2 leading-tight group-hover:text-[#B8860B] transition-colors mt-0.5">
                    {prod.titulo}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex text-[#B8860B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#B8860B]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-stone-700">{prod.nota_avaliacao}</span>
                  <span className="text-[10px] text-stone-400">({prod.quantidade_reviews})</span>
                </div>

                <ProductBadges certifications={prod.certificacoes} variant="compact" maxDisplay={2} className="pt-1" />
              </div>

              <div className="pt-3 border-t border-stone-200/80 mt-2 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-black text-[#70360D] block">
                    R$ {prod.preco.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    Frete Grátis
                  </span>
                </div>

                <button
                  onClick={() => onAddToCart(prod, 1, false)}
                  className="p-2 bg-[#B8860B] hover:bg-[#a67c0a] text-white rounded-lg transition-all shadow-sm cursor-pointer"
                  title="Adicionar ao carrinho"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODULE 3: TABELA COMPARATIVA DE PRODUTOS SIMILARES (AMAZON)     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E0D8] shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
          <Compass className="w-5 h-5 text-[#B8860B]" />
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#2C1E14]">
            Compare com itens similares do artesanato mineiro
          </h3>
        </div>

        <div className="min-w-[600px]">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="p-3 bg-[#FAF7F2] font-bold text-stone-600 w-1/4">Atributo</th>
                <th className="p-3 bg-[#FAF7F2] font-bold text-[#70360D] w-1/4">
                  {targetProduct.titulo.slice(0, 30)}... (Atual)
                </th>
                {similarItems.map(item => (
                  <th key={item.id} className="p-3 bg-[#FAF7F2] font-bold text-stone-800 w-1/4">
                    {item.titulo.slice(0, 30)}...
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="p-3 font-semibold text-stone-600">Visualização</td>
                <td className="p-3">
                  <img src={targetProduct.imagem_url} alt="" className="w-14 h-14 object-cover rounded-lg border border-[#B8860B]/40" />
                </td>
                {similarItems.map(item => (
                  <td key={item.id} className="p-3">
                    <img src={item.imagem_url} alt="" className="w-14 h-14 object-cover rounded-lg border border-stone-200" />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-600">Preço Unitário</td>
                <td className="p-3 font-black text-[#70360D]">R$ {targetProduct.preco.toFixed(2).replace('.', ',')}</td>
                {similarItems.map(item => (
                  <td key={item.id} className="p-3 font-bold text-stone-700">R$ {item.preco.toFixed(2).replace('.', ',')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-600">Avaliação Média</td>
                <td className="p-3 font-bold text-[#B8860B]">★ {targetProduct.nota_avaliacao} ({targetProduct.quantidade_reviews})</td>
                {similarItems.map(item => (
                  <td key={item.id} className="p-3 font-medium text-stone-700">★ {item.nota_avaliacao} ({item.quantidade_reviews})</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-600">Mestre / Ateliê</td>
                <td className="p-3 font-bold text-stone-800">{targetProduct.artesao}</td>
                {similarItems.map(item => (
                  <td key={item.id} className="p-3 text-stone-600">{item.artesao}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-600">Certificações Oficiais</td>
                <td className="p-3">
                  <ProductBadges certifications={targetProduct.certificacoes} variant="compact" maxDisplay={2} />
                </td>
                {similarItems.map(item => (
                  <td key={item.id} className="p-3">
                    <ProductBadges certifications={item.certificacoes} variant="compact" maxDisplay={2} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-600">Autenticidade</td>
                <td className="p-3 text-emerald-700 font-bold">100% Homologado IPHAN/IG</td>
                {similarItems.map(item => (
                  <td key={item.id} className="p-3 text-emerald-700 font-medium">100% Homologado IPHAN/IG</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-600">Ação Rápida</td>
                <td className="p-3">
                  <button
                    onClick={() => onAddToCart(targetProduct, 1, false)}
                    className="px-3 py-1.5 bg-[#B8860B] hover:bg-[#a67c0a] text-white rounded-lg font-bold text-[11px] cursor-pointer"
                  >
                    Adicionar
                  </button>
                </td>
                {similarItems.map(item => (
                  <td key={item.id} className="p-3">
                    <button
                      onClick={() => onAddToCart(item, 1, false)}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      Adicionar
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODULE 4: MAIS VENDIDOS E TENDÊNCIAS EM ALTA (MERCADO LIVRE)   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E5E0D8]">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-[#C85A32]" />
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#2C1E14]">
            Mais Populares e Mais Vendidos da Semana
          </h3>
          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded ml-2">
            Alta Procura
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {trendingItems.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="bg-white rounded-xl p-3 border border-[#E5E0D8] hover:border-[#B8860B] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-28 sm:h-36 mb-2">
                  <ParallaxGalleryImage
                    src={prod.imagem_url}
                    alt={prod.titulo}
                    heightClass="h-28 sm:h-36"
                    intensity={0.75}
                  />
                </div>
                <h4 className="text-xs font-bold text-[#2C1E14] line-clamp-2 group-hover:text-[#B8860B] leading-tight">
                  {prod.titulo}
                </h4>
              </div>
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-black text-[#70360D]">
                  R$ {prod.preco.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-stone-500 font-semibold">
                  ★ {prod.nota_avaliacao}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
