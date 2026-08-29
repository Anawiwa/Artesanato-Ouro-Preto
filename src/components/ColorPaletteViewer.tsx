import React from 'react';
import { Palette, Info } from 'lucide-react';
import { OURO_PRETO_PALETTE } from '../data/ouroPretoData';

export const ColorPaletteViewer: React.FC = () => {
  return (
    <div className="bg-[#1a130f] text-white py-8 px-6 font-sans border-t border-[#E5E0D8]/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#B8860B]" />
            <h3 className="text-base font-serif font-bold text-white">
              Paleta de Cores de Ouro Preto & Bento Design
            </h3>
          </div>
          <span className="text-xs text-[#B8860B] font-mono bg-[#B8860B]/10 px-2.5 py-1 rounded-full border border-[#B8860B]/30">
            Design Theme: Bento Grid
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {OURO_PRETO_PALETTE.map((color) => (
            <div
              key={color.name}
              className="bg-[#261B15] rounded-xl p-3 border border-white/10 flex flex-col justify-between space-y-2 shadow-sm"
            >
              <div
                className="w-full h-12 rounded-lg shadow-inner flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: color.hex, color: color.textColor }}
              >
                {color.hex}
              </div>
              <div>
                <strong className="block text-white font-bold">{color.name}</strong>
                <span className="text-[10px] text-[#B8860B] block font-semibold">{color.role}</span>
                <p className="text-[10px] text-white/60 leading-tight mt-1">{color.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
