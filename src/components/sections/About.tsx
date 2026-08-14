"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const HIGHLIGHT_WORDS = [
  "CICLIC",
  "2016",
  "reinventarnos",
  "completamente",
  "extraordinarios",
  "pionera",
  "décadas",
];

const SUBTITLE = "De un ritual anual a orillas del lago, a ser los referentes de la escena en Bariloche.";

const BODY_PARAGRAPHS = [
  "Desde hace más de dos décadas, en Ciclic transformamos la pasión por la música en experiencias de altisímo nivel.",
  "Nuestra historia se divide en dos grandes etapas: la fundación icónica en el 2006 por Nicolás Cano y la evolución estratégica en 2018 junto a Manuel Lande. Esta sinergia entre trayectoria y frescura nos permite liderar eventos masivos durante todo el año, desde la costa del lago hasta la base del Cerro Catedral. No solo producimos eventos; creamos los momentos que definen tu paso por el Sur.",
];

function isHighlighted(word: string) {
  const clean = word.trim().replace(/[.,!?;:]/g, "");
  return HIGHLIGHT_WORDS.some((h) => clean.toLowerCase().includes(h.toLowerCase()));
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const subtitle = sectionRef.current?.querySelector<HTMLParagraphElement>(".about-subtitle");
      const paragraphs = sectionRef.current?.querySelectorAll<HTMLParagraphElement>(".about-text p");
      const image = sectionRef.current?.querySelector<HTMLDivElement>(".about-image");

      if (image) {
        gsap.set(image, { opacity: 0, x: 30 });
        ScrollTrigger.create({
          trigger: image,
          start: "top 85%",
          onEnter: () => gsap.to(image, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }),
        });
      }

      if (subtitle) {
        gsap.set(subtitle, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: subtitle,
          start: "top 85%",
          onEnter: () => gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }),
        });
      }

      paragraphs?.forEach((p) => {
        const words = p.querySelectorAll<HTMLSpanElement>(".about-word");
        gsap.set(p, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: p,
          start: "top 85%",
          onEnter: () => {
            gsap.to(p, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
            gsap.to(words, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              stagger: 0.02,
              ease: "power2.out",
              onComplete: () => {
                words.forEach((span) => {
                  if (span.dataset.highlight === "true") {
                    gsap.to(span, { color: "rgba(90, 90, 90, 1)", fontWeight: "600", duration: 0.5 });
                  }
                });
              },
            });
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section id="about" ref={sectionRef} className="about-section bg-primary-black px-4 pb-8 pt-16 md:py-24">
      <div className="about-container mx-auto max-w-[1100px]">
        {/* Imagen del equipo + tarjeta de texto superpuesta (layout tipo "bio card") */}
        <div className="about-content relative">
          <div className="about-image relative aspect-[4/5] w-full overflow-hidden rounded-image md:w-[38%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/ciclic-team.png"
              alt="Fundadores CICLIC - Historia y experiencia"
              width={400}
              height={500}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="about-text relative z-10 -mt-[15%] mx-auto w-[92%] rounded-container bg-secondary-black p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:p-8 md:absolute md:-right-10 md:top-1/2 md:mt-0 md:mx-0 md:w-[68%] md:-translate-y-1/2 md:p-10">
            <h2 className="mb-1 mt-0 p-0 text-left text-2xl normal-case leading-tight tracking-normal text-primary-white md:text-[2rem]">
              NUESTRA HISTORIA
            </h2>
            <p className="about-subtitle mb-4 font-sans text-sm font-medium leading-snug text-accent-pink opacity-0 md:mb-5 md:text-base">
              {SUBTITLE}
            </p>
            {BODY_PARAGRAPHS.map((text, pi) => {
              const words = text.split(" ");
              return (
                <p key={pi} className="mb-3 font-sans text-[0.9rem] leading-[1.6] last:mb-0 md:text-[0.95rem]">
                  {words.flatMap((word, wi) => {
                    const span = (
                      <span
                        key={`w-${wi}`}
                        data-highlight={isHighlighted(word) ? "true" : undefined}
                        className="about-word inline-block text-accent-gray-light opacity-0 [transform:translateY(10px)] transition-[color] duration-300"
                      >
                        {word}
                      </span>
                    );
                    // El espacio va como hermano fuera del span: un espacio DENTRO de un
                    // inline-block se recorta (se necesita inline-block para que el
                    // transform de GSAP funcione, ya que transform no aplica a inline).
                    return wi < words.length - 1 ? [span, " "] : [span];
                  })}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
