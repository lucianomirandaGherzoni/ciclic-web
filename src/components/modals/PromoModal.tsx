"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PromoModalConfig } from "@/lib/types";
import { useLenis } from "@/hooks/useLenis";

const PROMO_SHOWN_KEY = "promoShown";
const DELAY_MS = 10000;

type Status = "idle" | "loading" | "success";

// Campos configurables del formulario de suscripción. Email siempre se muestra
// (no es configurable); el resto depende de los flags campo_* de promo_modal.
// Mantené esta lista sincronizada con ciclic-admin/js/promoPreview.js.
const CAMPOS_SUSCRIPCION: {
  key: "nombre" | "apellido" | "email" | "telefono" | "ciudad";
  label: string;
  type: string;
  enabled: (config: PromoModalConfig) => boolean;
}[] = [
  { key: "nombre", label: "Nombre", type: "text", enabled: (c) => !!c.campo_nombre },
  { key: "apellido", label: "Apellido", type: "text", enabled: (c) => !!c.campo_apellido },
  { key: "email", label: "Email", type: "email", enabled: () => true },
  { key: "telefono", label: "Teléfono", type: "tel", enabled: (c) => !!c.campo_telefono },
  { key: "ciudad", label: "Ciudad", type: "text", enabled: (c) => !!c.campo_ciudad },
];

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

  const activo = Boolean(config.activo);
  const titulo = config.titulo || "Sumate A Nuestra Comunidad";
  const textoBoton = config.texto_boton || "Suscribirse";
  const tieneImagen = activo && !!config.imagen_promo;
  const tieneTexto = activo && !!config.texto_promo;
  const camposActivos = CAMPOS_SUSCRIPCION.filter((campo) => campo.enabled(config));

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
          ...Object.fromEntries(
            camposActivos.map((campo) => [campo.key, String(fd.get(campo.key) || "").trim()])
          ),
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
            <h3 className="m-0 text-base font-light italic text-[#999]">{titulo}</h3>
            {tieneTexto && (
              <p className="m-0 mt-[0.4rem] text-center text-[0.8rem] font-light text-accent-gray-light">
                {config.texto_promo}
              </p>
            )}
          </div>

          {tieneImagen && (
            <div className="relative mx-auto mb-4 mt-1 h-[84px] w-[84px] overflow-hidden rounded-image border-2 border-[#333]">
              <Image src={config.imagen_promo!} alt="Promoción" fill sizes="84px" className="object-cover" />
            </div>
          )}

          <div className="flex w-full flex-col items-center gap-2 px-6 pb-6">
            <form ref={formRef} onSubmit={handleSubmit} className="w-4/5">
              {camposActivos.map((campo) => (
                <div className="mb-4" key={campo.key}>
                  <input
                    name={campo.key}
                    type={campo.type}
                    placeholder={campo.label}
                    required
                    className="w-full border-0 border-b border-[#444] bg-transparent py-3 text-sm font-light text-white outline-none transition-colors duration-300 placeholder:text-[#666] focus:border-b-[#777]"
                  />
                </div>
              ))}
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
