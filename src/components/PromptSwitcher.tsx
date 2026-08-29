import React from 'react';
import { LayoutGrid, Code, FileJson, Feather, Palette } from 'lucide-react';
import { ActiveTab } from '../types';

interface PromptSwitcherProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const PromptSwitcher: React.FC<PromptSwitcherProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-[#F5F2ED] border-b border-[#E5E0D8] py-4 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B8860B]">
              <Palette className="w-4 h-4 text-[#B8860B]" />
              <span>Paleta Ouro Preto • Padrão Bento Grid</span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[#2C1E14] mt-0.5">
              Catálogo & Soluções Artesanais de Ouro Preto
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#2C1E14] bg-white px-3.5 py-1.5 rounded-lg border border-[#E5E0D8] shadow-sm">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#2E6B40] animate-ping" />
            <span>Sistema Inteligente Ativo</span>
          </div>
        </div>

        {/* Tab Buttons in Bento Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onTabChange('all')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#1a130f] text-white border-[#1a130f] shadow'
                : 'bg-white text-[#2C1E14] border-[#E5E0D8] hover:bg-[#FDFBF7]'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#B8860B]" />
            <span>Visão E-Commerce</span>
          </button>

          <button
            onClick={() => onTabChange('prompt1')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              activeTab === 'prompt1'
                ? 'bg-[#B8860B] text-white border-[#B8860B] shadow'
                : 'bg-white text-[#2C1E14] border-[#E5E0D8] hover:bg-[#FDFBF7]'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Caixa de Compra</span>
          </button>

          <button
            onClick={() => onTabChange('prompt2')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              activeTab === 'prompt2'
                ? 'bg-[#70360D] text-white border-[#70360D] shadow'
                : 'bg-white text-[#2C1E14] border-[#E5E0D8] hover:bg-[#FDFBF7]'
            }`}
          >
            <FileJson className="w-4 h-4 text-[#B8860B]" />
            <span>Mais Vendidos</span>
          </button>

          <button
            onClick={() => onTabChange('prompt3')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              activeTab === 'prompt3'
                ? 'bg-[#C85A32] text-white border-[#C85A32] shadow'
                : 'bg-white text-[#2C1E14] border-[#E5E0D8] hover:bg-[#FDFBF7]'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>Descrição & SEO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
