"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { EventoUI } from "@/lib/types";
import { useLenis } from "@/hooks/useLenis";
import { toWhatsappUrl } from "@/lib/utils";
import { shimmerDataUrl } from "@/lib/imagePlaceholder";

const SIZES_TARJETA =
  "(max-width: 767px) 90vw, (max-width: 1023px) 450px, (max-width: 1366px) 300px, (max-width: 1600px) 350px, 700px";

const BREAKPOINT_PANTALLA_GRANDE = 1024;

interface Props {
  eventos: EventoUI[];
  ticketsUrl?: string;
  whatsappNumber?: string;
}

function obtenerX(e: MouseEvent | TouchEvent): number {
  if (e.type.startsWith("mouse")) return (e as MouseEvent).pageX;
  return (e as TouchEvent).touches[0].pageX;
}

export default function EventosCarousel({ eventos, ticketsUrl, whatsappNumber }: Props) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ arrastrando: false, inicioX: 0, scrollIzquierdaInicio: 0, seMovio: false });
  const lenisRef = useLenis();

  const [isWide, setIsWide] = useState(false);
  const [modalEvento, setModalEvento] = useState<EventoUI | null>(null);
  const [modalMesasEvento, setModalMesasEvento] = useState<EventoUI | null>(null);

  const usarImagenModalEnTarjetas = eventos.length <= 3 && isWide;
  const centrarCards = eventos.length <= 3;
  const mostrarFlechas = eventos.length > 3;

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= BREAKPOINT_PANTALLA_GRANDE);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function ajustarScrollAlEvento() {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;
    const tarjetas = contenedor.querySelectorAll<HTMLElement>(".tarjeta");
    if (!tarjetas.length) return;

    const contenedorRect = contenedor.getBoundingClientRect();
    const centerX = contenedorRect.left + contenedorRect.width / 2;

    let tarjetaMasCercana = tarjetas[0];
    let distanciaMinima = Math.abs(
      tarjetas[0].getBoundingClientRect().left + tarjetas[0].getBoundingClientRect().width / 2 - centerX,
    );
    tarjetas.forEach((tarjeta) => {
      const rect = tarjeta.getBoundingClientRect();
      const centerTarjeta = rect.left + rect.width / 2;
      const distancia = Math.abs(centerTarjeta - centerX);
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia;
        tarjetaMasCercana = tarjeta;
      }
    });

    const desplazamiento =
      tarjetaMasCercana.offsetLeft - contenedor.clientWidth / 2 + tarjetaMasCercana.offsetWidth / 2;
    contenedor.scrollTo({ left: desplazamiento, behavior: "smooth" });
  }

  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;
    const state = drag.current;

    function iniciarArrastre(e: MouseEvent | TouchEvent) {
      state.arrastrando = true;
      state.seMovio = false;
      contenedor!.style.cursor = "grabbing";
      contenedor!.style.scrollBehavior = "auto";
      state.inicioX = obtenerX(e) - contenedor!.offsetLeft;
      state.scrollIzquierdaInicio = contenedor!.scrollLeft;
    }

    function duranteArrastre(e: MouseEvent | TouchEvent) {
      if (!state.arrastrando) return;
      const x = obtenerX(e) - contenedor!.offsetLeft;
      const desplazamiento = x - state.inicioX;
      if (Math.abs(desplazamiento) > 3) state.seMovio = true;
      contenedor!.scrollLeft = state.scrollIzquierdaInicio - desplazamiento;
    }

    function terminarArrastre() {
      state.arrastrando = false;
      contenedor!.style.cursor = "grab";
      contenedor!.style.scrollBehavior = "smooth";
      if (state.seMovio) {
        const desplazamientoTotal = Math.abs(contenedor!.scrollLeft - state.scrollIzquierdaInicio);
        if (desplazamientoTotal > 30) {
          ajustarScrollAlEvento();
        } else {
          contenedor!.scrollTo({ left: state.scrollIzquierdaInicio, behavior: "smooth" });
        }
      }
    }

    contenedor.addEventListener("mousedown", iniciarArrastre);
    contenedor.addEventListener("mouseleave", terminarArrastre);
    contenedor.addEventListener("mouseup", terminarArrastre);
    contenedor.addEventListener("mousemove", duranteArrastre);
    contenedor.addEventListener("touchstart", iniciarArrastre, { passive: true });
    contenedor.addEventListener("touchend", terminarArrastre);
    contenedor.addEventListener("touchmove", duranteArrastre, { passive: false });

    return () => {
      contenedor.removeEventListener("mousedown", iniciarArrastre);
      contenedor.removeEventListener("mouseleave", terminarArrastre);
      contenedor.removeEventListener("mouseup", terminarArrastre);
      contenedor.removeEventListener("mousemove", duranteArrastre);
      contenedor.removeEventListener("touchstart", iniciarArrastre);
      contenedor.removeEventListener("touchend", terminarArrastre);
      contenedor.removeEventListener("touchmove", duranteArrastre);
    };
  }, []);

  function desplazar(direccion: "izquierda" | "derecha") {
    const contenedor = contenedorRef.current;
    const tarjeta = contenedor?.querySelector<HTMLElement>(".tarjeta");
    if (!contenedor || !tarjeta) return;

    const { scrollLeft, scrollWidth, clientWidth } = contenedor;
    const tarjetaWidth = tarjeta.offsetWidth + 24;

    if (direccion === "derecha") {
      if (scrollLeft >= scrollWidth - clientWidth - 5) {
        contenedor.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        contenedor.scrollBy({ left: tarjetaWidth, behavior: "smooth" });
      }
    } else {
      if (scrollLeft <= 5) {
        contenedor.scrollTo({ left: scrollWidth - clientWidth, behavior: "smooth" });
      } else {
        contenedor.scrollBy({ left: -tarjetaWidth, behavior: "smooth" });
      }
    }

    setTimeout(() => ajustarScrollAlEvento(), 600);
  }

  function handleCardClick(evento: EventoUI) {
    if (!drag.current.seMovio) setModalEvento(evento);
  }

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

  const tarjetaBase =
    "tarjeta group relative h-[25.5rem] w-72 shrink-0 origin-center translate-y-5 cursor-pointer overflow-hidden rounded-image bg-secondary-black opacity-0 transition-[transform,box-shadow] duration-300 [animation:aparecerTarjeta_0.5s_ease-out_forwards] hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-md:aspect-[3/4] max-md:h-auto max-md:w-[90vw] max-md:max-w-[320px] md:h-[600px] md:w-[450px] [@media(min-width:1024px)_and_(max-width:1366px)]:h-[calc(100vh-260px)] [@media(min-width:1024px)_and_(max-width:1366px)]:w-[300px] [@media(min-width:1367px)_and_(max-width:1600px)]:h-[calc(100vh-280px)] [@media(min-width:1367px)_and_(max-width:1600px)]:w-[350px]";
  const tarjetaWideExtra = usarImagenModalEnTarjetas
    ? " lg:aspect-[2.32/1] lg:h-auto lg:w-[clamp(360px,44vw,700px)] lg:bg-[#090909]"
    : "";

  return (
    <div className="carrusel relative w-full">
      <div
        ref={contenedorRef}
        className={`carrusel__contenedor flex cursor-grab select-none overflow-x-auto scroll-smooth px-2 py-4 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden ${
          centrarCards ? "cursor-default overflow-x-hidden active:cursor-default" : ""
        }`}
      >
        <div
          className={`carrusel__lista flex gap-6 pl-4 pr-8 ${
            centrarCards ? "w-full min-w-full justify-center pl-0 pr-0" : "min-w-max"
          }`}
        >
          {eventos.map((evento, indice) => {
            const imagenTarjeta = usarImagenModalEnTarjetas
              ? evento.imagenModal || evento.imagenTarjeta
              : evento.imagenTarjeta;
            return (
              <div
                key={evento.id}
                className={tarjetaBase + tarjetaWideExtra}
                style={{ animationDelay: `${indice * 0.1}s` }}
                onClick={() => handleCardClick(evento)}
              >
                <div className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] [background:linear-gradient(to_bottom,rgba(0,0,0,0.2)_0%,transparent_50%,rgba(0,0,0,0.9)_100%)]" />
                <div className="relative z-[3] flex h-full flex-col justify-end p-4 text-primary-white">
                  <div
                    className={`translate-y-[10px] text-left text-[1.1rem] font-bold leading-[1.1] text-primary-white opacity-0 transition-all duration-300 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] group-hover:translate-y-0 group-hover:opacity-100 max-md:text-[1.3rem]`}
                  >
                    COMPRAR TICKETS
                  </div>
                </div>
                <Image
                  src={imagenTarjeta}
                  alt={evento.titulo}
                  fill
                  sizes={SIZES_TARJETA}
                  placeholder={shimmerDataUrl(450, 600)}
                  className={`pointer-events-none z-[1] rounded-[inherit] object-cover transition-all duration-500 group-hover:scale-105 ${
                    usarImagenModalEnTarjetas ? "lg:scale-100 lg:object-contain lg:object-center lg:group-hover:scale-100" : ""
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {mostrarFlechas && (
        <div className="carrusel__controles mt-6 mr-2 flex justify-end gap-3 max-md:ml-4 max-md:mr-0 max-md:justify-start">
          <button
            type="button"
            onClick={() => desplazar("izquierda")}
            className="flex h-12 w-12 items-center justify-center rounded-interactive bg-white/5 text-primary-white transition-all duration-300 hover:bg-primary-white hover:text-primary-black"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => desplazar("derecha")}
            className="flex h-12 w-12 items-center justify-center rounded-interactive bg-white/5 text-primary-white transition-all duration-300 hover:bg-primary-white hover:text-primary-black"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

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
            className="relative z-[10000] mx-auto my-[5vh] max-h-[90vh] w-full max-w-[60rem] overflow-y-auto rounded-container border border-white/10 bg-secondary-black p-12 text-primary-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] [scrollbar-color:var(--accent-gray)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-accent-gray/60 [&::-webkit-scrollbar-thumb:hover]:bg-accent-gray-light [&::-webkit-scrollbar-track]:bg-transparent max-md:my-0 max-md:max-h-[85vh] max-md:max-w-[400px] max-md:border-white/15 max-md:p-6 max-md:px-6 max-md:py-10"
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

            <div className="mb-2 text-sm font-medium uppercase tracking-wide text-accent-gray">
              {modalEvento.fecha} | {modalEvento.ubicacion}
            </div>
            <h2 className="mb-8 text-[2.5rem] font-bold uppercase leading-[1.1] text-primary-white max-md:mt-2 max-md:text-[1.8rem]">
              COMPRAR ENTRADAS
            </h2>

            <div className="mb-8 flex flex-wrap gap-4 max-md:items-start max-md:gap-3">
              <a
                href={modalEvento.linkTickets || ticketsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-interactive border border-primary-white bg-primary-white px-5 py-[0.6rem] text-center text-sm font-semibold uppercase tracking-wide text-primary-black transition-all duration-300 hover:bg-transparent hover:text-primary-white max-md:flex-1 max-md:px-3 max-md:py-[0.6rem] max-md:text-xs"
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
                  className="rounded-interactive border border-primary-white bg-transparent px-5 py-[0.6rem] text-center text-sm font-semibold uppercase tracking-wide text-primary-white transition-all duration-300 hover:bg-transparent max-md:flex-1 max-md:px-3 max-md:py-[0.6rem] max-md:text-xs"
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

            <p className="mb-8 text-[1.1rem] font-light leading-[1.6] text-accent-gray-light">
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

            <h2 className="mb-6 text-center text-[1.6rem] font-bold uppercase tracking-[2px] text-primary-white max-md:text-[1.5rem]">
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
