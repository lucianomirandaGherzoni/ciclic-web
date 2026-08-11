import { getConfigWeb, getEventos } from "@/lib/api";
import EventosCarousel from "./EventosCarousel";

export default async function Eventos() {
  const [eventos, config] = await Promise.all([getEventos(), getConfigWeb()]);

  // Igual que el sitio viejo: se puede ocultar a mano desde el admin
  // (mostrar_eventos), y también se oculta sola si no hay eventos activos.
  if (config.mostrar_eventos === false) return null;
  if (eventos.length === 0) return null;

  const ticketsUrl = config.banner_tickets_url || config.ticketera_url;

  return (
    <section id="eventos" className="contenedor-principal relative mx-auto w-full max-w-[95%] bg-primary-black px-4 py-12">
      <h2 className="mb-6 pl-2 text-[1.9rem] font-medium uppercase tracking-[-0.1rem] text-primary-white max-md:text-[1.7rem]">
        PRÓXIMOS EVENTOS
      </h2>
      <EventosCarousel eventos={eventos} ticketsUrl={ticketsUrl} whatsappNumber={config.whatsapp} />
    </section>
  );
}
