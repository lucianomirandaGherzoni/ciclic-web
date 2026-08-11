"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const isDesktop = window.innerWidth > 768;
    const video = isDesktop ? desktopVideoRef.current : mobileVideoRef.current;
    if (!video) return;

    video.querySelectorAll("source[data-src]").forEach((source) => {
      const el = source as HTMLSourceElement;
      el.src = el.dataset.src ?? "";
      el.removeAttribute("data-src");
    });
    video.load();

    const onLoadedData = () => {
      video.play().catch(() => {});
    };
    video.addEventListener("loadeddata", onLoadedData, { once: true });
    return () => video.removeEventListener("loadeddata", onLoadedData);
  }, []);

  return (
    <section className="hero relative flex h-dvh w-full items-center justify-center overflow-hidden p-4 pb-0 md:p-[1.9rem]">
      <div className="absolute inset-0 h-full w-full overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:bg-black/30 after:content-['']">
        <video
          ref={desktopVideoRef}
          className="absolute inset-0 hidden h-full w-full object-cover object-center [backface-visibility:hidden] [transform:translateZ(0)] md:block"
          loop
          muted
          playsInline
          preload="none"
        >
          <source data-src="/assets/Fondo-Ciclic.mp4" type="video/mp4" />
          <source data-src="/assets/fondo-ciclic.webm" type="video/webm" />
        </video>
        <video
          ref={mobileVideoRef}
          className="absolute inset-0 block h-full w-full object-cover object-center [backface-visibility:hidden] [transform:translateZ(0)] md:hidden"
          loop
          muted
          playsInline
          preload="none"
        >
          <source data-src="/assets/Fondo-Ciclic.mp4" type="video/mp4" />
        </video>
      </div>
      <h1 className="relative z-[2] pb-5 text-[1.3rem] font-semibold tracking-[1px] bg-gradient-to-b from-white via-[#fff2f2] to-[#e2dada] bg-clip-text text-transparent md:w-full md:text-[3.4rem] md:font-medium">
        20 AÑOS CREANDO <br />
        LA ESCENA ELECTRÓNICA
      </h1>
    </section>
  );
}
