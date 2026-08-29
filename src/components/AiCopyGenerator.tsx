import React, { useState } from 'react';
import { Sparkles, Loader2, Feather, Check, Copy, ArrowRight, ShoppingBag } from 'lucide-react';

export const AiCopyGenerator: React.FC = () => {
  const [productName, setProductName] = useState('Cachaça Envelhecida em Bálsamo de Ouro Preto');
  const [productCategory, setCategory] = useState('Bebidas Artesanais');
  const [targetAudience, setAudience] = useState('Apreciadores de destilados nobres e gastronomia mineira');
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedData(null);

    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, productCategory, targetAudience }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Falha ao gerar cópia via Gemini API');
      }

      setGeneratedData(json.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar ao serviço Gemini 3.6 Flash.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedData) return;
    const text = `PRODUTO: ${productName}
TAGLINE: ${generatedData.tagline}
PREÇO SUGERIDO: R$ ${generatedData.suggestedPrice}

BULLET POINTS:
${generatedData.bulletPoints?.join('\n\n')}

DESCRIÇÃO SEO:
${generatedData.description}

TAGS SEO:
${generatedData.seoKeywords?.join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-[#FDFBF7] py-8 px-4 font-sans text-[#2D3033]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#C59B27]/15 text-[#70360D] text-xs font-bold px-3 py-1 rounded-full border border-[#C59B27]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Gerador Inteligente de Anúncios</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D3033]">
            Crie Anúncios Amazon de Ouro Preto com Inteligência Artificial
          </h2>
          <p className="text-xs sm:text-sm text-[#3A3D40]/80 max-w-xl mx-auto">
            Digite qualquer produto artesanal mineiro para gerar automaticamente a estrutura Amazon: 5 Bullet Points em caixa alta, descrição SEO, preço sugerido e taglines.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="bg-white rounded-2xl p-6 border border-[#3A3D40]/15 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3A3D40] mb-1">
                Nome do Produto Artesanal:
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Tapete Arraiolos Feito à Mão..."
                className="w-full bg-[#F8F5EE] border border-[#3A3D40]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#2D3033] font-medium outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A3D40] mb-1">
                Categoria do Artesanato:
              </label>
              <input
                type="text"
                value={productCategory}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Têxtil Colonial, Doces, Cachaça..."
                className="w-full bg-[#F8F5EE] border border-[#3A3D40]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#2D3033] font-medium outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3A3D40] mb-1">
              Público Alvo / Foco Comercial:
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Ex: Amantes de decoração rústica e peças históricas..."
              className="w-full bg-[#F8F5EE] border border-[#3A3D40]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#2D3033] font-medium outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C59B27] hover:bg-[#b38a1f] text-[#1A1810] py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando com Gemini 3.6 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Gerar Copywriting Amazon & Bullet Points</span>
              </>
            )}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#C85A32]/10 border border-[#C85A32]/40 rounded-xl p-4 text-xs text-[#C85A32] font-bold">
            ⚠️ {error}
          </div>
        )}

        {/* Generated Result Display */}
        {generatedData && (
          <div className="bg-white rounded-2xl p-6 border border-[#3A3D40]/15 shadow-xl space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#3A3D40]/10 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C59B27]" />
                <h3 className="font-extrabold text-base text-[#2D3033]">
                  Anúncio Gerado para: {productName}
                </h3>
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#2D3033] hover:bg-[#1E2022] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#C59B27]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar Anúncio'}
              </button>
            </div>

            {/* Price & Tagline Badge */}
            <div className="bg-[#F8F5EE] p-4 rounded-xl border border-[#3A3D40]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[#70360D] font-bold block">Tagline Comercial:</span>
                <span className="text-[#2D3033] font-medium">{generatedData.tagline}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-stone-400 text-[10px] block">Preço Sugerido:</span>
                <span className="text-lg font-black text-[#70360D]">
                  R$ {Number(generatedData.suggestedPrice || 149.9).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Generated Bullet Points */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#70360D] uppercase tracking-wider flex items-center gap-1">
                <Feather className="w-4 h-4 text-[#C59B27]" />
                5 Bullet Points Amazon:
              </h4>
              <ul className="space-y-2.5 text-xs text-[#2D3033]">
                {generatedData.bulletPoints?.map((bp: string, i: number) => (
                  <li key={i} className="bg-[#FDFBF7] p-3 rounded-lg border border-[#3A3D40]/10 flex items-start gap-2">
                    <span className="text-[#C59B27] font-bold">✓</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Generated SEO Description */}
            <div className="space-y-2 pt-2 border-t border-[#3A3D40]/10 text-xs">
              <h4 className="font-extrabold text-[#2D3033]">Descrição Persuasiva e Focada em SEO:</h4>
              <p className="text-[#3A3D40] leading-relaxed whitespace-pre-line bg-[#F8F5EE] p-4 rounded-xl border border-[#3A3D40]/10">
                {generatedData.description}
              </p>
            </div>

            {/* Keywords */}
            {generatedData.seoKeywords?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs pt-2">
                <span className="font-bold text-[#70360D]">Palavras-chave SEO:</span>
                {generatedData.seoKeywords.map((kw: string, i: number) => (
                  <span key={i} className="bg-[#C59B27]/15 text-[#70360D] font-semibold text-[10px] px-2 py-0.5 rounded">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
