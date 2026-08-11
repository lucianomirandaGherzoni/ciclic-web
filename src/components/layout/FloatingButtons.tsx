"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";
import { toWhatsappUrl } from "@/lib/utils";

interface FloatingButtonsProps {
  whatsappNumber?: string;
}

export default function FloatingButtons({ whatsappNumber }: FloatingButtonsProps) {
  const WHATSAPP_NUMBER = whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const [visible, setVisible] = useState(false);
  const lenisRef = useLenis();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else {
      gsap.to(window, { duration: 1.5, scrollTo: { y: 0 }, ease: "power2.out" });
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Volver arriba"
        className={`flex h-10 w-10 items-center justify-center rounded-interactive border border-accent-gray/30 bg-transparent text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-[100px] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-gray hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] [animation:fadeInUp_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards] ${
          visible ? "visible opacity-100" : "invisible translate-y-5 opacity-0"
        }`}
      >
        <i className="bi bi-chevron-up text-base" />
      </button>
      {WHATSAPP_NUMBER && (
        <a
          href={toWhatsappUrl(WHATSAPP_NUMBER)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#25d366]/30 bg-[#25d366] text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 [animation-delay:0.1s] hover:-translate-y-0.5 hover:bg-[#128c7e] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] [animation:fadeInUp_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards]"
        >
          <i className="fab fa-whatsapp text-xl" />
        </a>
      )}
    </div>
  );
}
