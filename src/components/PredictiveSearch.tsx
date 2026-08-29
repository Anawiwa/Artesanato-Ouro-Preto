import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  User,
  ShoppingBag,
  Layers,
  Star,
  MapPin,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Product } from '../types';

interface PredictiveSearchProps {
  products: Product[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSelectProduct?: (product: Product) => void;
  onClose?: () => void;
}

interface ArtisanSuggestion {
  name: string;
  atelie: string;
  cidade: string;
  productCount: number;
  sampleProduct: Product;
}

interface CategorySuggestion {
  name: string;
  count: number;
  sampleImage?: string;
}

const TRENDING_SEARCHES = [
  'Panela de Pedra-Sabão 3L',
  'Doce de Leite com Nozes',
  'Mestre Aleijadinho',
  'Tacho de Cobre Puro',
  'Queijo Canastra Curado',
  'Xícaras Barrocas',
];

export const PredictiveSearch: React.FC<PredictiveSearchProps> = ({
  products,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onSelectProduct,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute suggestions based on query
  const query = searchQuery.trim().toLowerCase();

  // 1. Filtered Products
  const matchedProducts = useMemo(() => {
    if (!query) return products.slice(0, 3); // top 3 if query empty
    return products
      .filter((p) => {
        const inTitle = p.titulo.toLowerCase().includes(query);
        const inSubtitle = p.subtitulo?.toLowerCase().includes(query);
        const inCategory = p.categoria.toLowerCase().includes(query);
        const inArtisan = p.artesao.toLowerCase().includes(query);
        const inAtelie = p.atelie?.toLowerCase().includes(query);
        return inTitle || inSubtitle || inCategory || inArtisan || inAtelie;
      })
      .slice(0, 5);
  }, [products, query]);

  // 2. Filtered Artisans
  const matchedArtisans = useMemo(() => {
    const map = new Map<string, ArtisanSuggestion>();
    products.forEach((p) => {
      if (p.artesao) {
        const key = p.artesao.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            name: p.artesao,
            atelie: p.atelie || 'Ateliê Colonial',
            cidade: p.cidade || 'Ouro Preto - MG',
            productCount: 1,
            sampleProduct: p,
          });
        } else {
          const item = map.get(key)!;
          item.productCount += 1;
        }
      }
    });

    const allArtisans = Array.from(map.values());
    if (!query) return allArtisans.slice(0, 3);

    return allArtisans
      .filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.atelie.toLowerCase().includes(query) ||
          a.cidade.toLowerCase().includes(query)
      )
      .slice(0, 3);
  }, [products, query]);

  // 3. Filtered Categories
  const matchedCategories = useMemo(() => {
    const catMap = new Map<string, { count: number; sampleImage?: string }>();
    products.forEach((p) => {
      const cat = p.categoria;
      if (!catMap.has(cat)) {
        catMap.set(cat, { count: 1, sampleImage: p.imagem_url });
      } else {
        catMap.get(cat)!.count += 1;
      }
    });

    const allCats: CategorySuggestion[] = Array.from(catMap.entries()).map(
      ([name, data]) => ({
        name,
        count: data.count,
        sampleImage: data.sampleImage,
      })
    );

    if (!query) return allCats.slice(0, 4);

    return allCats
      .filter((c) => c.name.toLowerCase().includes(query))
      .slice(0, 4);
  }, [products, query]);

  // Total selectable items for keyboard navigation
  const flatItems = useMemo(() => {
    const items: Array<{
      type: 'product' | 'artisan' | 'category' | 'trending';
      data: any;
    }> = [];
    if (!query) {
      TRENDING_SEARCHES.slice(0, 3).forEach((t) =>
        items.push({ type: 'trending', data: t })
      );
    }
    matchedProducts.forEach((p) => items.push({ type: 'product', data: p }));
    matchedArtisans.forEach((a) => items.push({ type: 'artisan', data: a }));
    matchedCategories.forEach((c) => items.push({ type: 'category', data: c }));
    return items;
  }, [query, matchedProducts, matchedArtisans, matchedCategories]);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < flatItems.length) {
        e.preventDefault();
        const selected = flatItems[selectedIndex];
        handleSelectItem(selected);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelectItem = (item: {
    type: 'product' | 'artisan' | 'category' | 'trending';
    data: any;
  }) => {
    if (item.type === 'product') {
      const product = item.data as Product;
      onSearchChange(product.titulo);
      if (onSelectProduct) {
        onSelectProduct(product);
      }
      setIsOpen(false);
    } else if (item.type === 'artisan') {
      const artisan = item.data as ArtisanSuggestion;
      onSearchChange(artisan.name);
      setIsOpen(false);
    } else if (item.type === 'category') {
      const category = item.data as CategorySuggestion;
      onCategoryChange(category.name);
      onSearchChange('');
      setIsOpen(false);
    } else if (item.type === 'trending') {
      onSearchChange(item.data);
      setIsOpen(false);
    }
  };

  // Helper to highlight matching text query
  const highlightMatch = (text: string, queryStr: string) => {
    if (!queryStr) return text;
    const parts = text.split(new RegExp(`(${queryStr})`, 'gi'));
    return parts.map((part, idx) =>
      part.toLowerCase() === queryStr.toLowerCase() ? (
        <span
          key={idx}
          className="bg-amber-100 text-[#70360D] font-black rounded-xs px-0.5"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <div className="relative w-full flex bg-white rounded-md overflow-hidden shadow-inner border border-transparent focus-within:border-[#C59B27] focus-within:ring-2 focus-within:ring-[#C59B27]/40 transition-all">
        {/* Category Selector Prefix */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-[#2C1E14] text-white text-xs px-3 py-2 border-r border-white/10 outline-none cursor-pointer hidden sm:block max-w-[150px] truncate hover:bg-[#3D2B1E] transition-colors"
          title="Filtrar por Categoria"
        >
          <option value="Todas">Todas Categorias</option>
          <option value="Panela de Pedra-Sabão">Pedra-Sabão</option>
          <option value="Doces Tradicionais">Doces Mineiros</option>
          <option value="Esculturas & Arte Barroca">Esculturas Barrocas</option>
          <option value="Utensílios & Cerâmica">Cerâmica Colonial</option>
          <option value="Queijos & Laticínios Nobres">Queijos & Laticínios</option>
          <option value="Utensílios de Cobre">Utensílios de Cobre</option>
        </select>

        {/* Search Input */}
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar por produto, mestre artesão ou categoria..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white text-[#2C1E14] text-sm px-4 py-2 pr-9 outline-none placeholder:text-[#9E9287]"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={isOpen}
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              className="absolute right-2 p-1 text-[#8A796C] hover:text-[#2C1E14] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Submit Search Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="bg-[#C59B27] hover:bg-[#b38a1f] text-[#1A1810] px-5 py-2 font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
          aria-label="Buscar"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Autocomplete Predictive Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#FAF8F5] text-[#2C1E14] rounded-xl shadow-2xl border-2 border-[#C59B27]/60 overflow-hidden z-50 animate-in fade-in-0 duration-150 max-h-[80vh] overflow-y-auto">
          {/* Header Bar of Dropdown */}
          <div className="bg-[#241710] text-[#E8C547] px-4 py-2 text-xs font-serif font-bold flex items-center justify-between border-b border-[#C59B27]/40">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E8C547]" />
              <span>
                {query
                  ? `Sugestões para "${searchQuery}"`
                  : 'Busca Preditiva • Mercado Colonial'}
              </span>
            </div>
            <span className="text-[10px] text-[#D0C4B4] font-sans font-normal hidden sm:inline">
              Use ↑ ↓ para navegar e Enter para escolher
            </span>
          </div>

          <div className="p-3 space-y-4">
            {/* INITIAL / NO QUERY STATE: TRENDING SEARCHES */}
            {!query && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#70360D] uppercase tracking-wider mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Mais Buscados em Ouro Preto</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onSearchChange(item);
                        setIsOpen(false);
                      }}
                      className="px-2.5 py-1 text-xs bg-white hover:bg-[#EFE9DF] text-[#4A3B30] hover:text-[#70360D] rounded-lg border border-[#D8CFC2] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Search className="w-3 h-3 text-[#C59B27]" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 1: SUGGESTED PRODUCTS */}
            {matchedProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#70360D] uppercase tracking-wider mb-2 pb-1 border-b border-[#E5DDD0]">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Artefatos & Produtos ({matchedProducts.length})</span>
                  </div>
                  <span className="text-[10px] text-[#8A796C] font-normal lowercase">
                    clique para ver detalhes
                  </span>
                </div>

                <div className="space-y-1.5">
                  {matchedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(prod);
                        onSearchChange(prod.titulo);
                        setIsOpen(false);
                      }}
                      className="group flex items-center justify-between p-2 rounded-lg bg-white hover:bg-[#F3EDE2] border border-[#E5E0D8] hover:border-[#C59B27] transition-all cursor-pointer shadow-2xs"
                    >
                      {/* Thumbnail & Product Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-md bg-[#FAF8F5] border border-[#E5DDD0] shrink-0 overflow-hidden flex items-center justify-center p-1">
                          <img
                            src={prod.imagem_url}
                            alt={prod.titulo}
                            referrerPolicy="no-referrer"
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#2C1E14] group-hover:text-[#70360D] truncate leading-tight">
                            {highlightMatch(prod.titulo, searchQuery)}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#7A6B5E]">
                            <span className="truncate">{prod.artesao}</span>
                            <span>•</span>
                            <span className="text-[#C59B27] font-semibold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-[#C59B27]" />
                              {prod.nota_avaliacao}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="text-right shrink-0 pl-3">
                        <span className="text-xs font-black text-[#70360D] block font-serif">
                          R$ {prod.preco.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-[10px] text-[#3D7A48] font-bold">
                          {prod.estoque > 0 ? 'Em Estoque' : 'Sob Encomenda'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: SUGGESTED ARTISANS & WORKSHOPS */}
            {matchedArtisans.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#70360D] uppercase tracking-wider mb-2 pb-1 border-b border-[#E5DDD0]">
                  <User className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Mestres Artesãos & Ateliês ({matchedArtisans.length})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {matchedArtisans.map((artisan, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onSearchChange(artisan.name);
                        setIsOpen(false);
                      }}
                      className="text-left p-2.5 rounded-lg bg-white hover:bg-[#F3EDE2] border border-[#E5E0D8] hover:border-[#C59B27] transition-all cursor-pointer flex flex-col justify-between shadow-2xs group"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#2C1E14] text-[#E8C547] flex items-center justify-center shrink-0 text-xs font-serif font-bold">
                          {artisan.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-[#2C1E14] group-hover:text-[#70360D] truncate leading-tight">
                            {highlightMatch(artisan.name, searchQuery)}
                          </h5>
                          <span className="text-[10px] text-[#7A6B5E] truncate block mt-0.5">
                            {artisan.atelie}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-[#F0EAE1] flex items-center justify-between text-[10px] text-[#8A796C]">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-[#C59B27]" />
                          {artisan.cidade.split('-')[0]}
                        </span>
                        <span className="font-bold text-[#70360D]">
                          {artisan.productCount} {artisan.productCount === 1 ? 'peça' : 'peças'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: SUGGESTED CATEGORIES */}
            {matchedCategories.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#70360D] uppercase tracking-wider mb-2 pb-1 border-b border-[#E5DDD0]">
                  <Layers className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Categorias Tradicionais</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {matchedCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onCategoryChange(cat.name);
                        onSearchChange('');
                        setIsOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#2C1E14] text-[#3D2E24] hover:text-[#E8C547] border border-[#D8CFC2] hover:border-[#2C1E14] transition-all text-xs font-medium flex items-center gap-2 cursor-pointer shadow-2xs group"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#C59B27] group-hover:bg-[#E8C547]" />
                      <span>{highlightMatch(cat.name, searchQuery)}</span>
                      <span className="text-[10px] bg-stone-100 group-hover:bg-white/20 px-1.5 py-0.2 rounded text-[#7A6B5E] group-hover:text-amber-200">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* NO RESULTS AT ALL */}
            {query &&
              matchedProducts.length === 0 &&
              matchedArtisans.length === 0 &&
              matchedCategories.length === 0 && (
                <div className="text-center py-6 px-4 bg-white rounded-xl border border-[#E5E0D8]">
                  <Search className="w-8 h-8 text-[#C59B27] mx-auto mb-2 opacity-60" />
                  <h4 className="text-sm font-bold text-[#2C1E14]">
                    Nenhum artefato encontrado para "{searchQuery}"
                  </h4>
                  <p className="text-xs text-[#7A6B5E] mt-1 max-w-md mx-auto">
                    Tente buscar por termos como <span className="font-semibold text-[#70360D]">pedra-sabão</span>, <span className="font-semibold text-[#70360D]">doce de leite</span>, <span className="font-semibold text-[#70360D]">aleijadinho</span>, ou escolha uma das categorias no topo.
                  </p>
                </div>
              )}
          </div>

          {/* Footer Action of Dropdown */}
          <div className="bg-[#EFE9DF] px-4 py-2.5 border-t border-[#D5CCC0] flex items-center justify-between text-xs">
            <span className="text-[#6B5A4E]">
              {products.length} artefatos catalogados no Ateliê Ouro Preto
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-bold text-[#70360D] hover:text-[#C59B27] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Ver resultados na página</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
