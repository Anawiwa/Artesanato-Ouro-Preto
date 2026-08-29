import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Eye, Maximize2, RotateCw } from 'lucide-react';

interface ParallaxGalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  heightClass?: string;
  category?: string;
  badge?: string;
  onClick?: () => void;
  showRotateBtn?: boolean;
  onRotateClick?: (e: React.MouseEvent) => void;
  isRotating?: boolean;
  galleryStyle?: 'colonial_pedestal' | 'framed_gallery' | 'clean_minimal';
  intensity?: number; // tilt intensity multiplier (default 1.0)
}

export const ParallaxGalleryImage: React.FC<ParallaxGalleryImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  heightClass = 'h-48',
  category,
  badge,
  onClick,
  showRotateBtn = false,
  onRotateClick,
  isRotating = false,
  galleryStyle = 'colonial_pedestal',
  intensity = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [coords, setCoords] = useState<{
    rotateX: number;
    rotateY: number;
    translateX: number;
    translateY: number;
    sheenX: number;
    sheenY: number;
    sheenOpacity: number;
  }>({
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
    sheenX: 50,
    sheenY: 50,
    sheenOpacity: 0,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Relative mouse position from -1 to 1 (center is 0)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Maximum degrees of tilt (baroque perspective)
      const maxRotate = 10 * intensity;
      const maxTranslate = 8 * intensity;

      // Percentage for radial light sheen
      const sheenX = ((e.clientX - rect.left) / rect.width) * 100;
      const sheenY = ((e.clientY - rect.top) / rect.height) * 100;

      setCoords({
        rotateX: -y * maxRotate,
        rotateY: x * maxRotate,
        translateX: x * maxTranslate,
        translateY: y * maxTranslate,
        sheenX,
        sheenY,
        sheenOpacity: 0.65,
      });
    },
    [intensity]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({
      rotateX: 0,
      rotateY: 0,
      translateX: 0,
      translateY: 0,
      sheenX: 50,
      sheenY: 50,
      sheenOpacity: 0,
    });
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden cursor-pointer select-none group/gallery transition-all duration-500 ${containerClassName}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 1. Base Layer: Historical Gallery Pedestal & Lighting Vignette */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          galleryStyle === 'colonial_pedestal'
            ? 'bg-gradient-to-b from-[#FAF8F5] via-[#F3EDE2] to-[#E5DDD0]'
            : galleryStyle === 'framed_gallery'
            ? 'bg-gradient-to-br from-[#2C1E14] via-[#3E2B1E] to-[#20140D]'
            : 'bg-gradient-to-b from-stone-50 to-stone-200'
        }`}
      >
        {/* Subtle colonial architectural grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#70360D 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Gallery Spotlight Glow at the base */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-xl transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'opacity-80 bg-[#C59B27]/25' : 'opacity-40 bg-stone-400/20'
          }`}
        />
      </div>

      {/* 2. Floating Parallax Content Layer (3D Transform Container) */}
      <div
        className="w-full h-full p-3 flex items-center justify-center relative transition-transform ease-out will-change-transform"
        style={{
          transform: isHovered
            ? `rotateX(${coords.rotateX.toFixed(2)}deg) rotateY(${coords.rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transitionDuration: isHovered ? '120ms' : '600ms',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Cast Shadow beneath artifact */}
        <div
          className="absolute bottom-4 w-4/5 h-6 rounded-full bg-black/20 blur-md transition-all duration-300 pointer-events-none"
          style={{
            transform: isHovered
              ? `translateX(${-coords.translateX * 1.5}px) translateY(${coords.translateY * 0.5}px) scale(${1 - coords.translateY * 0.02})`
              : 'translateX(0px) translateY(0px) scale(1)',
            opacity: isHovered ? 0.35 : 0.2,
          }}
        />

        {/* Main Product Image with Parallax Depth Shift */}
        <div
          className={`w-full h-full flex items-center justify-center transition-all ${
            isRotating ? 'animate-[spin_1.5s_cubic-bezier(0.4,0,0.2,1)]' : ''
          }`}
          style={{
            transform: isHovered
              ? `translate3d(${coords.translateX.toFixed(2)}px, ${coords.translateY.toFixed(2)}px, 35px)`
              : 'translate3d(0px, 0px, 0px)',
            transition: isHovered ? 'transform 120ms ease-out' : 'transform 600ms ease-out',
          }}
        >
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`max-w-full max-h-full object-contain filter drop-shadow-md transition-all duration-500 ${className}`}
          />
        </div>

        {/* 3. Baroque Specular Light Sheen (Reflexo de Galeria Ouro Preto) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 mix-blend-soft-light"
          style={{
            background: isHovered
              ? `radial-gradient(circle 180px at ${coords.sheenX}% ${coords.sheenY}%, rgba(255, 245, 210, ${coords.sheenOpacity}), rgba(232, 197, 71, ${coords.sheenOpacity * 0.4}) 35%, transparent 75%)`
              : 'none',
            opacity: coords.sheenOpacity,
          }}
        />
      </div>

      {/* 4. Museum Gold Filigree Frame Accents on Hover */}
      <div
        className={`absolute inset-0 rounded-2xl border pointer-events-none transition-all duration-500 ${
          isHovered
            ? 'border-[#C59B27]/60 shadow-[inset_0_0_15px_rgba(197,155,39,0.12)]'
            : 'border-[#C59B27]/20 shadow-none'
        }`}
      >
        {/* Subtle Baroque Corner Marks */}
        <div
          className={`absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-[#C59B27] transition-opacity duration-300 ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-[#C59B27] transition-opacity duration-300 ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-[#C59B27] transition-opacity duration-300 ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-[#C59B27] transition-opacity duration-300 ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
        />
      </div>

      {/* 5. Optional Gallery Badge / Label */}
      {badge && (
        <div className="absolute top-2 left-2 z-10 bg-[#1A1810]/85 text-amber-200 backdrop-blur-xs text-[9px] font-bold px-2 py-0.5 rounded-md border border-[#C59B27]/40 shadow-xs flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-[#E8C547]" />
          <span>{badge}</span>
        </div>
      )}

      {/* 6. Quick Action Controls (360 Spin or Gallery Zoom Indicator) */}
      <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 opacity-80 group-hover/gallery:opacity-100 transition-opacity">
        {showRotateBtn && onRotateClick && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRotateClick(e);
            }}
            className="bg-[#1A1810]/85 hover:bg-[#70360D] text-amber-200 hover:text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-[#C59B27]/40 shadow-md backdrop-blur-xs flex items-center gap-1 transition-all cursor-pointer"
            title="Girar 360° no Ateliê"
          >
            <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">360°</span>
          </button>
        )}

        <div
          className={`px-1.5 py-1 rounded-lg bg-[#1A1810]/80 text-[#E8C547] text-[10px] backdrop-blur-xs border border-[#C59B27]/30 transition-all duration-300 flex items-center gap-1 ${
            isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
          title="Perspectiva de Galeria Mineira Ativa"
        >
          <Eye className="w-3 h-3" />
          <span className="text-[9px] font-serif font-bold">Galeria</span>
        </div>
      </div>
    </div>
  );
};
