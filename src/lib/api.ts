import type {
  ConfigWeb,
  EventoDTO,
  EventoUI,
  GaleriaDTO,
  GaleriaItemUI,
  PromoModalConfig,
  SuscriptorInput,
  VenueDTO,
  VenueUI,
} from "./types";

const API_URL = process.env.API_URL;

// Todas las llamadas al backend pasan por acá: sin timeout, un backend colgado
// puede tildar el build entero (layout.tsx hace estos fetches en TODAS las páginas).
async function fetchApi(path: string, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}${path}`, { signal: controller.signal, next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Se llama desde Server Components — config-web cambia poco, se revalida cada 60s.
export async function getConfigWeb(): Promise<ConfigWeb> {
  try {
    const res = await fetchApi("config-web");
    return await res.json();
  } catch {
    return {};
  }
}

export async function getPromoModal(): Promise<PromoModalConfig> {
  try {
    const res = await fetchApi("promo-modal");
    return await res.json();
  } catch {
    return {};
  }
}

const MAPA_POR_DEFECTO =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3005.163363364776!2d-71.31026562334862!3d-41.13049107133333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x961a7b721ea24f3f%3A0x68b4362164536768!2sCentro%20C%C3%ADvico%20Bariloche!5e0!3m2!1ses-419!2sar!4v1709667794595!5m2!1ses-419!2sar";

// Equivalente a mapearDatosBackend() en el sitio viejo: adapta la respuesta cruda
// del backend a un formato listo para la UI.
function mapEventos(data: EventoDTO[]): EventoUI[] {
  return data.map((item) => {
    const imgTarjeta = item.imagen_portada || "/img/hero/hero-desktop-04.jpg";
    const imgModal = item.imagen_modal || imgTarjeta;

    const rawMapaMesas = item.imagen_mapa_mesas ?? item.imagen_mapa ?? item.mapa_mesas ?? null;
    const imgMapaMesas = rawMapaMesas == null ? "" : String(rawMapaMesas).trim();
    const hasMapaMesas =
      !!imgMapaMesas && imgMapaMesas.toLowerCase() !== "null" && imgMapaMesas.toLowerCase() !== "undefined";
    // El botón "Reservar Mesa" también puede activarse a mano desde el admin
    // (tiene_mesas) sin haber cargado una imagen del mapa todavía.
    const tieneMesas = hasMapaMesas || !!item.tiene_mesas;

    let fechaFormateada = "PRÓXIMAMENTE";
    if (item.fecha) {
      const fechaObj = new Date(item.fecha);
      fechaFormateada = Number.isNaN(fechaObj.getTime())
        ? item.fecha
        : fechaObj.toLocaleDateString("es-AR", { day: "numeric", month: "short" }).toUpperCase();
    }

    let iframeUrl = MAPA_POR_DEFECTO;
    const rawMapa = item.iframe_mapa || "";
    if (rawMapa) {
      if (rawMapa.includes("<iframe")) {
        const match = rawMapa.match(/src="([^"]+)"/);
        if (match?.[1]) iframeUrl = match[1];
      } else if (rawMapa.startsWith("http")) {
        iframeUrl = rawMapa;
      }
    }

    return {
      id: item.id,
      titulo: item.titulo || "Evento sin título",
      descripcion: item.descripcion || "",
      linkTickets: item.link_tickets || null,
      tieneMesas,
      fecha: fechaFormateada,
      precio: item.precio || "",
      imagenTarjeta: imgTarjeta,
      imagenModal: imgModal,
      imagenMapaMesas: hasMapaMesas ? imgMapaMesas : null,
      venue: item.venue || "BARILOCHE",
      mapaUrl: iframeUrl,
    };
  });
}

// Se llama desde Server Components. Timeout de 30s para tolerar cold-starts del backend
// (mismo margen que el sitio viejo); si falla, la sección de eventos simplemente no se muestra.
export async function getEventos(): Promise<EventoUI[]> {
  try {
    const res = await fetchApi("eventos", 30000);
    const data: EventoDTO[] = await res.json();
    return Array.isArray(data) ? mapEventos(data) : [];
  } catch {
    return [];
  }
}

// Se llama desde Server Components. El sitio viejo cacheaba esto en sessionStorage
// (client-side); acá el cache de fetch de Next cumple el mismo rol a nivel servidor.
export async function getGaleria(): Promise<GaleriaItemUI[]> {
  try {
    const res = await fetchApi("galeria");
    const data: GaleriaDTO[] = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      src: item.imagen,
      dj: item.titulo || "",
      date: item.fecha || "",
      drive: item.link_drive || "",
    }));
  } catch {
    return [];
  }
}

// Acepta watch?v=, youtu.be/ y embed/ y devuelve siempre una URL de embed lista
// para el iframe del modal de Highlights. Si no matchea, devuelve la URL tal cual
// (el iframe simplemente no cargará el video, pero no rompe la página).
function toYoutubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
}

// Se llama desde Server Components — alimenta la sección Highlights. Cada venue lo
// carga el dueño de CICLIC desde el panel admin (imagen, título, subtítulo y link
// de YouTube).
export async function getVenues(): Promise<VenueUI[]> {
  try {
    const res = await fetchApi("venues");
    const data: VenueDTO[] = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      src: item.imagen,
      title: item.titulo,
      description: item.subtitulo || "",
      videoUrl: toYoutubeEmbedUrl(item.youtube_url),
    }));
  } catch {
    return [];
  }
}

// Solo se llama desde el server (route handler), nunca desde el cliente —
// por eso API_URL no necesita el prefijo NEXT_PUBLIC_.
export async function postSuscriptor(data: SuscriptorInput) {
  const res = await fetch(`${API_URL}suscriptores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.mensaje || `Error HTTP ${res.status}`);
  }
  return body;
}
