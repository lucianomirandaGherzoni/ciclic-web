import { Suspense } from "react";
import { getGaleria } from "@/lib/api";
import GaleriaMarquee from "./GaleriaMarquee";

// TODO: reemplazar por el link real de la carpeta de Drive cuando lo pasen.
const DRIVE_URL = "#";

async function GaleriaData() {
  const items = await getGaleria();
  if (items.length === 0) return null;
  return <GaleriaMarquee items={items} />;
}

// Placeholder liviano mientras GaleriaData espera la API externa: mantiene el
// alto de la fila del marquee (evita salto de layout) sin bloquear el resto
// de la página ni la hidratación del router mientras el fetch está en vuelo.
function GaleriaSkeleton() {
  return (
    <div className="flex w-full gap-4 overflow-hidden py-6 md:py-8" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[3/4] h-48 shrink-0 animate-pulse bg-secondary-black md:h-64"
        />
      ))}
    </div>
  );
}

export default function Galeria() {
  return (
    <section id="galeria" className="galeria-section w-full overflow-hidden bg-primary-black pb-4 pt-12 md:w-screen md:pb-8 md:pt-20 md:[margin-left:calc(-50vw+50%)]">
      <div className="galeria-container mx-auto w-full px-0">
        <h2>ENCONTRATE EN LA PISTA</h2>
        <p className="mb-6 text-center font-sans text-sm text-[#8f8f8f]">
          Momentos <span className="text-accent-pink">inolvidables</span> donde fuiste parte de la magia.
        </p>
        <a
          href={DRIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mb-8 flex w-fit items-center justify-center gap-2 rounded-interactive border-[1.5px] border-white/20 bg-transparent px-6 py-[0.7rem] text-sm font-semibold uppercase tracking-[2px] text-white transition-all duration-300 hover:-translate-y-px hover:border-white/40 hover:bg-white/5"
        >
          <i className="fab fa-google-drive text-base" />
          Ver Drive
        </a>
        <Suspense fallback={<GaleriaSkeleton />}>
          <GaleriaData />
        </Suspense>
      </div>
    </section>
  );
}
