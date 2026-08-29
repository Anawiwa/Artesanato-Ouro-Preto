import React, { useState } from 'react';
import {
  ShieldCheck,
  Landmark,
  Leaf,
  MapPin,
  Award,
  Sparkles,
  Info,
  X,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { ProductCertification, CertificationType } from '../types';

interface ProductBadgesProps {
  certifications?: ProductCertification[];
  variant?: 'compact' | 'expanded' | 'banner' | 'pill-list';
  className?: string;
  maxDisplay?: number;
}

export const getBadgeConfig = (tipo: CertificationType) => {
  switch (tipo) {
    case 'iphan':
      return {
        icon: Landmark,
        labelPrefix: 'Certificação',
        bgLight: 'bg-[#FAF2E6]',
        border: 'border-[#D4A72C]',
        textColor: 'text-[#8B5A10]',
        badgeBg: 'bg-[#8B5A10]',
        badgeText: 'text-[#FFFDF9]',
        iconColor: 'text-[#C59B27]',
        glowColor: 'hover:shadow-[#C59B27]/20',
        title: 'Certificação IPHAN',
        subtitle: 'Instituto do Patrimônio Histórico e Artístico Nacional',
      };
    case 'indicacao_geografica':
      return {
        icon: MapPin,
        labelPrefix: 'Procedência',
        bgLight: 'bg-[#F4ECE4]',
        border: 'border-[#C85A32]',
        textColor: 'text-[#8B2500]',
        badgeBg: 'bg-[#8B2500]',
        badgeText: 'text-[#FFFDF9]',
        iconColor: 'text-[#C85A32]',
        glowColor: 'hover:shadow-[#C85A32]/20',
        title: 'Indicação Geográfica (IG)',
        subtitle: 'Reconhecimento Geográfico e Terroir de Minas Gerais',
      };
    case 'organico':
      return {
        icon: Leaf,
        labelPrefix: 'Pureza',
        bgLight: 'bg-[#EBF5EE]',
        border: 'border-[#4E8D5F]',
        textColor: 'text-[#235832]',
        badgeBg: 'bg-[#2E6B40]',
        badgeText: 'text-[#FFFDF9]',
        iconColor: 'text-[#2E6B40]',
        glowColor: 'hover:shadow-[#2E6B40]/20',
        title: '100% Orgânico & Mineral Puro',
        subtitle: 'Sem Aditivos Químicos, Pesticidas ou Metais Pesados',
      };
    case 'patrimonio_imaterial':
      return {
        icon: Award,
        labelPrefix: 'Tradição',
        bgLight: 'bg-[#F9F4EE]',
        border: 'border-[#A36A00]',
        textColor: 'text-[#70360D]',
        badgeBg: 'bg-[#70360D]',
        badgeText: 'text-[#FFFDF9]',
        iconColor: 'text-[#B8860B]',
        glowColor: 'hover:shadow-[#B8860B]/20',
        title: 'Patrimônio Cultural Imaterial',
        subtitle: 'Salvaguarda de Saberes e Modos de Fazer Tradicionais',
      };
    case 'artesanato_manual':
    default:
      return {
        icon: Sparkles,
        labelPrefix: 'Ofício',
        bgLight: 'bg-[#F6F4F0]',
        border: 'border-[#B8A38B]',
        textColor: 'text-[#5C4533]',
        badgeBg: 'bg-[#5C4533]',
        badgeText: 'text-[#FFFDF9]',
        iconColor: 'text-[#8C6D52]',
        glowColor: 'hover:shadow-stone-300',
        title: 'Manufatura 100% Manual',
        subtitle: 'Talhado ou Forjado sem Processos Industriais',
      };
  }
};

export const ProductBadges: React.FC<ProductBadgesProps> = ({
  certifications,
  variant = 'compact',
  className = '',
  maxDisplay = 3,
}) => {
  const [selectedCert, setSelectedCert] = useState<ProductCertification | null>(null);

  if (!certifications || certifications.length === 0) return null;

  const displayList = certifications.slice(0, maxDisplay);
  const remainingCount = certifications.length - maxDisplay;

  // COMPACT VARIANT (Used on Grid Cards)
  if (variant === 'compact') {
    return (
      <>
        <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
          {displayList.map((cert, index) => {
            const config = getBadgeConfig(cert.tipo);
            const Icon = config.icon;

            return (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCert(cert);
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer select-none ${config.bgLight} ${config.border} ${config.textColor} ${config.glowColor} hover:scale-[1.02] shadow-2xs`}
                title={`${cert.nome} - Clique para ver detalhes da autenticidade`}
              >
                <Icon className={`w-3 h-3 shrink-0 ${config.iconColor}`} />
                <span className="truncate max-w-[150px]">{cert.nome}</span>
              </button>
            );
          })}

          {remainingCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCert(certifications[maxDisplay]);
              }}
              className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 border border-stone-300 text-stone-700 hover:bg-stone-200 cursor-pointer"
            >
              +{remainingCount}
            </button>
          )}
        </div>

        {/* Modal for Certification Details */}
        {selectedCert && (
          <CertificationModal
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </>
    );
  }

  // PILL LIST VARIANT (Used in product summaries / Buy Box)
  if (variant === 'pill-list') {
    return (
      <>
        <div className={`space-y-1.5 ${className}`}>
          {certifications.map((cert, index) => {
            const config = getBadgeConfig(cert.tipo);
            const Icon = config.icon;

            return (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCert(cert);
                }}
                className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all hover:shadow-xs ${config.bgLight} ${config.border}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md ${config.badgeBg} text-white`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className={`font-bold block ${config.textColor}`}>
                      {cert.nome}
                    </span>
                    {cert.subtexto && (
                      <span className="text-[10px] text-stone-600 block leading-tight">
                        {cert.subtexto}
                      </span>
                    )}
                  </div>
                </div>
                {cert.regId && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/80 border border-stone-200 text-stone-700">
                    {cert.regId}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {selectedCert && (
          <CertificationModal
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </>
    );
  }

  // EXPANDED / BANNER VARIANT (Used on Product Detail Pages)
  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
        {certifications.map((cert, index) => {
          const config = getBadgeConfig(cert.tipo);
          const Icon = config.icon;

          return (
            <div
              key={index}
              onClick={() => setSelectedCert(cert)}
              className={`p-3.5 rounded-xl border ${config.bgLight} ${config.border} shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${config.textColor}`}>
                    <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                    {config.labelPrefix}
                  </span>
                  {cert.regId && (
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-stone-200 text-[#2C1E14]">
                      {cert.regId}
                    </span>
                  )}
                </div>
                <h4 className={`font-serif font-bold text-xs ${config.textColor} leading-snug`}>
                  {cert.nome}
                </h4>
                {cert.subtexto && (
                  <p className="text-[11px] text-[#4A3B30] mt-1 leading-relaxed">
                    {cert.subtexto}
                  </p>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-stone-500">
                <span className="flex items-center gap-1 font-semibold text-[#2C1E14]">
                  <CheckCircle2 className="w-3 h-3 text-[#2E6B40]" />
                  Verificado & Autêntico
                </span>
                <span className="text-[#8B5A10] font-bold hover:underline">Ver Termo</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCert && (
        <CertificationModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </>
  );
};

// MODAL FOR DISPLAYING OFFICIAL CERTIFICATION AUDIT DETAILS
interface CertificationModalProps {
  cert: ProductCertification;
  onClose: () => void;
}

const CertificationModal: React.FC<CertificationModalProps> = ({ cert, onClose }) => {
  const config = getBadgeConfig(cert.tipo);
  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] text-[#2C1E14] w-full max-w-lg rounded-2xl border-2 border-[#C59B27] shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E5DDD0] pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${config.badgeBg} text-white shadow-md`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${config.textColor}`}>
                {config.title}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#2C1E14] leading-tight">
                {cert.nome}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-stone-200/60 hover:bg-stone-300 text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="py-4 space-y-3.5 text-xs text-[#4A3B30] leading-relaxed">
          <div className="p-3 bg-white rounded-xl border border-[#E5DDD0] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Garantia de Procedência e Qualidade
            </span>
            <p className="text-stone-800">
              {cert.subtexto || config.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg bg-[#FAF2E6] border border-[#E0D3C0]">
              <span className="text-stone-500 block text-[9px] font-bold uppercase">Registro Oficial:</span>
              <strong className="font-mono text-[#8B2500] text-xs">
                {cert.regId || 'REG-IPHAN-MG-842'}
              </strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FAF2E6] border border-[#E0D3C0]">
              <span className="text-stone-500 block text-[9px] font-bold uppercase">Entidade Certificadora:</span>
              <strong className="text-[#2C1E14]">
                {cert.tipo === 'iphan' ? 'IPHAN / MinC' : cert.tipo === 'indicacao_geografica' ? 'INPI • Estrada Real' : 'Assoc. Artesãos MG'}
              </strong>
            </div>
          </div>

          <p className="text-[11px] text-stone-600 italic">
            Este selo atesta que a matéria-prima e as técnicas de confecção respeitam os cânones barrocos e gastronômicos de Ouro Preto e da Estrada Real, proibindo réplicas sintéticas ou industriais.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E5DDD0] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#2E6B40] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Autenticidade Homologada</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2C1E14] hover:bg-[#3D2B1E] text-[#E8C547] text-xs font-bold transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
