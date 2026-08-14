export interface SuscriptorInput {
  nombre?: string;
  apellido?: string;
  email: string;
  ciudad?: string;
  telefono?: string;
  origen: "footer" | "popup";
}

// Refleja 1:1 la tabla config_web (fila única, id=1)
export interface ConfigWeb {
  hero_url?: string;
  hero_url_mobile?: string;
  banner_url?: string;
  banner_url_mobile?: string;
  banner_tickets_url?: string;
  ticketera_url?: string;
  instagram?: string;
  spotify?: string;
  whatsapp?: string;
  tiktok?: string;
  youtube?: string;
  mostrar_eventos?: boolean;
  mostrar_temporada?: boolean;
  mostrar_galeria?: boolean;
  mostrar_highlights?: boolean;
}

// Forma cruda que devuelve el backend (GET /eventos)
export interface EventoDTO {
  id: number | string;
  titulo?: string;
  descripcion?: string;
  link_tickets?: string;
  imagen_portada?: string;
  imagen_modal?: string;
  imagen_mapa_mesas?: string | null;
  imagen_mapa?: string | null;
  mapa_mesas?: string | null;
  tiene_mesas?: boolean;
  fecha?: string;
  precio?: string;
  venue?: string;
  iframe_mapa?: string;
}

// Forma normalizada para la UI (equivalente a mapearDatosBackend en el sitio viejo)
export interface EventoUI {
  id: number | string;
  titulo: string;
  descripcion: string;
  linkTickets: string | null;
  tieneMesas: boolean;
  fecha: string;
  precio: string;
  imagenTarjeta: string;
  imagenModal: string;
  imagenMapaMesas: string | null;
  venue: string;
  mapaUrl: string;
}

// Forma cruda que devuelve el backend (GET /galeria)
export interface GaleriaDTO {
  imagen: string;
  titulo?: string;
  fecha?: string;
  link_drive?: string;
}

export interface GaleriaItemUI {
  src: string;
  dj: string;
  date: string;
  drive: string;
}

// Forma cruda que devuelve el backend (GET /venues) — alimenta la sección Highlights
export interface VenueDTO {
  id: number | string;
  titulo: string;
  subtitulo?: string | null;
  imagen: string;
  youtube_url: string;
}

export interface VenueUI {
  src: string;
  title: string;
  description: string;
  videoUrl: string;
}

// Refleja 1:1 la tabla promo_modal (fila única, id=1)
export interface PromoModalConfig {
  activo?: boolean;
  titulo?: string;
  texto_promo?: string;
  imagen_promo?: string;
  texto_boton?: string;
  campo_nombre?: boolean;
  campo_apellido?: boolean;
  campo_telefono?: boolean;
  campo_ciudad?: boolean;
}
