import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// config.whatsapp (CMS) a veces guarda un link ya armado (ej. un acortador
// wa.link) y a veces un número crudo; NEXT_PUBLIC_WHATSAPP_NUMBER (fallback de
// build) siempre es un número crudo. Soporta ambos casos sin duplicar el checkeo
// en cada componente que arma un link de WhatsApp.
// mensaje solo se aplica si value es un número crudo: un link ya armado (ej.
// un acortador) no admite agregarle ?text= de forma confiable.
export function toWhatsappUrl(value: string, mensaje?: string): string {
  if (value.startsWith("http")) return value;
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : "";
  return `https://wa.me/${value}${texto}`;
}
