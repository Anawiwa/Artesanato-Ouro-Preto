import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  MapPin,
  ShieldCheck,
  Package,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  Search,
  Check,
  Copy,
  Info,
  Layers,
  HelpCircle,
  Share2,
  Navigation,
  Compass,
  ArrowRight,
  Shield,
  Box,
  Flame
} from 'lucide-react';
import { Product, ShippingOption, ShippingSimulationResult } from '../types';
import {
  HISTORIC_CITIES_MG,
  QUICK_LOCATION_PRESETS,
  calculateColonialShipping,
  OFFLINE_CEP_DATABASE,
} from '../data/colonialLogisticsData';

interface ColonialShippingSimulatorProps {
  currentProduct?: Product;
  allProducts?: Product[];
  selectedShippingOption?: ShippingOption | null;
  onSelectShippingOption?: (option: ShippingOption, simulationResult: ShippingSimulationResult) => void;
  defaultCep?: string;
  compact?: boolean;
}

export const ColonialShippingSimulator: React.FC<ColonialShippingSimulatorProps> = ({
  currentProduct,
  allProducts = [],
  selectedShippingOption,
  onSelectShippingOption,
  defaultCep = '35400-000',
  compact = false,
}) => {
  // Input state
  const [cepInput, setCepInput] = useState<string>(defaultCep);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(currentProduct || allProducts[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedInfo, setCopiedInfo] = useState<boolean>(false);

  // Address details state
  const [addressDetails, setAddressDetails] = useState<{
    city: string;
    state: string;
    neighborhood?: string;
    street?: string;
  }>({
    city: 'Ouro Preto',
    state: 'MG',
    neighborhood: 'Centro Histórico',
  });

  // Current simulation result
  const [simulationResult, setSimulationResult] = useState<ShippingSimulationResult>(() => {
    return calculateColonialShipping(
      '35400000',
      'Ouro Preto',
      'MG',
      currentProduct?.preco || 289.9,
      currentProduct?.titulo?.toLowerCase().includes('panela') ? 4.2 : 2.0
    );
  });

  // Active chosen shipping option (local state if not controlled)
  const [activeOptionId, setActiveOptionId] = useState<string>(
    selectedShippingOption?.id || simulationResult.options[0]?.id || 'colonial-express-local'
  );

  // Synchronize product changes
  useEffect(() => {
    if (currentProduct) {
      setSelectedProduct(currentProduct);
    }
  }, [currentProduct]);

  // Format CEP string input as 99999-999
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (raw.length > 5) {
      setCepInput(`${raw.slice(0, 5)}-${raw.slice(5)}`);
    } else {
      setCepInput(raw);
    }
  };

  // Perform CEP calculation
  const handleCalculateCep = async (cepToCalc?: string) => {
    const rawCep = (cepToCalc || cepInput).replace(/\D/g, '');
    
    if (rawCep.length < 8) {
      setErrorMsg('Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    let cityFound = '';
    let stateFound = '';
    let neighborhoodFound = '';
    let streetFound = '';

    // 1. Check local historic database first for instant resolution
    if (OFFLINE_CEP_DATABASE[rawCep]) {
      cityFound = OFFLINE_CEP_DATABASE[rawCep].city;
      stateFound = OFFLINE_CEP_DATABASE[rawCep].state;
      neighborhoodFound = OFFLINE_CEP_DATABASE[rawCep].neighborhood;
    } else {
      // 2. Try fetching from ViaCEP API
      try {
        const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`, {
          signal: AbortSignal.timeout(4000),
        });
        if (response.ok) {
          const data = await response.json();
          if (!data.erro) {
            cityFound = data.localidade;
            stateFound = data.uf;
            neighborhoodFound = data.bairro;
            streetFound = data.logradouro;
          }
        }
      } catch (err) {
        console.warn('ViaCEP offline ou timeout, usando fallback de cálculo por faixa:', err);
      }

      // Fallback: estimate state by first 2 digits if API fails
      if (!stateFound) {
        const prefix2 = rawCep.slice(0, 2);
        if (prefix2 >= '30' && prefix2 <= '39') stateFound = 'MG';
        else if (prefix2 >= '01' && prefix2 <= '19') stateFound = 'SP';
        else if (prefix2 >= '20' && prefix2 <= '28') stateFound = 'RJ';
        else if (prefix2 >= '80' && prefix2 <= '87') stateFound = 'PR';
        else if (prefix2 >= '70' && prefix2 <= '73') stateFound = 'DF';
        else stateFound = 'BR';
      }
    }

    setAddressDetails({
      city: cityFound || (stateFound === 'MG' ? 'Minas Gerais' : 'Brasil'),
      state: stateFound,
      neighborhood: neighborhoodFound,
      street: streetFound,
    });

    const weight = selectedProduct?.titulo?.toLowerCase().includes('panela')
      ? 4.2
      : selectedProduct?.titulo?.toLowerCase().includes('rechaud')
      ? 6.0
      : selectedProduct?.titulo?.toLowerCase().includes('doce')
      ? 0.9
      : 2.0;

    const result = calculateColonialShipping(
      rawCep,
      cityFound,
      stateFound,
      selectedProduct?.preco || 289.9,
      weight
    );

    setSimulationResult(result);
    setIsLoading(false);

    // Auto-select first option
    if (result.options.length > 0) {
      const firstOpt = result.options[0];
      setActiveOptionId(firstOpt.id);
      onSelectShippingOption?.(firstOpt, result);
    }
  };

  // Quick Preset click
  const handleSelectPreset = (presetCep: string) => {
    setCepInput(presetCep);
    handleCalculateCep(presetCep);
  };

  // Select shipping option
  const handleChooseOption = (option: ShippingOption) => {
    setActiveOptionId(option.id);
    onSelectShippingOption?.(option, simulationResult);
  };

  // Copy shipping quote to clipboard
  const handleCopyQuote = () => {
    const activeOpt = simulationResult.options.find((o) => o.id === activeOptionId) || simulationResult.options[0];
    const text = `🚚 *Cotação de Frete - Mercado Colonial Ouro Preto*\n` +
      `📍 Destino: ${simulationResult.city}, ${simulationResult.state} (CEP ${simulationResult.cep})\n` +
      `📦 Peça: ${selectedProduct?.titulo || 'Artesanato Colonial'}\n` +
      `⚡ Modalidade: ${activeOpt?.name}\n` +
      `💰 Valor: ${activeOpt?.price === 0 ? 'GRÁTIS' : `R$ ${activeOpt?.price.toFixed(2).replace('.', ',')}`}\n` +
      `📅 Prazo Estimado: ${activeOpt?.deliveryDateEstimated}\n` +
      `🛡️ Seguro de Quebra & Embalagem Reforçada: INCLUSO\n` +
      `🏛️ Origem: Ateliê de Ouro Preto, MG`;

    navigator.clipboard.writeText(text);
    setCopiedInfo(true);
    setTimeout(() => setCopiedInfo(false), 2500);
  };

  const isHistoric = simulationResult.isHistoricCityMG;

  return (
    <div
      id="colonial-shipping-simulator"
      className="bg-[#FDFBF7] rounded-3xl border border-[#3A3D40]/20 shadow-md overflow-hidden font-sans text-[#2D3033]"
    >
      {/* ========================================================================= */}
      {/* COMPONENT HEADER WITH GOLD / TERRACOTTA IDENTITY */}
      {/* ========================================================================= */}
      <div className="bg-[#1A1810] text-white p-5 sm:p-6 border-b border-[#C59B27]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#C59B27]/20 text-[#E8C547] text-xs font-black px-3 py-1 rounded-full border border-[#C59B27]/40">
              <Compass className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Logística Colonial & Rota da Estrada Real</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Simulador de Frete & Entrega Histórica</span>
              <Truck className="w-5 h-5 text-[#C59B27]" />
            </h3>

            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              Consulte prazos expressos e benefícios exclusivos de frete para <strong>cidades históricas de Minas Gerais</strong> e envio seguro com embalagem especial para todo o Brasil.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="bg-[#2E6B40] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Garantia Antiquebra 100%</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CEP & PRODUCT SELECTOR BAR */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 space-y-6 bg-white border-b border-[#3A3D40]/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* CEP Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label htmlFor="cep-input-field" className="block text-xs font-bold text-[#70360D] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Digite seu CEP de Destino:</span>
            </label>
            <div className="relative">
              <input
                id="cep-input-field"
                type="text"
                value={cepInput}
                onChange={handleCepChange}
                placeholder="Ex: 35400-000"
                maxLength={9}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCalculateCep();
                }}
                className="w-full bg-[#F8F5EE] border-2 border-stone-200 focus:border-[#C59B27] rounded-xl px-3.5 py-2.5 text-sm font-black text-[#2D3033] tracking-wider focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-stone-400 font-bold">
                Brasil
              </span>
            </div>
          </div>

          {/* Product Selector for Weight / Package calculation */}
          {allProducts.length > 0 && (
            <div className="md:col-span-5 space-y-1.5">
              <label htmlFor="product-weight-select" className="block text-xs font-bold text-[#70360D] flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Peça / Peso da Encomenda:</span>
              </label>
              <select
                id="product-weight-select"
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const p = allProducts.find((item) => item.id === e.target.value);
                  if (p) {
                    setSelectedProduct(p);
                    handleCalculateCep();
                  }
                }}
                className="w-full bg-[#F8F5EE] border-2 border-stone-200 focus:border-[#C59B27] rounded-xl px-3 py-2.5 text-xs font-bold text-[#2D3033] focus:outline-none transition-colors cursor-pointer"
              >
                {allProducts.map((p) => {
                  const isHeavy = p.titulo.toLowerCase().includes('panela') || p.titulo.toLowerCase().includes('rechaud');
                  const weightText = isHeavy ? '~4.5 kg (Pedra-Sabão Pura)' : '~1.0 kg (Embalagem Protetora)';
                  return (
                    <option key={p.id} value={p.id}>
                      {p.titulo} • {weightText} — R$ {p.preco.toFixed(2).replace('.', ',')}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Calculate Button */}
          <div className="md:col-span-3">
            <button
              onClick={() => handleCalculateCep()}
              disabled={isLoading}
              className="w-full bg-[#C59B27] hover:bg-[#b38a1f] text-[#1A1810] font-black py-2.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Calculando Rota...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Calcular Frete & Prazo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* QUICK HISTORIC CITIES & CAPITALS PRESET PILLS */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              Simulação Rápida em Cidades Históricas de MG & Capitais:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {QUICK_LOCATION_PRESETS.map((preset, idx) => {
              const isSelected = cepInput === preset.cep;
              const isColonialCity = preset.label.includes('Ouro Preto') || preset.label.includes('Mariana') || preset.label.includes('Tiradentes') || preset.label.includes('Diamantina') || preset.label.includes('São João');

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset.cep)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#C59B27] text-[#1A1810] border-[#C59B27] shadow-sm font-black'
                      : isColonialCity
                      ? 'bg-[#F8F5EE] hover:bg-amber-50 text-[#70360D] border-amber-200'
                      : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                      isColonialCity ? 'bg-[#70360D] text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {preset.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SPECIAL HIGHLIGHT BANNER: LOGÍSTICA COLONIAL ESTRADA REAL */}
      {/* ========================================================================= */}
      {isHistoric ? (
        <div className="bg-gradient-to-r from-[#70360D] to-[#964B15] text-white p-5 sm:p-6 border-y border-[#C59B27]/40 shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="bg-[#C59B27] text-[#1A1810] text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  ⭐ Diferencial Exclusivo
                </span>
                <span className="text-amber-200 text-xs font-bold">
                  Destino Histórico Reconhecido: <strong>{simulationResult.historicCityName} (MG)</strong>
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Logística Colonial Expressa da Estrada Real</span>
                <Flame className="w-4 h-4 text-[#C59B27]" />
              </h4>

              <p className="text-xs text-stone-200 leading-relaxed">
                {simulationResult.historicCityPerk ||
                  'Envio prioritário direto do ateliê de Cachoeira do Campo com embalagem de madeira ecológica, seguro integral antiquebra e entrega em até 24-48 horas.'}
              </p>
            </div>

            <div className="bg-black/30 p-3.5 rounded-2xl border border-white/15 text-center shrink-0 space-y-1">
              <span className="text-[10px] text-amber-300 font-bold block uppercase">Frete Colonial Especial</span>
              <span className="text-2xl font-black text-[#C59B27]">
                {simulationResult.options[0]?.price === 0 ? 'GRÁTIS' : `R$ ${simulationResult.options[0]?.price.toFixed(2).replace('.', ',')}`}
              </span>
              <span className="text-[10px] text-stone-300 block">
                {simulationResult.options[0]?.deliveryDateEstimated}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#F8F5EE] p-4 sm:p-5 border-y border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C59B27]/20 border border-[#C59B27]/40 flex items-center justify-center text-[#70360D] shrink-0 font-bold">
              <Navigation className="w-5 h-5 text-[#C59B27]" />
            </div>
            <div>
              <h5 className="font-extrabold text-[#2D3033]">
                Envio Seguro para {addressDetails.city || 'sua cidade'}, {addressDetails.state}
              </h5>
              <p className="text-stone-500 text-[11px]">
                Despachado direto do Hub Central de Ouro Preto com rastreamento ativo em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-500 font-semibold text-[11px]">
            <span>Origem: <strong>Ouro Preto, MG (35400-000)</strong></span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SHIPPING TIERS SELECTION GRID */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-sm sm:text-base text-[#2D3033] flex items-center gap-2">
            <span>Opções Disponíveis para Entrega:</span>
            <span className="text-xs font-semibold text-stone-500">
              (Selecione a modalidade desejada)
            </span>
          </h4>

          <button
            onClick={handleCopyQuote}
            className="text-[#70360D] hover:text-[#C59B27] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm"
            title="Copiar Cotação para Enviar por WhatsApp"
          >
            {copiedInfo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedInfo ? 'Cotação Copiada!' : 'Copiar Cotação'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {simulationResult.options.map((opt) => {
            const isSelected = activeOptionId === opt.id;
            const isFree = opt.price === 0;

            return (
              <div
                key={opt.id}
                onClick={() => handleChooseOption(opt)}
                className={`rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  isSelected
                    ? opt.isColonialSpecial
                      ? 'bg-amber-50/50 border-[#C59B27] shadow-md ring-2 ring-[#C59B27]/30'
                      : 'bg-stone-50 border-[#70360D] shadow-md ring-2 ring-[#70360D]/20'
                    : 'bg-white hover:bg-stone-50/60 border-stone-200'
                }`}
              >
                {/* Top Badge */}
                {opt.badge && (
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        opt.isColonialSpecial
                          ? 'bg-[#C59B27] text-[#1A1810]'
                          : 'bg-[#70360D] text-white'
                      }`}
                    >
                      {opt.badge}
                    </span>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#2E6B40] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                )}

                {/* Name & Carrier */}
                <div className="space-y-1">
                  <h5 className="font-black text-xs sm:text-sm text-[#2D3033] leading-tight">
                    {opt.name}
                  </h5>
                  <span className="text-[11px] text-stone-500 font-medium block">
                    {opt.carrier}
                  </span>
                </div>

                {/* Delivery Date & Price */}
                <div className="bg-[#F8F5EE] p-3 rounded-xl border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-600 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                      Previsão:
                    </span>
                    <span className="text-xs font-extrabold text-[#70360D]">
                      {opt.deliveryDateEstimated}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-stone-200">
                    <span className="text-[11px] text-stone-500 font-semibold">Valor do Frete:</span>
                    <div className="text-right">
                      {opt.originalPrice && (
                        <span className="text-[10px] text-stone-400 line-through mr-1.5">
                          R$ {opt.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                      <span
                        className={`text-base font-black ${
                          isFree ? 'text-[#2E6B40]' : 'text-[#2D3033]'
                        }`}
                      >
                        {isFree ? 'GRÁTIS' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description & Packaging note */}
                <p className="text-[11px] text-stone-600 leading-snug line-clamp-3">
                  {opt.description}
                </p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Seguro Total Incluso
                  </span>
                  <span className="text-stone-400">
                    {opt.iconType === 'horse_carriage' ? '🏛️ Rota Histórica' : '📦 Envio Rápido'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE TIMELINE: "A ROTA DA ESTRADA REAL ATÉ SUA CASA" */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 bg-[#F8F5EE] border-t border-[#3A3D40]/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-[#2D3033] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#C59B27]" />
              <span>Como Funciona o Envio de Peças Pesadas & Frágeis de Ouro Preto</span>
            </h4>
            <p className="text-[11px] text-stone-500">
              Processo artesanal de embalagem para panelas de pedra-sabão, tachos de cobre e doces coloniais
            </p>
          </div>

          <span className="text-[11px] bg-white border border-stone-200 px-3 py-1 rounded-full font-bold text-[#70360D] self-start sm:self-center">
            Selo de Qualidade Mercado Colonial
          </span>
        </div>

        {/* 4-Step Interactive Horizontal Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#70360D] text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h5 className="font-black text-xs text-[#2D3033]">Curadoria no Ateliê</h5>
            <p className="text-[11px] text-stone-600 leading-snug">
              Cada peça é inspecionada pelo mestre artesão em Cachoeira do Campo, acompanhada de manual de cura e selo de procedência.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#C59B27] text-[#1A1810] font-black text-xs flex items-center justify-center">
              2
            </div>
            <h5 className="font-black text-xs text-[#2D3033]">Embalagem Reforçada</h5>
            <p className="text-[11px] text-stone-600 leading-snug">
              Engradado protetor ecológico, triplo plástico bolha e amortecedores térmicos para suportar qualquer viagem rodoviária ou aérea.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#C85A32] text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h5 className="font-black text-xs text-[#2D3033]">Rota Estrada Real</h5>
            <p className="text-[11px] text-stone-600 leading-snug">
              Despacho diário prioritário para centros de triagem com código de rastreamento enviado por e-mail e WhatsApp.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#2E6B40] text-white font-black text-xs flex items-center justify-center">
              4
            </div>
            <h5 className="font-black text-xs text-[#2D3033]">Chegada Segura</h5>
            <p className="text-[11px] text-stone-600 leading-snug">
              Entrega em mãos. Se houver qualquer avaria no transporte, enviamos outra peça imediatamente sem burocracia.
            </p>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* FOOTER ACTIONS BAR */}
      {/* ========================================================================= */}
      <div className="p-4 bg-[#1A1810] text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#C59B27]" />
          <span className="text-[11px] text-stone-300">
            Dúvidas sobre entrega em áreas rurais ou sítios históricos? Fale com a equipe de expedição de Ouro Preto.
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              const opt = simulationResult.options.find((o) => o.id === activeOptionId) || simulationResult.options[0];
              if (opt) onSelectShippingOption?.(opt, simulationResult);
            }}
            className="bg-[#C59B27] hover:bg-[#b38a1f] text-[#1A1810] font-black px-4 py-2 rounded-xl text-xs shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Aplicar Esta Opção ao Meu Pedido</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
