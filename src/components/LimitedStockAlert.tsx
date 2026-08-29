import React, { useState, useEffect } from 'react';
import {
  Flame,
  AlertTriangle,
  Clock,
  Users,
  ShieldAlert,
  Sparkles,
  ShoppingBag,
  Info,
  Timer,
  CheckCircle2,
  Hammer,
  Zap,
  TrendingUp,
  RotateCw
} from 'lucide-react';
import { Product } from '../types';

interface LimitedStockAlertProps {
  product: Product;
  threshold?: number; // default 8
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  compact?: boolean;
  className?: string;
  showSimulateControls?: boolean;
}

export const LimitedStockAlert: React.FC<LimitedStockAlertProps> = ({
  product,
  threshold = 8,
  onAddToCart,
  onBuyNow,
  compact = false,
  className = '',
  showSimulateControls = false,
}) => {
  // Live viewers simulation that fluctuates realistically
  const [viewersCount, setViewersCount] = useState<number>(() => {
    return Math.floor(Math.random() * 8) + 9; // 9 to 16 viewers
  });

  // Recent purchase city
  const [recentBuyer, setRecentBuyer] = useState<{ city: string; timeAgo: string }>({
    city: 'Belo Horizonte - MG',
    timeAgo: 'há 14 minutos',
  });

  // Dynamic stock state (can be modified by simulation controls if enabled)
  const [simulatedStock, setSimulatedStock] = useState<number>(product.estoque);

  // Sync when product changes
  useEffect(() => {
    setSimulatedStock(product.estoque);
  }, [product.estoque, product.id]);

  // Subtle fluctuation for live engagement
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(6, Math.min(24, prev + delta));
      });
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const currentStock = simulatedStock;
  const isCriticalStock = currentStock <= 3 && currentStock > 0;
  const isLowStock = currentStock > 3 && currentStock <= threshold;
  const isSoldOut = currentStock === 0;

  // Don't render full warning if stock is abundant unless explicitly testing
  if (currentStock > threshold && !showSimulateControls) {
    return (
      <div className={`p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900 ${className}`}>
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B40] animate-pulse"></span>
          <span>
            <strong>Em Estoque no Ateliê</strong> ({currentStock} unidades disponíveis prontas para envio)
          </span>
        </div>
        <span className="text-[11px] text-emerald-700 font-bold">Despacho em 24h</span>
      </div>
    );
  }

  // Artisan production craft description based on category
  const isStone = product.titulo.toLowerCase().includes('pedra') || product.categoria.toLowerCase().includes('pedra');
  const isSweet = product.titulo.toLowerCase().includes('doce') || product.categoria.toLowerCase().includes('doce');
  const isCeramic = product.titulo.toLowerCase().includes('cerâmica') || product.titulo.toLowerCase().includes('xícara');
  const isSculpture = product.titulo.toLowerCase().includes('escultura') || product.titulo.toLowerCase().includes('arte');

  const craftTimeText = isStone
    ? 'Lapidação manual em esteatito leva de 4 a 6 dias por peça com cura em forno a lenha.'
    : isSweet
    ? 'Apurado lentamente por 6 horas em tacho de cobre. Lote colonial estritamente limitado.'
    : isCeramic
    ? 'Queima artesanal em forno a lenha a 1220°C. Próxima fornada prevista para o fim do mês.'
    : isSculpture
    ? 'Talhada individualmente em cinzel pelo mestre santeiro. Peça única numerada.'
    : 'Produção 100% manual em pequenas remessas no ateliê colonial.';

  // Percentage of artisan batch reserved
  const batchTotal = Math.max(15, currentStock + 12);
  const percentClaimed = Math.min(95, Math.round(((batchTotal - currentStock) / batchTotal) * 100));

  // =========================================================================
  // COMPACT INLINE VARIANT (For BuyBox stock line)
  // =========================================================================
  if (compact) {
    if (isSoldOut) {
      return (
        <div className={`p-3 rounded-xl bg-stone-100 border border-stone-300 text-stone-700 text-xs space-y-1 ${className}`}>
          <div className="flex items-center gap-1.5 font-black text-red-700">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Lote do Ateliê Esgotado Temporariamente</span>
          </div>
          <p className="text-[11px] text-stone-500">
            O artesão está produzindo a próxima remessa manual. Entre na lista de espera para ser avisado.
          </p>
        </div>
      );
    }

    return (
      <div
        id="limited-stock-alert-compact"
        className={`p-3 rounded-xl border transition-all ${
          isCriticalStock
            ? 'bg-gradient-to-r from-red-50 to-amber-50 border-red-300 text-red-900 shadow-sm ring-1 ring-red-400/30 animate-pulse'
            : 'bg-amber-50/90 border-amber-300 text-amber-950'
        } ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-black text-xs">
            <Flame className={`w-4 h-4 shrink-0 ${isCriticalStock ? 'text-red-600 fill-red-500 animate-bounce' : 'text-[#C85A32]'}`} />
            <span>
              {isCriticalStock
                ? `CORRA! Restam apenas ${currentStock} ${currentStock === 1 ? 'única peça' : 'peças'} no Ateliê!`
                : `Atenção: Apenas ${currentStock} unidades restantes neste lote`}
            </span>
          </div>

          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs text-[#70360D]">
            {percentClaimed}% Vendido
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="mt-2 space-y-1">
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ${
                isCriticalStock ? 'bg-red-600' : 'bg-[#C85A32]'
              }`}
              style={{ width: `${percentClaimed}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium pt-0.5">
            <span className="flex items-center gap-1 text-stone-600">
              <Users className="w-3 h-3 text-[#C59B27]" />
              <strong>{viewersCount} pessoas</strong> de olho agora
            </span>
            <span className="text-[#70360D] font-bold">Produção Feita à Mão</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL RICH VARIANT (For Product Page Hero / Urgency Section)
  // =========================================================================
  return (
    <div
      id="artisan-limited-stock-alert"
      className={`rounded-2xl border-2 overflow-hidden shadow-md transition-all font-sans ${
        isCriticalStock
          ? 'bg-[#FFF9F5] border-[#C85A32] ring-2 ring-[#C85A32]/20'
          : isLowStock
          ? 'bg-[#FDFBF7] border-[#C59B27]'
          : 'bg-white border-stone-200'
      } ${className}`}
    >
      {/* Alert Header Strip */}
      <div
        className={`px-4 py-2.5 text-white flex items-center justify-between text-xs font-black tracking-wide ${
          isCriticalStock
            ? 'bg-gradient-to-r from-[#C85A32] via-[#964B15] to-[#70360D]'
            : isLowStock
            ? 'bg-gradient-to-r from-[#70360D] to-[#964B15]'
            : 'bg-[#2D3033]'
        }`}
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#FFD700] fill-amber-400 animate-pulse" />
          <span className="uppercase">
            {isCriticalStock
              ? '🔥 ALERTA DE ÚLTIMAS PEÇAS DO ATELIÊ'
              : '⚠️ ESTOQUE LIMITADO DE PRODUÇÃO ARTESANAL'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-200 bg-black/25 px-2.5 py-0.5 rounded-full border border-white/20">
          <Hammer className="w-3 h-3 text-amber-300" />
          <span>Feito por {product.artesao.split(' ')[0] || 'Mestre Artesão'}</span>
        </div>
      </div>

      {/* Main Alert Content */}
      <div className="p-4 sm:p-5 space-y-4 text-[#2D3033]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xl sm:text-2xl font-black ${
                  isCriticalStock ? 'text-[#C85A32]' : 'text-[#70360D]'
                }`}
              >
                {currentStock === 1
                  ? 'Resta apenas 1 unidade disponível!'
                  : `Restam apenas ${currentStock} unidades deste lote!`}
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
              Devido ao processo manual de confecção em Ouro Preto, este produto possui tiragem restrita. {craftTimeText}
            </p>
          </div>

          {/* Quick Action Button */}
          {(onAddToCart || onBuyNow) && (
            <div className="shrink-0 flex sm:flex-col gap-2">
              {onBuyNow && (
                <button
                  onClick={onBuyNow}
                  className="bg-[#C85A32] hover:bg-[#a84420] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Garantir Peça Agora</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Artisan Batch Scarcity Meter */}
        <div className="bg-[#F8F5EE] p-3.5 rounded-xl border border-stone-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#70360D]">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#C85A32]" />
              Reserva da Fornada Colonial:
            </span>
            <span className="text-[#C85A32] font-black">
              {percentClaimed}% do lote já adquirido
            </span>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isCriticalStock
                  ? 'bg-gradient-to-r from-amber-500 to-[#C85A32]'
                  : 'bg-gradient-to-r from-[#C59B27] to-[#C85A32]'
              }`}
              style={{ width: `${percentClaimed}%` }}
            />
          </div>

          {/* Social Proof & Live Viewers Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-stone-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                <strong>{viewersCount} clientes</strong> estão visualizando esta peça agora
              </span>
            </div>

            <div className="flex items-center gap-1 text-stone-500">
              <Clock className="w-3 h-3 text-[#C59B27]" />
              <span>Última compra para {recentBuyer.city} ({recentBuyer.timeAgo})</span>
            </div>
          </div>
        </div>

        {/* Simulation Controls for testing urgency behavior */}
        {showSimulateControls && (
          <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs bg-stone-50 p-2.5 rounded-lg">
            <span className="font-bold text-stone-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              Simular Nível de Estoque para Demonstração:
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 4, 8, 15].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setSimulatedStock(qty)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                    simulatedStock === qty
                      ? 'bg-[#70360D] text-white border-[#70360D]'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {qty} {qty === 1 ? 'peça (crítico)' : qty <= 4 ? 'peças (baixo)' : 'peças (ok)'}
                </button>
              ))}
              <button
                onClick={() => setSimulatedStock(product.estoque)}
                className="text-[10px] text-stone-500 hover:text-stone-800 underline ml-1 cursor-pointer flex items-center gap-0.5"
                title="Restaurar estoque real"
              >
                <RotateCw className="w-3 h-3" />
                Resetar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
