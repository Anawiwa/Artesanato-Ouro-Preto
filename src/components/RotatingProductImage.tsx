import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCw, Play, Pause, Compass, Maximize2, Sparkles, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RotatingProductImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  heightClass?: string;
  showControls?: boolean;
  autoRotateDefault?: boolean;
  badgeText?: string;
  interactiveDrag?: boolean;
}

export const RotatingProductImage: React.FC<RotatingProductImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  heightClass = 'h-72',
  showControls = true,
  autoRotateDefault = false,
  badgeText = 'Giro 360° Interativo',
  interactiveDrag = true,
}) => {
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(autoRotateDefault);
  const [rotationY, setRotationY] = useState<number>(0);
  const [rotationX, setRotationX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showHint, setShowHint] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number>(0);
  const dragStartRotYRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Speed multiplier
  const speedDegreesPerFrame = speed === 'slow' ? 0.35 : speed === 'normal' ? 0.7 : 1.4;

  // Auto rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    let currentRot = rotationY;
    const animate = () => {
      currentRot = (currentRot + speedDegreesPerFrame) % 360;
      setRotationY(currentRot);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoRotating, isDragging, speedDegreesPerFrame]);

  // Hide hint after first interaction
  const handleInteractionStart = () => {
    if (showHint) setShowHint(false);
  };

  // Drag handling (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactiveDrag) return;
    handleInteractionStart();
    setIsDragging(true);
    setIsAutoRotating(false);
    dragStartXRef.current = e.clientX;
    dragStartRotYRef.current = rotationY;
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartXRef.current;
      // 0.8 degree per pixel dragged
      const newRotY = (dragStartRotYRef.current + deltaX * 0.8) % 360;
      setRotationY(newRotY < 0 ? 360 + newRotY : newRotY);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handling (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactiveDrag) return;
    handleInteractionStart();
    setIsDragging(true);
    setIsAutoRotating(false);
    dragStartXRef.current = e.touches[0].clientX;
    dragStartRotYRef.current = rotationY;
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      const deltaX = e.touches[0].clientX - dragStartXRef.current;
      const newRotY = (dragStartRotYRef.current + deltaX * 0.8) % 360;
      setRotationY(newRotY < 0 ? 360 + newRotY : newRotY);
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse & touch listeners for smooth drag outside container
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Subtle parallax tilt & shift when hovering with mouse without dragging
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number; cursorX: number; cursorY: number }>({
    x: 0,
    y: 0,
    cursorX: 50,
    cursorY: 50,
  });

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;
    
    const tiltX = normY * -8; // max 8 deg tilt
    setRotationX(tiltX);
    setParallaxOffset({
      x: normX * 10,
      y: normY * 10,
      cursorX: (x / rect.width) * 100,
      cursorY: (y / rect.height) * 100,
    });
  };

  const handleContainerMouseLeave = () => {
    setIsHovered(false);
    setRotationX(0);
    setParallaxOffset({ x: 0, y: 0, cursorX: 50, cursorY: 50 });
  };

  // Preset angle setters
  const setPresetAngle = (deg: number) => {
    handleInteractionStart();
    setIsAutoRotating(false);
    setRotationY(deg);
  };

  // Calculate light glare position based on angle & cursor
  const normalizedAngle = ((rotationY % 360) + 360) % 360;
  const glareOpacity = isHovered 
    ? 0.55 
    : Math.abs(Math.sin((normalizedAngle * Math.PI) / 180)) * 0.35;
  const glareX = isHovered 
    ? parallaxOffset.cursorX 
    : ((Math.sin((normalizedAngle * Math.PI) / 180) + 1) / 2) * 100;
  const glareY = isHovered ? parallaxOffset.cursorY : 40;

  return (
    <div
      ref={containerRef}
      className={`relative group select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#FAF8F5] via-white to-[#EAE4D9] border border-[#E5E0D8] shadow-sm transition-all duration-500 hover:border-[#C59B27]/60 hover:shadow-md ${containerClassName}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMouseLeave}
    >
      {/* 3D Perspective Stage Container */}
      <div
        className={`w-full ${heightClass} flex items-center justify-center p-4 cursor-grab active:cursor-grabbing relative overflow-hidden`}
        style={{ perspective: '1200px' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Animated Background Pedestal Ring (Colonial Gallery Spotlight) */}
        <div 
          className="absolute inset-x-8 bottom-4 h-14 rounded-[50%] bg-gradient-to-t from-stone-400/20 via-[#B8860B]/15 to-transparent blur-md pointer-events-none transition-all duration-300"
          style={{
            transform: isHovered
              ? `translateX(${-parallaxOffset.x * 0.8}px) scale(${1.05})`
              : 'translateX(0px) scale(1)',
          }}
        />

        {/* 3D Rotating Mesh Layer with Parallax Translation */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg) translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0px) scale(${isHovered ? 1.04 : 1})`,
            transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.2,0,0.2,1)',
          }}
        >
          {/* Main Product Image with Dynamic Lighting Reflection */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={src}
              alt={alt}
              draggable={false}
              referrerPolicy="no-referrer"
              className={`max-h-full max-w-full object-contain filter drop-shadow-xl pointer-events-none transition-all duration-300 ${className}`}
            />

            {/* Dynamic 3D Glare / Sheen effect simulating gallery lighting on mineral/soapstone */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-soft-light transition-opacity duration-300"
              style={{
                opacity: glareOpacity,
                background: `radial-gradient(circle 200px at ${glareX}% ${glareY}%, rgba(255,245,210,0.95) 0%, rgba(232,197,71,0.4) 35%, transparent 75%)`,
              }}
            />
          </div>
        </div>

        {/* Floating 3D Badge Indicator */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#1A1810]/85 backdrop-blur-md text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md pointer-events-none">
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span>{badgeText}</span>
          <span className="bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded text-[10px] font-mono ml-0.5">
            {Math.round(normalizedAngle)}°
          </span>
        </div>

        {/* Hint on First View */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 bg-black/75 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-medium shadow-lg flex items-center gap-1.5 pointer-events-none"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Arraste para girar 360° ou use o auto-giro</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Controls Bar */}
      {showControls && (
        <div className="bg-[#FAF7F2] border-t border-[#E5E0D8] p-2.5 px-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Play/Pause Auto-Spin Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                handleInteractionStart();
                setIsAutoRotating(!isAutoRotating);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer shadow-sm ${
                isAutoRotating
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
                  : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-300 hover:border-amber-400'
              }`}
              title={isAutoRotating ? 'Pausar giro automático' : 'Iniciar giro automático 360°'}
            >
              {isAutoRotating ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-amber-600" />
                  <span>Girar 360°</span>
                </>
              )}
            </button>

            {/* Reset to 0° */}
            <button
              onClick={() => setPresetAngle(0)}
              className="p-1.5 bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 rounded-xl transition-colors cursor-pointer"
              title="Voltar à visão frontal (0°)"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Angles Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-stone-500 font-semibold mr-1 hidden sm:inline">Ângulo:</span>
            {[
              { label: 'Frente', deg: 0 },
              { label: '45°', deg: 45 },
              { label: '90°', deg: 90 },
              { label: 'Verso', deg: 180 },
            ].map((angle) => (
              <button
                key={angle.deg}
                onClick={() => setPresetAngle(angle.deg)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  Math.round(normalizedAngle) === angle.deg
                    ? 'bg-[#B8860B] text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {angle.label}
              </button>
            ))}
          </div>

          {/* Speed Selector (Slow / Normal / Fast) */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-stone-500 font-semibold hidden md:inline">Velocidade:</span>
            {(['slow', 'normal', 'fast'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSpeed(s);
                  if (!isAutoRotating) setIsAutoRotating(true);
                }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer uppercase ${
                  speed === s
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {s === 'slow' ? '1x' : s === 'normal' ? '2x' : '3x'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
