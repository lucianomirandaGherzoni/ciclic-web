import { Suspense } from "react";
import { getVenues } from "@/lib/api";
import HighlightsCarousel from "./HighlightsCarousel";

async function HighlightsData() {
  const venues = await getVenues();
  if (venues.length === 0) return null;
  return <HighlightsCarousel venues={venues} />;
}

// Placeholder liviano mientras HighlightsData espera la API (venues cargados desde
// el panel admin): mantiene el alto del carousel para evitar salto de layout, sin
// bloquear el resto de la página mientras el fetch está en vuelo.
function HighlightsSkeleton() {
  return (
    <div
      className="relative mx-auto h-[80vh] max-h-[700px] w-[90vw] max-w-[1400px] animate-pulse overflow-hidden rounded-image bg-secondary-black shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
      aria-hidden="true"
    />
  );
}

export default function Highlights() {
  return (
    <section id="highlights" className="galeria-carousel-section mx-auto flex max-w-[1500px] flex-col items-center justify-center bg-primary-black py-12">
      <div className="w-full">
        <h2>HIGHLIGHTS</h2>
        <p className="mb-12 mt-0 px-2.5 pb-2 text-center font-sans text-lg text-[#8f8f8f]">
          Un recorrido visual por nuestros <span className="text-accent-pink">eventos más memorables</span>
        </p>

        <Suspense fallback={<HighlightsSkeleton />}>
          <HighlightsData />
        </Suspense>
      </div>
    </section>
  );
}
