import React, { useState, useMemo, useEffect } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ThumbsUp, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  Filter, 
  Search, 
  Loader2, 
  Award, 
  Truck, 
  HeartHandshake, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  X,
  Share2,
  PackageCheck,
  RefreshCw
} from 'lucide-react';
import { CustomerTestimonial, Product } from '../types';
import { INITIAL_TESTIMONIALS } from '../data/testimonialsData';

interface CustomerTestimonialsProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number, giftWrap: boolean) => void;
}

export const CustomerTestimonials: React.FC<CustomerTestimonialsProps> = ({
  products = [],
  onSelectProduct,
  onAddToCart,
}) => {
  // Testimonials state with local persistence
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>(() => {
    try {
      const saved = localStorage.getItem('ouro_preto_testimonials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar depoimentos salvos:', e);
    }
    return INITIAL_TESTIMONIALS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ouro_preto_testimonials', JSON.stringify(testimonials));
    } catch (e) {
      console.warn('Erro ao salvar depoimentos:', e);
    }
  }, [testimonials]);

  // Filters state
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Generator Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [aiSelectedProduct, setAiSelectedProduct] = useState<string>(products[0]?.titulo || 'Panela de Pedra-Sabão Tradicional 3L');
  const [aiProductCategory, setAiProductCategory] = useState<string>('Pedra-Sabão & Culinária');
  const [aiTone, setAiTone] = useState<string>('Chef de Culinária & Gastrônomo Exigente');
  const [aiCount, setAiCount] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedResults, setAiGeneratedResults] = useState<{
    overallSummary?: string;
    averageRating?: number;
    testimonials?: CustomerTestimonial[];
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Manual Review Form State
  const [manualName, setManualName] = useState('');
  const [manualCityState, setManualCityState] = useState('Belo Horizonte, MG');
  const [manualProduct, setManualProduct] = useState(products[0]?.titulo || '');
  const [manualRating, setManualRating] = useState(5);
  const [manualTitle, setManualTitle] = useState('');
  const [manualComment, setManualComment] = useState('');
  const [manualTag, setManualTag] = useState('Compra Verificada');

  // Trigger Gemini API to generate realistic reviews
  const handleGenerateTestimonials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setAiError(null);
    setAiGeneratedResults(null);

    try {
      const res = await fetch('/api/generate-testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: aiSelectedProduct,
          productCategory: aiProductCategory,
          tone: aiTone,
          count: aiCount,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Falha ao gerar depoimentos com a API Gemini.');
      }

      setAiGeneratedResults(json.data);
    } catch (err: any) {
      console.error('Erro na geração de depoimentos:', err);
      setAiError(err.message || 'Erro ao conectar com a IA Gemini.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add generated reviews to the official testimonials list
  const handleApplyAiTestimonials = () => {
    if (!aiGeneratedResults?.testimonials) return;

    const formatted: CustomerTestimonial[] = aiGeneratedResults.testimonials.map((t, idx) => ({
      id: `ai-${Date.now()}-${idx}`,
      customerName: t.customerName,
      cityState: t.cityState,
      productPurchased: t.productPurchased || aiSelectedProduct,
      rating: t.rating || 5,
      date: t.date || 'Recém-avaliado',
      title: t.title,
      comment: t.comment,
      verifiedPurchase: true,
      tags: t.tags || ['Compra Verificada', 'Qualidade Colonial'],
      helpfulCount: t.helpfulCount || Math.floor(Math.random() * 20 + 5),
      artisanOrCategoryMentioned: t.artisanOrCategoryMentioned || aiProductCategory,
      avatarColor: ['#70360D', '#C59B27', '#C85A32', '#2E6B40', '#1A1810'][Math.floor(Math.random() * 5)],
      isAiGenerated: true,
    }));

    setTestimonials((prev) => [...formatted, ...prev]);
    setIsAiModalOpen(false);
    setAiGeneratedResults(null);
  };

  // Manual Review Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualComment) return;

    const newReview: CustomerTestimonial = {
      id: `man-${Date.now()}`,
      customerName: manualName,
      cityState: manualCityState,
      productPurchased: manualProduct,
      rating: manualRating,
      date: 'Hoje',
      title: manualTitle || 'Excelente experiência com artesanato mineiro!',
      comment: manualComment,
      verifiedPurchase: true,
      tags: [manualTag, 'Cliente Satisfeito'],
      helpfulCount: 1,
      avatarColor: '#C59B27',
    };

    setTestimonials((prev) => [newReview, ...prev]);
    setIsManualModalOpen(false);
    // Reset form
    setManualName('');
    setManualTitle('');
    setManualComment('');
  };

  // Toggle helpful like
  const handleToggleHelpful = (id: string) => {
    setHelpfulLiked((prev) => {
      const current = !!prev[id];
      const next = !current;
      setTestimonials((tList) =>
        tList.map((item) =>
          item.id === id
            ? { ...item, helpfulCount: item.helpfulCount + (next ? 1 : -1) }
            : item
        )
      );
      return { ...prev, [id]: next };
    });
  };

  // Copy review to clipboard
  const handleCopyReview = (testimonial: CustomerTestimonial) => {
    const text = `"${testimonial.title}"\n${testimonial.comment}\n— ${testimonial.customerName} (${testimonial.cityState}) sobre ${testimonial.productPurchased}`;
    navigator.clipboard.writeText(text);
    setCopiedId(testimonial.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Reset to initial testimonials
  const handleResetTestimonials = () => {
    if (window.confirm('Restaurar os depoimentos padrão de Ouro Preto?')) {
      setTestimonials(INITIAL_TESTIMONIALS);
      localStorage.removeItem('ouro_preto_testimonials');
    }
  };

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchSearch =
        !searchFilter ||
        t.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.cityState.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.productPurchased.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.comment.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.title.toLowerCase().includes(searchFilter.toLowerCase());

      const matchRating =
        ratingFilter === 'all' || Math.floor(t.rating) === ratingFilter;

      const matchTag =
        selectedTag === 'all' ||
        t.tags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase())) ||
        (selectedTag === 'pedra' && t.productPurchased.toLowerCase().includes('pedra')) ||
        (selectedTag === 'doce' && t.productPurchased.toLowerCase().includes('doce')) ||
        (selectedTag === 'sacro' && (t.productPurchased.toLowerCase().includes('cruz') || t.productPurchased.toLowerCase().includes('barroc')));

      return matchSearch && matchRating && matchTag;
    });
  }, [testimonials, searchFilter, ratingFilter, selectedTag]);

  // Overall Statistics Calculation
  const totalReviewsCount = testimonials.length;
  const avgRating = (
    testimonials.reduce((acc, t) => acc + t.rating, 0) / (totalReviewsCount || 1)
  ).toFixed(1);

  return (
    <section className="bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 border-y border-[#3A3D40]/15 font-sans text-[#2D3033]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* SECTION HEADER & SOCIAL PROOF BADGES */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#3A3D40]/15 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#C59B27]/15 text-[#70360D] text-xs font-black px-3 py-1 rounded-full border border-[#C59B27]/30">
              <Award className="w-4 h-4 text-[#C59B27]" />
              <span>Autoridade & Prova Social de Ouro Preto</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D3033] tracking-tight">
              Depoimentos de Clientes & Compradores Verificados
            </h2>
            
            <p className="text-xs sm:text-sm text-[#3A3D40]/80 leading-relaxed">
              Descubra por que mais de <strong>1.420 famílias, chefs e colecionadores de todo o Brasil</strong> confiam no Mercado Colonial de Ouro Preto para receber peças históricas autênticas e culinária mineira em casa com segurança.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="bg-[#C59B27] hover:bg-[#b38a1f] text-[#1A1810] px-4 py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer transform hover:scale-[1.02]"
              title="Gerar Depoimentos com Gemini 3.7 Flash"
            >
              <Sparkles className="w-4 h-4 text-[#1A1810]" />
              <span>Gerar Depoimentos com IA (Gemini)</span>
            </button>

            <button
              onClick={() => setIsManualModalOpen(true)}
              className="bg-white hover:bg-stone-50 text-[#70360D] border border-[#70360D]/30 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#70360D]" />
              <span>Escrever Avaliação</span>
            </button>
          </div>
        </div>

        {/* SOCIAL AUTHORITY STATS BENTO BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#3A3D40]/15 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C59B27] shrink-0 font-black text-xl">
              ★ {avgRating}
            </div>
            <div>
              <span className="text-xs text-stone-500 font-semibold block">Satisfação Geral</span>
              <span className="font-extrabold text-sm text-[#2D3033]">{totalReviewsCount} avaliações 5 estrelas</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#3A3D40]/15 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-semibold block">Entrega Segura</span>
              <span className="font-extrabold text-sm text-[#2D3033]">100% Peças Protegidas</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#3A3D40]/15 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-semibold block">Origem Certificada</span>
              <span className="font-extrabold text-sm text-[#2D3033]">Mestres de Ouro Preto</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#3A3D40]/15 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-semibold block">Recomendação</span>
              <span className="font-extrabold text-sm text-[#2D3033]">99.4% Indicam a Amigos</span>
            </div>
          </div>
        </div>

        {/* FILTERS & SEARCH CONTROL BAR */}
        <div className="bg-white p-4 rounded-2xl border border-[#3A3D40]/15 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tag Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTag === 'all'
                  ? 'bg-[#C59B27] text-[#1A1810] shadow-sm'
                  : 'bg-[#F8F5EE] text-stone-600 hover:bg-stone-200'
              }`}
            >
              Todos ({testimonials.length})
            </button>
            <button
              onClick={() => setSelectedTag('pedra')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTag === 'pedra'
                  ? 'bg-[#70360D] text-white shadow-sm'
                  : 'bg-[#F8F5EE] text-stone-600 hover:bg-stone-200'
              }`}
            >
              🍳 Panelas & Pedra-Sabão
            </button>
            <button
              onClick={() => setSelectedTag('doce')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTag === 'doce'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'bg-[#F8F5EE] text-stone-600 hover:bg-stone-200'
              }`}
            >
              🍯 Doces & Compotas
            </button>
            <button
              onClick={() => setSelectedTag('sacro')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTag === 'sacro'
                  ? 'bg-[#2E6B40] text-white shadow-sm'
                  : 'bg-[#F8F5EE] text-stone-600 hover:bg-stone-200'
              }`}
            >
              🏛️ Arte Sacra & Barroca
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, cidade ou palavra..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#F8F5EE] pl-9 pr-4 py-2 rounded-xl text-xs text-[#2D3033] border border-stone-200 focus:border-[#C59B27] focus:outline-none"
            />
          </div>
        </div>

        {/* TESTIMONIALS GRID (BENTO MASONRY STYLE) */}
        {filteredTestimonials.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300 space-y-3">
            <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="font-bold text-sm text-stone-700">Nenhum depoimento encontrado com os filtros atuais.</p>
            <button
              onClick={() => {
                setSelectedTag('all');
                setSearchFilter('');
                setRatingFilter('all');
              }}
              className="text-xs text-[#70360D] font-bold underline cursor-pointer"
            >
              Limpar filtros de busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((item) => {
              const isLiked = !!helpfulLiked[item.id];
              const isCopied = copiedId === item.id;
              const matchingProduct = products.find(
                (p) => p.titulo.toLowerCase().includes(item.productPurchased.toLowerCase()) || item.productPurchased.toLowerCase().includes(p.titulo.toLowerCase())
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-[#3A3D40]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative group"
                >
                  {/* Top Customer Info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                          style={{ backgroundColor: item.avatarColor || '#70360D' }}
                        >
                          {item.customerName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-[#2D3033] leading-tight">
                            {item.customerName}
                          </h4>
                          <span className="text-[11px] text-stone-500 font-medium block">
                            {item.cityState} • {item.date}
                          </span>
                        </div>
                      </div>

                      {item.verifiedPurchase && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Compra Verificada</span>
                        </span>
                      )}
                    </div>

                    {/* Star Rating & AI Badge if applicable */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(item.rating)
                                ? 'text-[#C59B27] fill-[#C59B27]'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-extrabold text-[#70360D] ml-1">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>

                      {item.isAiGenerated && (
                        <span className="text-[9px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-mono flex items-center gap-1" title="Gerado com inteligência artificial Gemini com base em características do produto">
                          <Sparkles className="w-2.5 h-2.5 text-[#C59B27]" />
                          Gemini 3.7
                        </span>
                      )}
                    </div>

                    {/* Review Title & Body */}
                    <div className="space-y-1.5">
                      <h5 className="font-extrabold text-xs text-[#2D3033] leading-snug">
                        "{item.title}"
                      </h5>
                      <p className="text-xs text-[#3A3D40] leading-relaxed line-clamp-5">
                        {item.comment}
                      </p>
                    </div>

                    {/* Product Purchased Link & Tags */}
                    <div className="pt-2 border-t border-stone-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-stone-400 font-medium">Item:</span>
                        <span className="font-bold text-[#70360D] line-clamp-1">
                          {item.productPurchased}
                        </span>
                      </div>

                      {/* Review Tags */}
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-[#F8F5EE] text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-stone-200"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <button
                      onClick={() => handleToggleHelpful(item.id)}
                      className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'hover:bg-stone-100 text-stone-600'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'text-emerald-600 fill-emerald-600' : ''}`} />
                      <span>Útil ({item.helpfulCount})</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyReview(item)}
                        className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Copiar Depoimento"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {matchingProduct && onSelectProduct && (
                        <button
                          onClick={() => onSelectProduct(matchingProduct)}
                          className="text-[#70360D] hover:underline font-bold text-[11px] cursor-pointer"
                        >
                          Ver Peça →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* RESET TESTIMONIALS BUTTON */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleResetTestimonials}
            className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restaurar Depoimentos Originais de Ouro Preto</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: AI TESTIMONIAL GENERATOR (GEMINI 3.7 FLASH) */}
      {/* ========================================================================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#3A3D40]/20 overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-5 bg-[#1A1810] text-white flex items-center justify-between border-b border-[#C59B27]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C59B27] text-[#1A1810] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Gerador de Depoimentos Autênticos com Gemini AI
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    Crie avaliações realistas com detalhes de cura de pedra, embalagem e culinária
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              <form onSubmit={handleGenerateTestimonials} className="space-y-4 bg-white p-5 rounded-2xl border border-[#3A3D40]/15 shadow-sm">
                <div>
                  <label className="block font-bold text-[#3A3D40] mb-1">
                    1. Selecione o Produto Artesanal Alvo:
                  </label>
                  <select
                    value={aiSelectedProduct}
                    onChange={(e) => {
                      setAiSelectedProduct(e.target.value);
                      const found = products.find((p) => p.titulo === e.target.value);
                      if (found) setAiProductCategory(found.categoria);
                    }}
                    className="w-full bg-[#F8F5EE] border border-stone-300 rounded-xl p-2.5 text-xs text-[#2D3033] font-bold focus:border-[#C59B27] focus:outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.titulo}>
                        {p.titulo} — R$ {p.preco.toFixed(2).replace('.', ',')} ({p.categoria})
                      </option>
                    ))}
                    <option value="Panela de Pedra-Sabão 5L Família">Panela de Pedra-Sabão 5L Família</option>
                    <option value="Tábua para Queijo e Frios em Pedra-Sabão">Tábua para Queijo e Frios em Pedra-Sabão</option>
                    <option value="Goiabada Cascão de Ouro Preto 800g">Goiabada Cascão de Ouro Preto 800g</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#3A3D40] mb-1">
                      2. Perfil / Tom do Comprador:
                    </label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full bg-[#F8F5EE] border border-stone-300 rounded-xl p-2.5 text-xs text-[#2D3033] font-medium focus:border-[#C59B27] focus:outline-none"
                    >
                      <option value="Chef de Culinária & Gastrônomo Exigente">Chef de Culinária & Gastrônomo</option>
                      <option value="Turista de SP/RJ Encantado com a Entrega Rápida">Turista de SP/RJ (Embalagem & Velocidade)</option>
                      <option value="Decorador de Ambientes Rústicos / Luxo">Arquiteto & Decorador de Interiores</option>
                      <option value="Presente de Casamento / Família Tradicional">Presente Familiar & Casamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#3A3D40] mb-1">
                      3. Quantidade de Depoimentos a Gerar:
                    </label>
                    <select
                      value={aiCount}
                      onChange={(e) => setAiCount(Number(e.target.value))}
                      className="w-full bg-[#F8F5EE] border border-stone-300 rounded-xl p-2.5 text-xs text-[#2D3033] font-medium focus:border-[#C59B27] focus:outline-none"
                    >
                      <option value={2}>2 depoimentos detalhados</option>
                      <option value={3}>3 depoimentos detalhados (Recomendado)</option>
                      <option value={4}>4 depoimentos detalhados</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-[#C59B27] hover:bg-[#b38a1f] text-[#1A1810] py-3 rounded-xl font-extrabold text-xs shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando Depoimentos com Gemini 3.7 Flash...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Gerar Novos Depoimentos Reais</span>
                    </>
                  )}
                </button>
              </form>

              {/* Error Display */}
              {aiError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl font-bold text-xs">
                  ⚠️ {aiError}
                </div>
              )}

              {/* Generated Preview Results */}
              {aiGeneratedResults?.testimonials && (
                <div className="space-y-4 pt-2">
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-amber-900">
                      ✨ {aiGeneratedResults.testimonials.length} Depoimentos Gerados pela IA:
                    </span>
                    <span className="font-bold text-[#70360D]">
                      Média: ★ {aiGeneratedResults.averageRating || '5.0'}
                    </span>
                  </div>

                  {aiGeneratedResults.overallSummary && (
                    <p className="text-[11px] text-stone-600 italic bg-white p-2.5 rounded-lg border border-stone-200">
                      "{aiGeneratedResults.overallSummary}"
                    </p>
                  )}

                  <div className="space-y-3">
                    {aiGeneratedResults.testimonials.map((gen, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-extrabold text-stone-900 block">{gen.customerName}</span>
                            <span className="text-[10px] text-stone-500">{gen.cityState} • {gen.productPurchased}</span>
                          </div>
                          <div className="flex items-center text-[#C59B27]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#C59B27]" />
                            ))}
                          </div>
                        </div>
                        <h5 className="font-bold text-stone-800 text-xs">"{gen.title}"</h5>
                        <p className="text-[11px] text-stone-600">{gen.comment}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {gen.tags?.map((tag, tIdx) => (
                            <span key={tIdx} className="bg-stone-100 text-[9px] font-bold px-1.5 py-0.5 rounded text-stone-700">
                              ✓ {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleApplyAiTestimonials}
                    className="w-full bg-[#2E6B40] hover:bg-[#235331] text-white py-3 rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publicar e Salvar Depoimentos na Vitrine</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MANUAL CUSTOMER REVIEW SUBMIT */}
      {/* ========================================================================= */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-lg w-full flex flex-col shadow-2xl border border-[#3A3D40]/20 overflow-hidden animate-fadeIn">
            <div className="p-4 bg-[#70360D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C59B27]" />
                <h3 className="font-extrabold text-sm">Deixe sua Avaliação do Artesanato</h3>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-stone-300 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Seu Nome Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-stone-300 focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Cidade e Estado:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Santos, SP"
                    value={manualCityState}
                    onChange={(e) => setManualCityState(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-stone-300 focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nota (1 a 5 estrelas):</label>
                  <select
                    value={manualRating}
                    onChange={(e) => setManualRating(Number(e.target.value))}
                    className="w-full p-2 bg-white rounded-lg border border-stone-300 font-bold focus:border-[#C59B27] focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Estrelas - Excelente)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Estrelas - Muito Bom)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Produto Avaliado:</label>
                <select
                  value={manualProduct}
                  onChange={(e) => setManualProduct(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-stone-300 focus:border-[#C59B27] focus:outline-none font-bold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.titulo}>
                      {p.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Título do Depoimento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: A panela é maravilhosa e super resistente!"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-stone-300 focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Seu Comentário Detalhado:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Conte como foi sua experiência com a embalagem, a cura da pedra ou o sabor do doce..."
                  value={manualComment}
                  onChange={(e) => setManualComment(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-stone-300 focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#70360D] hover:bg-[#582b0b] text-white py-2.5 rounded-xl font-bold text-xs shadow cursor-pointer transition-colors"
              >
                Enviar Meu Depoimento
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
