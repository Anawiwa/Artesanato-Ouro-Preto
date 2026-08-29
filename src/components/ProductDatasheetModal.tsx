import React, { useState } from 'react';
import {
  Printer,
  X,
  Award,
  ShieldCheck,
  Check,
  Copy,
  Download,
  Calendar,
  MapPin,
  Sparkles,
  FileText,
  HeartHandshake,
  Feather,
  QrCode,
} from 'lucide-react';
import { Product } from '../types';

interface ProductDatasheetModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDatasheetModal: React.FC<ProductDatasheetModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const certificateId = `OP-CERT-${product.id.replace(/\D/g, '').padStart(4, '0') || '2026'}-${new Date().getFullYear()}`;
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedPrice = product.preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const originalPrice = product.preco_original
    ? product.preco_original.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : null;
  const installmentValue = (product.preco / 6).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // Fallback if print is restricted
    }
  };

  const handleCopyText = () => {
    const text = `=====================================================
CERTIFICADO DE AUTENTICIDADE E FICHA TÉCNICA
MERCADO COLONIAL DE OURO PRETO - ESTRADA REAL
=====================================================
Registro: ${certificateId}
Emissão: ${currentDate}

PRODUTO: ${product.titulo}
SUBTÍTULO: ${product.subtitulo}
CATEGORIA: ${product.categoria}
ORIGEM: ${product.cidade || 'Ouro Preto, Minas Gerais'}
MESTRE ARTESÃO: ${product.artesao}
ATELIÊ: ${product.atelie || 'Ateliê Histórico'}

VALORES:
- Preço Oficial: ${formattedPrice} (ou em até 6x de ${installmentValue} sem juros)
${originalPrice ? `- Preço de Tabela Anterior: ${originalPrice}` : ''}
${product.desconto_percentual ? `- Desconto Aplicado: ${product.desconto_percentual}% OFF` : ''}

DESTAQUES E CARACTERÍSTICAS DA TRADIÇÃO:
${product.bullet_points.map((bp) => `• ${bp.replace(/\*\*/g, '')}`).join('\n')}

DESCRIÇÃO E HISTÓRICO:
${product.descricao_detalhada}

ESPECIFICAÇÕES TÉCNICAS:
${Object.entries(product.especificacoes)
  .map(([k, v]) => `• ${k}: ${v}`)
  .join('\n')}

AUTENTICIDADE:
Selo IPHAN nº 842 - Procedência mineral e gastronômica certificada.
Preservação das técnicas manuais do barroco mineiro secular.
=====================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="relative bg-[#FAF8F5] text-[#2C1E14] w-full max-w-4xl rounded-2xl shadow-2xl border-4 border-[#C59B27] flex flex-col max-h-[94vh] print:max-h-none print:border-0 print:shadow-none print:rounded-none overflow-hidden animate-fadeIn">
        
        {/* ACTION CONTROLS BAR (Hidden on Print) */}
        <div className="bg-[#241710] text-[#FAF8F5] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#C59B27] print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#E8C547]" />
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#FAF8F5] leading-tight">
                Ficha Técnica & Certificado de Autenticidade
              </h3>
              <span className="text-[10px] text-[#E8C547]">
                Documento oficial para impressão ou arquivo digital
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-[#3D2719] hover:bg-[#523522] text-[#E8C547] text-xs font-semibold border border-[#C59B27]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E8C547] to-[#C59B27] hover:from-[#F0D165] hover:to-[#D4A72C] text-[#1A1810] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#1A1810]" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF8F5] transition-colors cursor-pointer ml-1"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE & TECHNICAL SHEET CANVAS */}
        <div
          id="printable-datasheet"
          className="p-6 sm:p-10 overflow-y-auto print:overflow-visible bg-[#FAF8F5] text-[#2C1E14] space-y-6 print:p-6"
        >
          {/* Certificate Header Banner */}
          <div className="relative border-4 border-double border-[#C59B27] p-6 rounded-xl bg-[#FFFDF9] shadow-inner text-center">
            {/* Corner Filigrees */}
            <div className="absolute top-2 left-2 text-[#C59B27] text-xs font-serif select-none">✦</div>
            <div className="absolute top-2 right-2 text-[#C59B27] text-xs font-serif select-none">✦</div>
            <div className="absolute bottom-2 left-2 text-[#C59B27] text-xs font-serif select-none">✦</div>
            <div className="absolute bottom-2 right-2 text-[#C59B27] text-xs font-serif select-none">✦</div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <Feather className="w-4 h-4 text-[#B8860B]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#8B2500]">
                Mercado Colonial de Ouro Preto • Estrada Real
              </span>
              <Feather className="w-4 h-4 text-[#B8860B] -scale-x-100" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241710] tracking-tight">
              Certificado de Autenticidade & Ficha Técnica
            </h1>
            <p className="text-xs text-[#6B5A4E] mt-1 italic">
              Documento emitido para atestar a procedência mineral, culinária e artística das Minas Gerais
            </p>

            <div className="mt-4 pt-3 border-t border-[#E5DDD0] flex flex-wrap items-center justify-between text-xs text-[#5A493D] gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#241710]">Registro de Autenticidade:</span>
                <span className="font-mono bg-[#EFE9DF] px-2 py-0.5 rounded border border-[#D5CCC0] text-[#8B2500] font-bold">
                  {certificateId}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Emissão: <strong className="text-[#241710]">{currentDate}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-[#2E6B40] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Selo IPHAN nº 842</span>
              </div>
            </div>
          </div>

          {/* Product Hero: Image, Title & Commercial Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-xs">
            {/* Product Image */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative w-full aspect-square max-h-56 bg-[#FAF8F5] rounded-xl border-2 border-[#D8CFC2] p-3 flex items-center justify-center overflow-hidden">
                <img
                  src={product.imagem_url}
                  alt={product.titulo}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-[#241710] text-[#E8C547] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#C59B27]">
                  {product.categoria}
                </div>
              </div>
              <span className="text-[10px] text-stone-500 mt-2 text-center">
                Registro Fotográfico Oficial do Acervo
              </span>
            </div>

            {/* Product Meta & Pricing */}
            <div className="md:col-span-8 space-y-3">
              <div>
                <span className="text-[11px] font-bold text-[#C59B27] uppercase tracking-wider block">
                  {product.categoria} • Origem: {product.cidade || 'Ouro Preto, MG'}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#241710] leading-snug">
                  {product.titulo}
                </h2>
                <p className="text-xs text-stone-600 italic mt-0.5">
                  {product.subtitulo}
                </p>
              </div>

              {/* Artisan & Workshop Badge */}
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E1D5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#3D2719] text-[#E8C547] flex items-center justify-center font-bold text-xs font-serif shrink-0">
                    {product.artesao.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-[#241710] block">{product.artesao}</span>
                    <span className="text-[11px] text-[#70360D]">{product.atelie || 'Ateliê Colonial'} • {product.cidade || 'Ouro Preto'}</span>
                  </div>
                </div>
                <span className="bg-[#2E6B40]/10 text-[#2E6B40] font-bold text-[10px] px-2 py-1 rounded">
                  Ofício Tradicional 100% Manual
                </span>
              </div>

              {/* Price & Commercial Values */}
              <div className="flex flex-wrap items-baseline gap-3 pt-1 border-t border-stone-100">
                <div>
                  <span className="text-xs text-stone-500 block">Preço de Referência:</span>
                  <span className="text-2xl font-serif font-black text-[#8B2500]">
                    {formattedPrice}
                  </span>
                </div>
                {originalPrice && (
                  <div>
                    <span className="text-xs text-stone-400 block">Preço sem Curadoria:</span>
                    <span className="text-sm text-stone-400 line-through">{originalPrice}</span>
                  </div>
                )}
                <div className="ml-auto text-right">
                  <span className="text-xs text-stone-500 block">Condição de Pagamento:</span>
                  <span className="text-xs font-bold text-[#241710]">
                    6x de {installmentValue} sem juros
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bullet Points: Destaques da Tradição (Amazon Standard) */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#70360D] flex items-center gap-2 border-b border-stone-100 pb-2">
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
              Destaques e Características da Tradição (Bullet Points)
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-[#3D2E24]">
              {product.bullet_points.map((bp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#C59B27] font-black text-sm shrink-0">✦</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: bp.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="font-bold text-[#241710]">$1</strong>'
                      ),
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications Table */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#70360D] flex items-center gap-2 border-b border-stone-100 pb-2">
              <FileText className="w-4 h-4 text-[#C59B27]" />
              Especificações Técnicas & Propriedades
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.especificacoes).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E5DDD0]"
                >
                  <span className="font-semibold text-[#5A493D]">{key}:</span>
                  <span className="font-bold text-[#241710] text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Narrative Description */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#70360D] border-b border-stone-100 pb-2">
              Contexto Histórico & Descrição do Acervo
            </h3>
            <p className="text-xs text-[#4A3B30] leading-relaxed">
              {product.descricao_detalhada}
            </p>
          </div>

          {/* Authenticity Pledge, Seals & Signatures */}
          <div className="p-5 rounded-xl bg-[#F4EFEA] border-2 border-[#D5CABB] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#70360D] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#2E6B40]" />
              <span>Termo de Autenticidade e Garantia de Procedência</span>
            </div>
            
            <p className="text-[11px] text-[#5A493D] leading-relaxed">
              Declaramos para os devidos fins que a peça descrita nesta ficha técnica é genuinamente artesanal, confeccionada com matérias-primas nobres (esteatito mineral / cobre martelado / leite puro de fazenda) nos distritos históricos da Estrada Real em Minas Gerais, respeitando as normas de patrimônio e a sustentabilidade das pedreiras e ateliês familiares.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#D8CEBF] items-end text-center">
              {/* Signature 1 */}
              <div className="space-y-1">
                <div className="h-9 border-b border-stone-400 font-serif italic text-xs text-stone-600 flex items-end justify-center pb-1">
                  {product.artesao}
                </div>
                <span className="text-[10px] font-bold text-[#241710] block">
                  Mestre Artesão Responsável
                </span>
                <span className="text-[9px] text-[#7A6B5E]">Ateliê Ouro Preto</span>
              </div>

              {/* Central Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#C59B27] bg-[#FAF8F5] flex flex-col items-center justify-center text-center p-1 shadow-inner">
                  <Award className="w-5 h-5 text-[#8B2500]" />
                  <span className="text-[7px] font-extrabold text-[#70360D] uppercase tracking-tighter mt-0.5">
                    AUTÊNTICO MG
                  </span>
                </div>
                <span className="text-[9px] font-bold text-[#8B2500] mt-1">
                  Selo de Origem Mineral
                </span>
              </div>

              {/* Signature 2 */}
              <div className="space-y-1">
                <div className="h-9 border-b border-stone-400 font-serif italic text-xs text-stone-600 flex items-end justify-center pb-1">
                  Curadoria Mercado Ouro Preto
                </div>
                <span className="text-[10px] font-bold text-[#241710] block">
                  Conselho de Mestres & Acervo
                </span>
                <span className="text-[9px] text-[#7A6B5E]">Estrada Real • IPHAN</span>
              </div>
            </div>
          </div>

          {/* Verification Code Footer */}
          <div className="text-center pt-2 pb-1 text-[10px] text-[#8A796C] flex items-center justify-center gap-2">
            <span>Certificado emitido digitalmente sob a chave:</span>
            <code className="font-mono text-[#70360D] bg-[#EFE9DF] px-2 py-0.5 rounded font-bold">
              {certificateId}
            </code>
          </div>
        </div>

      </div>
    </div>
  );
};
