"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STATS = [
  { value: 300, isM: false, label: "Eventos Realizados" },
  { value: 800, isM: false, label: "Artistas Presentados" },
  { value: 250, isM: true, label: "Personas Conectadas" },
  { value: 20, isM: false, label: "Años de Experiencia" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const items = itemRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            onComplete: () => {
              STATS.forEach((stat, i) => {
                const el = numberRefs.current[i];
                if (!el) return;
                const counter = { val: 0 };
                gsap.to(counter, {
                  val: stat.value,
                  duration: 2,
                  delay: i * 0.2,
                  ease: "power2.out",
                  onUpdate: () => {
                    const curr = Math.floor(counter.val);
                    el.textContent = stat.isM ? `${curr}M` : `${curr}`;
                  },
                  onComplete: () => {
                    gsap.to(el, { color: "#d1d5db", duration: 0.6 });
                  },
                });
              });
            },
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section id="stats" ref={sectionRef} className="stats-section bg-primary-black px-4 pb-6 pt-2 md:py-6">
      <div className="stats-container mx-auto max-w-[1200px]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:gap-6">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="rounded-container border border-white/5 bg-white/[0.02] p-4 text-center transition-transform duration-200 md:p-6"
            >
              <div className="mb-1 font-heading text-2xl font-bold text-accent-pink md:text-[2.25rem]">
                <span className="mr-1.5 inline-block font-bold text-accent-pink">+</span>
                <span
                  ref={(el) => {
                    numberRefs.current[i] = el;
                  }}
                >
                  0
                </span>
              </div>
              <div className="font-sans text-[0.85rem] font-normal text-accent-gray-light">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
