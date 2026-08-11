"use client";

import type { GaleriaItemUI } from "@/lib/types";
import { AnimatedImageMarquee } from "@/components/ui/animated-image-marquee";

interface Props {
  items: GaleriaItemUI[];
}

export default function GaleriaMarquee({ items }: Props) {
  const marqueeItems = items.map((item) => ({
    src: item.src,
    title: item.dj,
    subtitle: item.date,
    href: item.drive,
  }));

  return <AnimatedImageMarquee items={marqueeItems} />;
}
