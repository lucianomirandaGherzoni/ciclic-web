"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { EventoUI } from "@/lib/types";
import { useLenis } from "@/hooks/useLenis";
import { toWhatsappUrl } from "@/lib/utils";
import { shimmerDataUrl } from "@/lib/imagePlaceholder";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";

interface Props {
  eventos: EventoUI[];
  ticketsUrl?: string;
  whatsappNumber?: string;
}

export default function EventosCarousel({ eventos, ticketsUrl, whatsappNumber }: Props) {
  const lenisRef = useLenis();

  const [modalEvento, setModalEvento] = useState<EventoUI | null>(null);
  const [modalMesasEvento, setModalMesasEvento] = useState<EventoUI | null>(null);

  // Bloquea el scroll de fondo (Lenis + body) mientras el modal de evento está abierto,
  // igual que el sitio viejo; Escape cierra solo el modal principal.
  useEffect(() => {
    if (!modalEvento) return;
    const lenis = lenisRef.current;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();

    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") setModalEvento(null);
    }
    document.addEventListener("keydown", onKeydown);

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
      document.removeEventListener("keydown", onKeydown);
    };
  }, [modalEvento, lenisRef]);

  const slides = eventos.map((evento) => ({
    src: evento.imagenTarjeta,
    alt: evento.titulo,
    title: evento.titulo,
    subtitle: evento.fecha,
    meta: evento.precio ? [{ label: "Precio", value: evento.precio }] : undefined,
  }));

  return (
    <div className="carrusel relative w-full">
      <CoverflowCarousel
        slides={slides}
        cardWidth="clamp(200px, 28vw, 380px)"
        cardAspect={3 / 4}
        showCaption
        showNavigation={eventos.length > 1}
        showPagination={eventos.length > 1}
        paginationPosition="middle"
        activateLabel="Ver info"
        label="Carrusel de próximos eventos"
        onSlideActivate={(indice) => setModalEvento(eventos[indice])}
      />

      {modalEvento && (
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto [overscroll-behavior:contain] max-md:fixed max-md:inset-0 max-md:flex max-md:items-center max-md:justify-center max-md:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalEvento(null);
          }}
        >
          <div className="pointer-events-auto fixed inset-0 bg-[rgba(10,10,10,0.95)] backdrop-blur-[5px]" />
          <div
            data-lenis-prevent
            className="relative z-[10000] mx-auto my-[5vh] max-h-[90vh] w-full max-w-[60rem] overflow-y-auto rounded-container border border-white/10 bg-secondary-black p-12 text-primary-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] [scrollbar-color:var(--accent-gray)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:bg-accent-gray/60 [&::-webkit-scrollbar-thumb:hover]:bg-accent-gray-light [&::-webkit-scrollbar-track]:rounded-none [&::-webkit-scrollbar-track]:bg-transparent max-md:my-0 max-md:max-h-[85vh] max-md:max-w-[400px] max-md:border-white/15 max-md:p-6 max-md:px-6 max-md:py-10"
          >
            <button
              type="button"
              onClick={() => setModalEvento(null)}
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-interactive border border-white/10 text-primary-white transition-all duration-300 hover:bg-primary-white hover:text-primary-black max-md:h-9 max-md:w-9 max-md:bg-white/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-accent-gray">
              {modalEvento.fecha} | {modalEvento.ubicacion}
            </div>
            <h2 className="mb-8 text-[clamp(1.8rem,5vw,2.5rem)] font-bold uppercase leading-[1.1] text-primary-white max-md:mt-2">
              {modalEvento.titulo}
            </h2>

            <div className="mb-8 flex flex-wrap gap-4 max-md:items-start max-md:gap-3">
              <a
                href={modalEvento.linkTickets || ticketsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-interactive border border-primary-white bg-primary-white px-5 py-[0.6rem] text-center text-sm font-semibold uppercase tracking-wide text-primary-black transition-all duration-300 hover:bg-transparent hover:text-primary-white max-md:flex-1 max-md:px-3 max-md:py-[0.6rem]"
              >
                Tickets
              </a>
              {modalEvento.tieneMesas && (
                <button
                  type="button"
                  onClick={() => {
                    // Si hay imagen del mapa, la mostramos en su propio modal; si el
                    // admin activó "tiene mesas" sin subir imagen, vamos directo a
                    // WhatsApp con el mensaje ya armado para ese evento.
                    if (modalEvento.imagenMapaMesas) {
                      setModalMesasEvento(modalEvento);
                      return;
                    }
                    const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || whatsappNumber;
                    if (!numero) return;
                    const mensaje = `Hola! Quiero reservar una mesa para el evento "${modalEvento.titulo}".`;
                    window.open(toWhatsappUrl(numero, mensaje), "_blank", "noopener,noreferrer");
                  }}
                  className="rounded-interactive border border-primary-white bg-transparent px-5 py-[0.6rem] text-center text-sm font-semibold uppercase tracking-wide text-primary-white transition-all duration-300 hover:bg-transparent max-md:flex-1 max-md:px-3 max-md:py-[0.6rem]"
                >
                  Reservar Mesa
                </button>
              )}
            </div>

            <Image
              src={modalEvento.imagenModal}
              alt={modalEvento.titulo}
              // Ancho/alto reales desconocidos (vienen de una URL remota, sin
              // metadata en la DB): el valor es solo una guía para el srcset,
              // el tamaño final en pantalla lo define el style de abajo.
              width={1200}
              height={1200}
              sizes="(max-width: 767px) 90vw, 900px"
              placeholder={shimmerDataUrl(1200, 1200)}
              style={{ width: "auto", height: "auto" }}
              className="mx-auto mb-8 block max-h-[60vh] max-w-full rounded-image object-contain shadow-[0_10px_30px_rgba(0,0,0,0.3)] max-md:mb-6 max-md:max-h-[40vh]"
            />

            <p className="mb-8 text-[clamp(0.95rem,2vw,1.1rem)] font-light leading-[1.6] text-accent-gray-light">
              {modalEvento.descripcion}
            </p>

            <div className="h-[300px] w-full overflow-hidden rounded-container border border-white/10">
              <iframe
                src={modalEvento.mapaUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="[filter:invert(90%)_hue-rotate(180deg)]"
              />
            </div>
          </div>
        </div>
      )}

      {modalMesasEvento?.imagenMapaMesas && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 [overscroll-behavior:contain]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalMesasEvento(null);
          }}
        >
          <div className="pointer-events-auto fixed inset-0 bg-[rgba(10,10,10,0.95)] backdrop-blur-[5px]" />
          <div className="relative z-[10000] mx-auto max-w-[40rem] rounded-container border border-white/10 bg-secondary-black p-12 text-primary-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-md:p-8">
            <button
              type="button"
              onClick={() => setModalMesasEvento(null)}
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-interactive border border-white/10 text-primary-white transition-all duration-300 hover:bg-primary-white hover:text-primary-black"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mb-6 text-center text-[clamp(1.5rem,4vw,1.6rem)] font-bold uppercase tracking-[2px] text-primary-white">
              MAPA DE MESAS
            </h2>

            <a
              href={whatsappNumber ? toWhatsappUrl(whatsappNumber) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mb-8 flex w-full max-w-[300px] items-center justify-center gap-3 rounded-interactive border-[1.5px] border-[rgba(37,211,102,0.5)] bg-transparent px-6 py-[0.85rem] text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-px hover:border-[rgba(37,211,102,0.8)] hover:bg-[rgba(37,211,102,0.1)]"
            >
              <i className="fab fa-whatsapp text-[1.2rem] text-[#25D366]" /> RESERVÁ TU MESA
            </a>

            <div className="relative mx-auto w-full max-w-[400px] overflow-hidden rounded-image border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <Image
                src={modalMesasEvento.imagenMapaMesas}
                alt="Mapa de distribución de mesas - Evento CICLIC"
                width={400}
                height={400}
                sizes="(max-width: 400px) 100vw, 400px"
                placeholder={shimmerDataUrl(400, 400)}
                style={{ width: "100%", height: "auto" }}
                className="block"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
