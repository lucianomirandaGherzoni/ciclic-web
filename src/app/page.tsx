import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/components/sections/Hero";
import Temporada from "@/components/sections/Temporada";
import Eventos from "@/components/sections/Eventos";
import Galeria from "@/components/sections/Galeria";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Highlights from "@/components/sections/Highlights";
import Sponsors from "@/components/sections/Sponsors";
import PromoModal from "@/components/modals/PromoModal";
import { getConfigWeb, getPromoModal } from "@/lib/api";

export default async function Home() {
  const [config, promoModal] = await Promise.all([getConfigWeb(), getPromoModal()]);
  const ticketsUrl = config.banner_tickets_url || config.ticketera_url;

  return (
    <>
      {/* Solo el Hero va dentro de PageContainer: es lo único que rota/escala cuando se abre el menú mobile */}
      <PageContainer>
        <Hero />
      </PageContainer>
      {config.mostrar_temporada !== false && (
        <Temporada
          bannerUrl={config.banner_url}
          bannerUrlMobile={config.banner_url_mobile}
          ticketsUrl={ticketsUrl}
        />
      )}
      <Eventos />
      {config.mostrar_galeria !== false && <Galeria />}
      <About />
      <Stats />
      {config.mostrar_highlights !== false && <Highlights />}
      <Sponsors />
      <PromoModal config={promoModal} />
    </>
  );
}
