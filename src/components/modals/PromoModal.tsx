"use client";

import { useEffect, useRef, useState } from "react";
import type { PromoModalConfig } from "@/lib/types";
import { useLenis } from "@/hooks/useLenis";

const PROMO_SHOWN_KEY = "promoShown";
const DELAY_MS = 10000;

type Status = "idle" | "loading" | "success";

export default function PromoModal({ config }: { config: PromoModalConfig }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const lenisRef = useLenis();

  useEffect(() => {
    if (sessionStorage.getItem(PROMO_SHOWN_KEY)) return;
    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(PROMO_SHOWN_KEY, "1");
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const lenis = lenisRef.current;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeydown);

    return () => {
      document.body.style.overflow = "";
      lenis?.start();
      document.removeEventListener("keydown", onKeydown);
    };
  }, [open, lenisRef]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: String(fd.get("nombre") || "").trim(),
          email: String(fd.get("email") || "").trim(),
          ciudad: String(fd.get("ciudad") || "").trim(),
          origen: "popup",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setTimeout(() => {
        setOpen(false);
        form.reset();
        setStatus("idle");
      }, 2000);
    } catch {
      setStatus("idle");
      setOpen(false);
      form.reset();
    }
  }

  const activo = Boolean(config.activo);
  const titulo = config.titulo || "FREES, PROMOCIONES Y DESCUENTOS";
  const subtitulo = config.subtitulo || "Sumate A Nuestra Comunidad";
  const textoBoton = config.texto_boton || "Suscribirse";
  const modelo = activo ? Number(config.modelo) || 2 : 1;
  const esImagen = activo && config.tipo_contenido === "imagen" && !!config.imagen_promo;
  const esTexto = activo && config.tipo_contenido === "texto" && !!config.texto_promo;

  return (
    <div
      className={`fixed inset-0 z-[1020] flex items-center justify-center bg-black/[0.88] backdrop-blur-[10px] transition-all duration-300 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        className={`relative m-4 w-full max-w-[380px] overflow-hidden rounded-container bg-black/95 backdrop-blur-[20px] transition-transform duration-300 ${
          open ? "scale-100" : "scale-90"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 p-1 text-primary-white transition-colors duration-300 hover:text-white"
        >
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          {modelo === 2 && activo ? (
            <div className={`relative h-[190px] w-full shrink-0 overflow-hidden rounded-t-image ${esImagen ? "" : "bg-gradient-to-br from-[#1a1a1a] to-black"}`}>
              {esImagen && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.imagen_promo} alt="Promoción" className="h-full w-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/95" />
                </>
              )}
              <div className="absolute inset-x-6 bottom-4 text-center">
                <div className="mb-1 text-[0.7rem] uppercase tracking-[1.5px] text-accent-gray-light">{titulo}</div>
                <h3 className="font-heading text-[1.15rem] font-medium text-white">{subtitulo}</h3>
                {esTexto && <div className="mt-[0.3rem] text-[0.75rem] font-light text-accent-gray-light">{config.texto_promo}</div>}
              </div>
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/logos/CICLIC-BLANCO.png"
                alt="CICLIC Logo - Música Electrónica Bariloche"
                width={200}
                height={60}
                loading="lazy"
                className="my-[0.8rem] mt-7 w-[100px]"
              />
              <div className="mb-6 text-center">
                <p className="mb-[0.55rem] text-[0.8rem] font-light tracking-[0.5px] text-white">{titulo}</p>
                <h3 className="m-0 text-base font-light italic text-[#999]">{subtitulo}</h3>
              </div>

              {modelo === 3 && esImagen && (
                <div className="mx-auto mb-5 mt-1 h-[110px] w-4/5 overflow-hidden rounded-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.imagen_promo} alt="Promoción" className="h-full w-full object-cover" />
                </div>
              )}
              {modelo === 3 && !esImagen && esTexto && (
                <div className="relative mx-auto mb-5 mt-1 w-4/5 rounded-container border-[1.5px] border-dashed border-[#555] bg-white/[0.02] p-[1.1rem] text-center before:absolute before:left-[-9px] before:top-1/2 before:h-[18px] before:w-[18px] before:-translate-y-1/2 before:rounded-interactive before:bg-primary-black after:absolute after:right-[-9px] after:top-1/2 after:h-[18px] after:w-[18px] after:-translate-y-1/2 after:rounded-interactive after:bg-primary-black">
                  <div className="font-heading text-[1.3rem] font-semibold tracking-[0.02em] text-white">{config.texto_promo}</div>
                </div>
              )}
              {modelo === 1 && esImagen && (
                <div className="mx-auto mb-4 mt-1 h-[84px] w-[84px] overflow-hidden rounded-image border-2 border-[#333]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.imagen_promo} alt="Promoción" className="h-full w-full object-cover" />
                </div>
              )}
              {modelo === 1 && !esImagen && esTexto && (
                <div className="mx-auto mb-4 mt-1 w-4/5 rounded-container border border-[#333] p-[0.6rem_1rem] text-center text-[0.9rem] font-medium text-accent-gray-light">
                  {config.texto_promo}
                </div>
              )}
            </>
          )}

          <div className={`flex w-full flex-col items-center gap-2 px-6 pb-6 ${modelo === 2 && activo ? "pt-6" : ""}`}>
            <form ref={formRef} onSubmit={handleSubmit} className="w-4/5">
              <div className="mb-4">
                <input
                  name="nombre"
                  type="text"
                  placeholder="Nombre"
                  required
                  className="w-full border-0 border-b border-[#444] bg-transparent py-3 text-sm font-light text-white outline-none transition-colors duration-300 placeholder:text-[#666] focus:border-b-[#777]"
                />
              </div>
              <div className="mb-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full border-0 border-b border-[#444] bg-transparent py-3 text-sm font-light text-white outline-none transition-colors duration-300 placeholder:text-[#666] focus:border-b-[#777]"
                />
              </div>
              <div className="mb-4">
                <input
                  name="ciudad"
                  type="text"
                  placeholder="Ciudad"
                  required
                  className="w-full border-0 border-b border-[#444] bg-transparent py-3 text-sm font-light text-white outline-none transition-colors duration-300 placeholder:text-[#666] focus:border-b-[#777]"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-interactive bg-accent-gray-light px-3 py-3 text-[0.8rem] font-normal uppercase text-black transition-colors duration-300 hover:bg-accent-pink disabled:opacity-70"
              >
                {status === "success" ? (
                  <>
                    ¡Gracias! <i className="bi bi-check-circle text-[1.2rem] font-thin" />
                  </>
                ) : status === "loading" ? (
                  "Enviando..."
                ) : (
                  <>
                    {textoBoton} <i className="bi bi-stars text-[1.2rem] font-thin" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
