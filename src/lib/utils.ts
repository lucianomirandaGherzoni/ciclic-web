import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// config.whatsapp (CMS) a veces guarda un link ya armado (ej. un acortador
// wa.link) y a veces un número crudo; NEXT_PUBLIC_WHATSAPP_NUMBER (fallback de
// build) siempre es un número crudo. Soporta ambos casos sin duplicar el checkeo
// en cada componente que arma un link de WhatsApp.
export function toWhatsappUrl(value: string): string {
  return value.startsWith("http") ? value : `https://wa.me/${value}`;
}
