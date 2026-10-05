import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronRight, ChevronLeft, Play, Pause, Maximize2 } from 'lucide-react';

export const MediaViewer: React.FC = () => {
  const { activeMediaViewer, setActiveMediaViewer } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (activeMediaViewer) {
      setCurrentIndex(activeMediaViewer.initialIndex || 0);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [activeMediaViewer]);

  if (!activeMediaViewer) return null;

  const { product } = activeMediaViewer;
  const currentMedia = product.media[currentIndex] || product.media[0];

  const handleClose = () => {
    setActiveMediaViewer(null);
  };

  const handleNext = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev + 1) % product.media.length);
  };

  const handlePrev = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev - 1 + product.media.length) % product.media.length);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse & Touch Drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel <= 1 || e.touches.length === 0) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomLevel <= 1 || e.touches.length === 0) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none">
      {/* Top Bar with Controls */}
      <div className="flex items-center justify-between p-4 text-white z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm md:text-base text-gray-200">
            {product.name}
          </span>
          <span className="text-xs bg-gray-800 px-2.5 py-1 rounded-full text-gray-400">
            {currentIndex + 1} / {product.media.length}
          </span>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-2">
          {currentMedia.type === 'image' && (
            <div className="flex items-center gap-1 bg-gray-800/80 p-1 rounded-xl">
              <button
                onClick={handleZoomIn}
                title="تكبير الصورة"
                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-200 hover:text-white"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                title="تصغير الصورة"
                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-200 hover:text-white"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              {zoomLevel > 1 && (
                <button
                  onClick={handleResetZoom}
                  title="إعادة للوضع الطبيعي"
                  className="p-1.5 hover:bg-gray-700 rounded-lg text-orange-400"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-gray-800/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {/* Navigation Arrows */}
        {product.media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="السابق"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-transform active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              aria-label="التالي"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-transform active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Media Container */}
        <div
          className="transition-transform duration-75 flex items-center justify-center max-w-full max-h-full"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
          }}
        >
          {currentMedia.type === 'video' ? (
            <div className="relative max-w-3xl max-h-[70vh]">
              <video
                ref={videoRef}
                src={currentMedia.url}
                className="max-h-[70vh] rounded-xl shadow-2xl object-contain"
                controls
                autoPlay
                playsInline
                loop
              />
              <button
                onClick={toggleVideoPlay}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white p-2.5 rounded-full"
              >
                {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <img
              src={currentMedia.url}
              alt={currentMedia.title || product.name}
              className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl pointer-events-none select-none"
            />
          )}
        </div>

        {/* Drag Hint for Zoom */}
        {zoomLevel > 1 && (
          <div className="absolute bottom-24 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-xs pointer-events-none">
            اسحب الصورة في أي اتجاه لمعاينة أدق التفاصيل
          </div>
        )}
      </div>

      {/* Bottom Bar: "تصفح أيضاً" Thumbnails strip */}
      <div className="p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-right text-xs font-semibold text-gray-300 mb-2">
            تصفح أيضاً:
          </div>
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 no-scrollbar">
            {product.media.map((med, idx) => (
              <button
                key={med.id}
                onClick={() => {
                  setZoomLevel(1);
                  setPosition({ x: 0, y: 0 });
                  setCurrentIndex(idx);
                }}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                  currentIndex === idx
                    ? 'border-orange-500 scale-105 ring-2 ring-orange-500/50 shadow-lg'
                    : 'border-gray-700 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={med.url}
                  alt={med.title || `معاينة ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {med.type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
                {med.colorName && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-white py-0.5 truncate text-center">
                    {med.colorName}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
