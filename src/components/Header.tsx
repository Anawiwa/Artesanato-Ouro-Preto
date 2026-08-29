import React, { useState } from 'react';
import { ShoppingCart, MapPin, ChevronDown, Award, Sparkles, Code, FileJson, Feather, ShieldCheck, Package } from 'lucide-react';
import { ActiveTab, Product } from '../types';
import { BEST_SELLERS_PRODUCTS } from '../data/ouroPretoData';
import { PredictiveSearch } from './PredictiveSearch';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenOrders: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenOrders,
  activeTab,
  onTabChange,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  products = BEST_SELLERS_PRODUCTS,
  onSelectProduct,
}) => {
  const [cep, setCep] = useState('35400-000');
  const [isEditingCep, setIsEditingCep] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#1a130f] text-white shadow-md font-sans border-b border-[#3A2D23]">
      {/* Top Banner Notice */}
      <div className="bg-[#120D0A] border-b border-white/10 px-4 py-1.5 text-xs text-[#B8860B] flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#B8860B]" />
          <span>
            <strong>Mercado Colonial de Ouro Preto</strong> — Curadoria Oficial de Artesanatos em Pedra-Sabão, Doces Centenários e Arte Barroca.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-stone-300 text-xs">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-[#B8860B] hover:text-amber-300 font-bold bg-[#B8860B]/10 hover:bg-[#B8860B]/20 px-2.5 py-0.5 rounded border border-[#B8860B]/30 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Área Admin</span>
          </button>
          <span className="flex items-center gap-1"><Award className="w-3 h-3 text-[#B8860B]" /> Selo IPHAN</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row items-center gap-3 md:gap-6">
        {/* Brand Logo - Bento Grid Theme Style */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <button 
            onClick={() => onTabChange('all')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="text-xl font-bold tracking-tighter italic font-serif text-[#B8860B] group-hover:text-[#d49e17] transition-colors">
              Ouro Preto Artesanal
            </div>
          </button>

          {/* Action Icons Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenOrders}
              className="p-1.5 text-stone-200 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-1 text-xs font-bold"
              aria-label="Meus Pedidos e Rastreio"
              title="Meus Pedidos"
            >
              <Package className="w-5 h-5 text-[#E8C547]" />
            </button>
            <button
              onClick={onOpenAdmin}
              className="p-1.5 text-[#B8860B] hover:bg-white/10 rounded-lg flex items-center gap-1 text-xs font-bold"
              aria-label="Painel de Administração"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-[#B8860B]"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B8860B] text-[#1a130f] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Deliver To CEP Selector */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-300 hover:border hover:border-white/20 rounded-md p-1.5 cursor-pointer">
          <MapPin className="w-4 h-4 text-[#B8860B] shrink-0" />
          <div>
            <span className="text-stone-400 text-[10px] block">Enviar para</span>
            {isEditingCep ? (
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={() => setIsEditingCep(false)}
                className="w-24 bg-white/20 text-white text-xs rounded px-1 outline-none"
                autoFocus
              />
            ) : (
              <strong className="font-bold flex items-center gap-0.5 text-white" onClick={() => setIsEditingCep(true)}>
                Ouro Preto {cep} <ChevronDown className="w-3 h-3" />
              </strong>
            )}
          </div>
        </div>

        {/* Predictive Autocomplete Search Bar */}
        <div className="flex-1 w-full flex items-center z-30">
          <PredictiveSearch
            products={products}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            onSelectProduct={onSelectProduct}
          />
        </div>

        {/* Cart & Actions Desktop */}
        <div className="hidden md:flex items-center gap-3 text-xs tracking-widest font-medium">
          {/* My Orders Button */}
          <button
            onClick={onOpenOrders}
            className="flex items-center gap-2 text-stone-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/15 transition-all cursor-pointer"
            title="Ver meus pedidos e rastreio de artesanato"
          >
            <Package className="w-4 h-4 text-[#E8C547]" />
            <div className="text-left leading-tight">
              <span className="text-[9px] text-stone-400 block uppercase font-bold">Olá, Mariana</span>
              <span className="font-bold text-white text-xs">Meus Pedidos</span>
            </div>
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-[#B8860B] hover:text-amber-300 font-bold bg-[#B8860B]/10 hover:bg-[#B8860B]/20 px-3 py-1.5 rounded-lg border border-[#B8860B]/30 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 text-white hover:text-[#B8860B] transition-colors cursor-pointer uppercase bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <ShoppingCart className="w-4 h-4 text-[#B8860B]" />
            <span>Carrinho ({cartCount})</span>
          </button>
        </div>
      </div>

      {/* Category Links & Prompt Navigation Subheader */}
      <div className="bg-[#261B15] border-t border-white/10 px-6 py-2 text-xs overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-max">
          <div className="flex items-center gap-5 text-stone-300">
            <button
              onClick={() => onCategoryChange('Todas')}
              className={`hover:text-[#B8860B] transition-colors ${selectedCategory === 'Todas' ? 'text-[#B8860B] font-bold border-b-2 border-[#B8860B] pb-0.5' : ''}`}
            >
              Todos os Produtos
            </button>
            <button
              onClick={() => onCategoryChange('Panela de Pedra-Sabão')}
              className={`hover:text-[#B8860B] transition-colors ${selectedCategory === 'Panela de Pedra-Sabão' ? 'text-[#B8860B] font-bold border-b-2 border-[#B8860B] pb-0.5' : ''}`}
            >
              Panelas de Pedra-Sabão
            </button>
            <button
              onClick={() => onCategoryChange('Doces Tradicionais')}
              className={`hover:text-[#B8860B] transition-colors ${selectedCategory === 'Doces Tradicionais' ? 'text-[#B8860B] font-bold border-b-2 border-[#B8860B] pb-0.5' : ''}`}
            >
              Doces em Tacho de Cobre
            </button>
            <button
              onClick={() => onCategoryChange('Esculturas & Arte Barroca')}
              className={`hover:text-[#B8860B] transition-colors ${selectedCategory === 'Esculturas & Arte Barroca' ? 'text-[#B8860B] font-bold border-b-2 border-[#B8860B] pb-0.5' : ''}`}
            >
              Arte Barroca & Esculturas
            </button>
          </div>

          {/* Direct Solution Jump Buttons */}
          <div className="flex items-center gap-2 pl-4 border-l border-white/20">
            <span className="text-stone-400 text-[10px] uppercase tracking-wider hidden sm:inline">Navegação:</span>
            <button
              onClick={() => onTabChange('prompt1')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'prompt1' ? 'bg-[#B8860B] text-white font-bold shadow' : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Caixa de Compra</span>
            </button>
            <button
              onClick={() => onTabChange('prompt2')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'prompt2' ? 'bg-[#B8860B] text-white font-bold shadow' : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Mais Vendidos</span>
            </button>
            <button
              onClick={() => onTabChange('prompt3')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'prompt3' ? 'bg-[#B8860B] text-white font-bold shadow' : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Descrição & SEO</span>
            </button>
            <button
              onClick={onOpenOrders}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-black bg-[#E8C547] text-[#2C1E14] hover:bg-[#d9b634] shadow transition-all cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Meus Pedidos & Rastreio</span>
            </button>
            <a
              href="#newsletter-estrada-real"
              onClick={(e) => {
                if (activeTab !== 'all') {
                  onTabChange('all');
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-[#8B2500]/30 text-amber-200 hover:bg-[#8B2500]/50 border border-[#C59B27]/40 transition-all cursor-pointer"
            >
              <span>💌 Notas da Estrada Real</span>
            </a>
            <a
              href="#secao-frete-colonial"
              onClick={(e) => {
                if (activeTab !== 'all') {
                  onTabChange('all');
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-[#C59B27]/20 text-[#E8C547] hover:bg-[#C59B27]/30 border border-[#C59B27]/40 transition-all cursor-pointer"
            >
              <span>🚚 Logística Colonial</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
