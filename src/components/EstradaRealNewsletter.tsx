import React, { useState, useEffect } from 'react';
import {
  Mail,
  Feather,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Calendar,
  Award,
  BookOpen,
  Bell,
  Heart,
  ChevronRight,
  Eye,
  X,
  Compass,
  Flame,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { NewsletterSubscriber } from '../types';

const INTEREST_OPTIONS = [
  { id: 'pedra_sabao', label: 'Panelas & Utensílios de Pedra-Sabão', icon: '🍲' },
  { id: 'arte_sacra', label: 'Esculturas Barrocas & Arte Sacra', icon: '🏛️' },
  { id: 'cobre_tacho', label: 'Cobre Martelado & Tacharia', icon: '🏺' },
  { id: 'marcenaria', label: 'Madeira Nobre & Peças de Demolição', icon: '🪵' },
  { id: 'sabores_roca', label: 'Doces no Tacho & Sabores Coloniais', icon: '🍯' },
];

const PREVIEW_EDITION = {
  editionNumber: 42,
  title: 'Edição nº 42 • Os Segredos do Esteatito de Cachoeira do Campo',
  artisanSpotlight: 'Mestre Jadir de Oliveira (42 anos de ofício)',
  date: 'Quinzenal • 15 de Agosto',
  snippet:
    'Nesta edição, adentramos a pedreira histórica de Cachoeira do Campo para desvendar como o talco mineral confere à pedra-sabão sua capacidade única de retenção térmica e liberação benéfica de ferro e cálcio nos caldos mineiros...',
  highlights: [
    'Entrevista exclusiva com Mestre Jadir sobre os filtros coloniais esculpidos à mão.',
    'Lote limitado de 15 panelas com alças de latão maciço forjadas a fogo.',
    'Receita secular do Feijão Tropeiro de Ouro Preto curado em pedra.',
  ],
};

const STORAGE_KEY = 'estrada_real_newsletter_sub';

export const EstradaRealNewsletter: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'pedra_sabao',
    'arte_sacra',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeSubscriber, setActiveSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check previous subscription in local state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: NewsletterSubscriber = JSON.parse(saved);
        if (parsed && parsed.email) {
          setActiveSubscriber(parsed);
          setIsSubscribed(true);
        }
      }
    } catch {
      // Ignore local storage parse errors
    }
  }, []);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newSub: NewsletterSubscriber = {
        id: 'sub-' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        whatsappOptIn,
        interests: selectedInterests,
        subscribedAt: new Date().toISOString(),
        frequency: 'quinzenal',
        couponCode: 'ESTRADAREAL10',
        status: 'active',
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSub));
      } catch {
        // localStorage fallback
      }

      setActiveSubscriber(newSub);
      setIsSubscribed(true);
      setIsSubmitting(false);
    }, 850);
  };

  const handleResetForm = () => {
    setIsSubscribed(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <section
      id="newsletter-estrada-real"
      className="relative overflow-hidden bg-[#241710] text-[#F3EDE2] py-16 px-4 sm:px-6 lg:px-8 border-y-4 border-[#C59B27]"
    >
      {/* Background Colonial Texture & Watermark */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(#C59B27 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-[#8B2500]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Context & Editorial Presentation */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D2719] border border-[#C59B27]/50 text-[#E8C547] text-xs font-semibold tracking-wide uppercase">
              <Feather className="w-3.5 h-3.5" />
              <span>Curadoria Quinzenal • Estrada Real</span>
            </div>

            {/* Main Headline */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] tracking-tight leading-tight">
                Notas da <span className="text-[#E8C547] italic">Estrada Real</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#E5DDD0] leading-relaxed">
                A cada 15 dias, uma carta exclusiva com a alma de Minas: conheça novos mestres artesãos de Ouro Preto, descubra lotes raros em pedra-sabão e cobre antes do público geral e mergulhe na história viva do barroco.
              </p>
            </div>

            {/* Editorial Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#2E1E14]/80 border border-[#C59B27]/25">
                <div className="p-2 rounded-lg bg-[#C59B27]/20 text-[#E8C547] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF8F5]">Novos Artesãos</h4>
                  <p className="text-[11px] text-[#D0C4B4] mt-0.5 leading-snug">
                    Apresentação de ateliês familiares de Ouro Preto, Mariana e Tiradentes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#2E1E14]/80 border border-[#C59B27]/25">
                <div className="p-2 rounded-lg bg-[#C59B27]/20 text-[#E8C547] shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF8F5]">Coleções Exclusivas</h4>
                  <p className="text-[11px] text-[#D0C4B4] mt-0.5 leading-snug">
                    Acesso prioritário a peças únicas e lotes numerados do casario.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#2E1E14]/80 border border-[#C59B27]/25">
                <div className="p-2 rounded-lg bg-[#C59B27]/20 text-[#E8C547] shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF8F5]">Envio Quinzenal</h4>
                  <p className="text-[11px] text-[#D0C4B4] mt-0.5 leading-snug">
                    Sem excessos de mensagens. Apenas curadoria selecionada a cada 15 dias.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#2E1E14]/80 border border-[#C59B27]/25">
                <div className="p-2 rounded-lg bg-[#C59B27]/20 text-[#E8C547] shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF8F5]">10% OFF Inicial</h4>
                  <p className="text-[11px] text-[#D0C4B4] mt-0.5 leading-snug">
                    Cupom de boas-vindas liberado na confirmação da inscrição.
                  </p>
                </div>
              </div>
            </div>

            {/* Read Latest Edition Trigger */}
            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="inline-flex items-center gap-2 text-xs text-[#E8C547] hover:text-amber-200 transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ler prévia da última edição enviada (Edição nº 42)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Subscription Form or Subscribed State */}
          <div className="lg:col-span-6">
            {!isSubscribed ? (
              /* --- FORM STATE --- */
              <div className="bg-[#FAF8F5] text-[#2C1E14] rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[#C59B27] relative">
                {/* Vintage Wax Seal Element */}
                <div className="absolute -top-4 right-6 bg-gradient-to-br from-[#A02C1E] to-[#701E14] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#E8C547] shadow-lg flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-[#E8C547]" />
                  <span>Selo Estrada Real</span>
                </div>

                <div className="mb-5">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2C1E14] font-bold flex items-center gap-2">
                    <span>Receber as Notas</span>
                    <Feather className="w-5 h-5 text-[#C59B27]" />
                  </h3>
                  <p className="text-xs text-[#6B5A4E] mt-1">
                    Preencha seus dados para receber a próxima edição quinzenal e garantir seu cupom de 10% OFF.
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <span className="font-bold">Atenção:</span> {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#3D2719] mb-1">
                      Seu Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Mariana Silva"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5CCC0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C59B27] focus:border-[#C59B27] transition-all text-[#2C1E14] placeholder:text-[#A09386]"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#3D2719] mb-1">
                      E-mail Principal <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A796C]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mariana@exemplo.com.br"
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#D5CCC0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C59B27] focus:border-[#C59B27] transition-all text-[#2C1E14] placeholder:text-[#A09386]"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone / WhatsApp (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#3D2719]">
                        WhatsApp <span className="text-[11px] font-normal text-[#8A796C]">(Opcional para avisos de peças únicas)</span>
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A796C]">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(31) 99876-5432"
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#D5CCC0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C59B27] focus:border-[#C59B27] transition-all text-[#2C1E14] placeholder:text-[#A09386]"
                      />
                    </div>
                  </div>

                  {/* Interests Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#3D2719] mb-1.5">
                      Seus Interesses no Artesanato Mineiro:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {INTEREST_OPTIONS.map((item) => {
                        const isSelected = selectedInterests.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleInterest(item.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                              isSelected
                                ? 'bg-[#3D2719] text-[#E8C547] border-[#3D2719] shadow-xs'
                                : 'bg-[#EFE9DF] text-[#5A493D] border-[#D8CFC2] hover:bg-[#E5DDD0]'
                            }`}
                          >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                            {isSelected && <Check className="w-3 h-3 text-[#E8C547]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Frequency Notice & Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl font-serif text-sm font-bold text-[#1F140C] bg-gradient-to-r from-[#E8C547] via-[#D4A72C] to-[#B8860B] hover:from-[#F0D165] hover:to-[#C59B27] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#1F140C] border-t-transparent rounded-full animate-spin" />
                          <span>Registrando no Livro da Estrada Real...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#1F140C]" />
                          <span>Inscrever-se & Receber 10% OFF</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Privacy & Anti-Spam Guarantee */}
                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A6B5E] pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3D7A48]" />
                    <span>Envio quinzenal respeitoso. Seus dados nunca serão compartilhados.</span>
                  </div>
                </form>
              </div>
            ) : (
              /* --- SUBSCRIBED / SUCCESS STATE --- */
              <div className="bg-[#FAF8F5] text-[#2C1E14] rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[#C59B27] relative animate-fade-in">
                {/* Top Success Badge */}
                <div className="flex items-center gap-2 text-[#3D7A48] bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 text-xs font-bold mb-4">
                  <CheckCircle2 className="w-4 h-4 text-[#3D7A48] shrink-0" />
                  <span>Inscrição confirmada no Livro da Estrada Real!</span>
                </div>

                <h3 className="font-serif text-2xl text-[#2C1E14] font-bold">
                  Bem-vindo(a), {activeSubscriber?.name || 'Apreciador(a)'}!
                </h3>
                <p className="text-xs text-[#5A493D] mt-1.5 leading-relaxed">
                  Seu e-mail <strong className="text-[#2C1E14] font-semibold">{activeSubscriber?.email}</strong> está registrado para receber as <strong>Notas da Estrada Real</strong> a cada 15 dias.
                </p>

                {/* Welcome Gift / Coupon Certificate Box */}
                <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-[#FFF9EE] via-[#FDF3DE] to-[#F7E7C4] border-2 border-dashed border-[#C59B27] relative shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B2500] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      Cupom de Boas-Vindas da Curadoria
                    </span>
                    <span className="text-[10px] bg-[#C59B27]/20 text-[#70360D] font-bold px-2 py-0.5 rounded">
                      10% OFF
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-[#D5C29B]">
                    <div>
                      <span className="font-mono text-base sm:text-lg font-black text-[#70360D] tracking-widest block">
                        ESTRADAREAL10
                      </span>
                      <span className="text-[10px] text-[#8A796C]">
                        Válido para todo o catálogo colonial na sua primeira compra
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCoupon('ESTRADAREAL10')}
                      className="px-3 py-1.5 rounded-lg bg-[#3D2719] hover:bg-[#70360D] text-[#E8C547] text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                    >
                      {copiedCoupon ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Next Delivery Schedule & Preferences */}
                <div className="mt-4 p-3 rounded-xl bg-[#EFEAE1] border border-[#D8CEBF] text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[#4A3B30]">
                    <span className="font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                      Próxima edição estimada:
                    </span>
                    <span className="font-bold text-[#2C1E14]">Em até 15 dias</span>
                  </div>
                  <div className="flex items-center justify-between text-[#4A3B30]">
                    <span className="font-semibold flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#C59B27]" />
                      Frequência:
                    </span>
                    <span className="text-[#2C1E14]">Quinzenal (2x ao mês)</span>
                  </div>
                </div>

                {/* Subscribed Actions */}
                <div className="mt-5 flex items-center justify-between pt-2 border-t border-[#E5DDD0]">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="text-xs font-bold text-[#70360D] hover:text-[#B8860B] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Ver modelo da carta</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-[11px] text-[#8A796C] hover:text-[#2C1E14] underline cursor-pointer"
                  >
                    Cadastrar outro e-mail
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- PREVIEW MODAL OF PREVIOUS EDITION --- */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] text-[#2C1E14] w-full max-w-2xl rounded-2xl shadow-2xl border-4 border-[#C59B27] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#2C1E14] text-[#FAF8F5] p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#C59B27]">
              <div className="flex items-center gap-2">
                <Feather className="w-5 h-5 text-[#E8C547]" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#FAF8F5]">
                    Notas da Estrada Real • Prévia Quinzenal
                  </h3>
                  <span className="text-[11px] text-[#E8C547] block">
                    {PREVIEW_EDITION.title}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF8F5] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Parchment Newsletter Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed bg-[#FAF8F5]">
              <div className="flex items-center justify-between border-b border-[#D8CFC2] pb-3 text-xs text-[#7A6B5E]">
                <span>Curadoria: Equipe Mercado Ouro Preto</span>
                <span className="font-semibold text-[#2C1E14]">{PREVIEW_EDITION.date}</span>
              </div>

              <div className="p-3 bg-[#F2EDE4] rounded-xl border border-[#D5CABB]">
                <span className="text-xs font-bold text-[#70360D] uppercase tracking-wider block mb-1">
                  Artesão em Foco da Quinzena
                </span>
                <span className="text-sm font-serif font-bold text-[#2C1E14]">
                  {PREVIEW_EDITION.artisanSpotlight}
                </span>
              </div>

              <p className="text-[#3D2E24] leading-relaxed">
                {PREVIEW_EDITION.snippet}
              </p>

              <div className="space-y-2 pt-2">
                <h4 className="font-serif text-sm font-bold text-[#2C1E14] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C59B27]" />
                  Destaques desta edição para assinantes:
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {PREVIEW_EDITION.highlights.map((h, idx) => (
                    <li key={idx} className="text-xs text-[#5A493D] flex items-start gap-2">
                      <span className="text-[#C59B27] font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Artisan Quote */}
              <blockquote className="my-3 p-3.5 rounded-xl bg-amber-50/80 border-l-4 border-[#C59B27] text-xs italic text-[#6B4E1B]">
                &ldquo;A pedra-sabão não aceita pressa. O veio da rocha ensina a mão do artesão onde entalhar a curva e onde respeitar o silêncio da serra mineira.&rdquo;
                <footer className="text-[11px] font-bold text-[#2C1E14] not-italic mt-1">
                  — Mestre Jadir, Cachoeira do Campo
                </footer>
              </blockquote>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#EFE9DF] p-4 flex items-center justify-between border-t border-[#D5CCC0]">
              <span className="text-xs text-[#6B5A4E]">
                Gostou? Inscreva-se para receber as próximas a cada 15 dias.
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-[#2C1E14] hover:bg-[#4A3222] text-[#E8C547] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Fechar Prévia
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
