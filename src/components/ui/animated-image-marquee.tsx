"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { shimmerDataUrl } from "@/lib/imagePlaceholder";

// El card mide h-60 (240px) en mobile y h-64 (256px) en md+, con aspect-[3/4]
// (ancho = alto * 3/4): 180px y 192px respectivamente.
const SIZES_CARD = "(max-width: 767px) 180px, 192px";

// Puerto fiel del marquee de fotos rotadas de "AnimatedMarqueeHero" (shadcn-style,
// framer-motion): mismas polaroids con rotación alternada y mismo mecanismo de
// loop (`animate` declarativo, sin drag ni botones, igual que el original).
// Se le sacó el rounded-2xl (esta web usa esquinas rectas en todos lados) y,
// a diferencia del original, cada foto trae metadata real de la API (DJ/fecha/
// link de Drive del evento) que solo se muestra en hover, para no romper el
// look "solo fotos" del componente de referencia en reposo.
export interface MarqueeCardItem {
  src: string;
  title: string;
  subtitle?: string;
  href?: string;
}

interface AnimatedImageMarqueeProps {
  items: MarqueeCardItem[];
  className?: string;
  /** segundos que tarda un ciclo completo del loop */
  duration?: number;
}

export function AnimatedImageMarquee({ items, className, duration = 35 }: AnimatedImageMarqueeProps) {
  const duplicated = [...items, ...items];
  const trackRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const x = useMotionValue(0);
  // Ancho de un solo set de items (la mitad del track duplicado) = distancia de un loop completo.
  const [loopWidth, setLoopWidth] = useState(0);

  useEffect(() => {
    if (trackRef.current) setLoopWidth(trackRef.current.scrollWidth / 2);
  }, [items]);

  // Loop manual cuadro a cuadro en lugar de un tween con `animate`/`transition`:
  // así el hover puede pausarlo exactamente donde está (sin el salto/reinicio
  // que se ve al frenar y reanudar un `animate` declarativo con keyframes).
  useAnimationFrame((_, delta) => {
    if (isPaused.current || loopWidth === 0) return;
    const pixelsPerSecond = loopWidth / duration;
    let next = x.get() - (pixelsPerSecond * delta) / 1000;
    if (next <= -loopWidth) next += loopWidth;
    x.set(next);
  });

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-6 md:py-8 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]",
        className,
      )}
      onMouseEnter={() => {
        isPaused.current = true;
      }}
      onMouseLeave={() => {
        isPaused.current = false;
      }}
    >
      <motion.div ref={trackRef} className="flex w-max gap-4" style={{ x }}>
        {duplicated.map((item, i) => {
          const label = [item.title, item.subtitle].filter(Boolean).join(" · ");
          const card = (
            <div
              style={{ rotate: `${i % 2 === 0 ? -2 : 5}deg` }}
              className="group relative aspect-[3/4] h-60 shrink-0 overflow-hidden bg-secondary-black shadow-md transition-transform duration-300 hover:z-20 hover:rotate-0! hover:scale-110 md:h-64"
            >
              <Image
                src={item.src}
                alt={label || "Foto de la galería"}
                fill
                sizes={SIZES_CARD}
                placeholder={shimmerDataUrl(192, 256)}
                draggable={false}
                className="pointer-events-none select-none object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-0.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 pt-8 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-white">{item.title}</span>
                {item.subtitle && (
                  <span className="text-[0.55rem] font-medium uppercase tracking-wide text-accent-gray-light">
                    {item.subtitle}
                  </span>
                )}
                {item.href && (
                  <span className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-wide text-white underline underline-offset-2">
                    Ver fotos
                  </span>
                )}
              </div>
            </div>
          );

          return item.href ? (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
              aria-label={label ? `Ver fotos: ${label}` : "Ver fotos"}
            >
              {card}
            </a>
          ) : (
            <div key={i}>{card}</div>
          );
        })}
      </motion.div>
    </div>
  );
}
