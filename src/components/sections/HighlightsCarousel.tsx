"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { VenueUI } from "@/lib/types";
import { shimmerDataUrl } from "@/lib/imagePlaceholder";

// El contenedor es siempre min(90vw, 1400px) (ver className del contenedor mas
// abajo), sin variar por breakpoint.
const SIZES_SLIDE = "(min-width: 1556px) 1400px, 90vw";

interface Props {
  venues: VenueUI[];
}

export default function HighlightsCarousel({ venues }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const slideIndexRef = useRef(0);
  const touchStartX = useRef(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [slideIndex, setSlideIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  function goToSlide(index: number) {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setActiveIndex(-1);
    setSlideIndex(index);
    setTimeout(() => setActiveIndex(index), 100);
    setTimeout(() => {
      isAnimating.current = false;
    }, 600);
  }

  function nextSlide() {
    goToSlide((slideIndexRef.current + 1) % venues.length);
  }
  function prevSlide() {
    goToSlide((slideIndexRef.current - 1 + venues.length) % venues.length);
  }

  // Autoplay: pausa con el mouse encima, igual que el sitio viejo.
  useEffect(() => {
    const container = containerRef.current;
    function start() {
      autoplayRef.current = setInterval(nextSlide, 5000);
    }
    function stop() {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    }
    start();
    container?.addEventListener("mouseenter", stop);
    container?.addEventListener("mouseleave", start);
    return () => {
      stop();
      container?.removeEventListener("mouseenter", stop);
      container?.removeEventListener("mouseleave", start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navegación por teclado: flechas mueven el carousel, salvo que el modal de
  // video esté abierto (ahí navegan el video, ver efecto de abajo).
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (modalOpen) return;
      if (e.key === "ArrowLeft") prevSlide();
      else if (e.key === "ArrowRight") nextSlide();
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].screenX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const touchEndX = e.changedTouches[0].screenX;
    if (Math.abs(touchStartX.current - touchEndX) > 50) {
      if (touchStartX.current - touchEndX > 0) nextSlide();
      else prevSlide();
    }
  }

  function openVideoModal(index: number) {
    setVideoIndex(index);
    setModalOpen(true);
    // eslint-disable-next-line react-hooks/immutability -- mutación de DOM global válida en un event handler, no durante el render
    document.body.style.overflow = "hidden";
  }
  function closeVideoModal() {
    setModalOpen(false);
    document.body.style.overflow = "";
  }
  function navigateVideo(direction: number) {
    const newIndex = videoIndex + direction;
    if (newIndex >= 0 && newIndex < venues.length) setVideoIndex(newIndex);
  }

  useEffect(() => {
    if (!modalOpen) return;
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") closeVideoModal();
      else if (e.key === "ArrowLeft") navigateVideo(-1);
      else if (e.key === "ArrowRight") navigateVideo(1);
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, videoIndex]);

  return (
    <>
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative mx-auto h-[80vh] max-h-[700px] w-[90vw] max-w-[1400px] overflow-hidden rounded-image shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
      >
        <div
          className="flex h-full transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {venues.map((slide, index) => (
            <div
              key={slide.title}
              className="group relative h-full w-full shrink-0 cursor-pointer overflow-hidden"
              onClick={() => openVideoModal(index)}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                sizes={SIZES_SLIDE}
                placeholder={shimmerDataUrl(1400, 700)}
                className="object-cover transition-transform duration-[600ms] ease-in-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-b from-transparent to-black/80 p-4 md:gap-4 md:p-8">
                <h3
                  className={`font-heading text-base transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] md:text-2xl ${
                    activeIndex === index ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
                >
                  {slide.title}
                </h3>
                <p
                  className={`font-sans text-xs leading-[1.4] transition-all delay-[100ms] duration-[800ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] md:text-base ${
                    activeIndex === index ? "translate-y-0 opacity-90" : "translate-y-5 opacity-0"
                  }`}
                >
                  {slide.description}
                </p>
              </div>
              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:flex">
                <i className="bi bi-youtube text-6xl text-[#FF0000] [filter:drop-shadow(0_4px_20px_rgba(0,0,0,0.8))]" />
                <span className="font-heading text-xl font-medium tracking-[4px] text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.8)]">
                  PUESTA EN ESCENA
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute top-1/2 flex w-full justify-between px-8">
          <button
            type="button"
            onClick={prevSlide}
            className="pointer-events-auto flex h-[50px] w-[50px] -translate-y-1/2 select-none items-center justify-center rounded-interactive border border-white/20 bg-white/10 text-2xl font-bold text-white backdrop-blur-[10px] transition-all duration-200 hover:border-accent-gray hover:bg-accent-gray/20 active:scale-95"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="pointer-events-auto flex h-[50px] w-[50px] -translate-y-1/2 select-none items-center justify-center rounded-interactive border border-white/20 bg-white/10 text-2xl font-bold text-white backdrop-blur-[10px] transition-all duration-200 hover:border-accent-gray hover:bg-accent-gray/20 active:scale-95"
          >
            ›
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/95 backdrop-blur-[10px]" onClick={closeVideoModal} />
          <div className="relative z-[2] aspect-video w-[90vw] max-w-[1200px] overflow-hidden rounded-image bg-black shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-[768px]:w-[95vw] max-[480px]:w-screen max-[480px]:max-w-none">
            <button
              type="button"
              onClick={closeVideoModal}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-interactive border border-white/30 bg-black/70 text-primary-white backdrop-blur-[10px] transition-all duration-300 hover:scale-110 hover:bg-primary-white hover:text-primary-black"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <button
              type="button"
              disabled={videoIndex === 0}
              onClick={() => navigateVideo(-1)}
              className="absolute left-[-4rem] top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-interactive border border-white/30 bg-black/70 text-primary-white backdrop-blur-[10px] transition-all duration-300 hover:scale-110 hover:bg-primary-white hover:text-primary-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-black/70 disabled:hover:text-primary-white max-[1024px]:left-[-3.5rem] max-[768px]:left-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              disabled={videoIndex === venues.length - 1}
              onClick={() => navigateVideo(1)}
              className="absolute right-[-4rem] top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-interactive border border-white/30 bg-black/70 text-primary-white backdrop-blur-[10px] transition-all duration-300 hover:scale-110 hover:bg-primary-white hover:text-primary-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-black/70 disabled:hover:text-primary-white max-[1024px]:right-[-3.5rem] max-[768px]:right-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className="h-full w-full">
              <iframe
                src={venues[videoIndex].videoUrl}
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
