"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const MARQUEE_TEXT = "TU ONDA NOS ENCUENTRA - NUESTRA COMUNIDAD TE RECIBE - LA FIESTA ES TU CASA";
const MARQUEE_REPEATED = `${MARQUEE_TEXT} ${MARQUEE_TEXT} ${MARQUEE_TEXT} `;

const DEFAULT_VIDEO_SRC =
  "https://mwdzrnqjflyebzwgvlfj.supabase.co/storage/v1/object/public/CICLIC-CONTENT/1786131760471-dyd6fkly754.mp4";
const DEFAULT_IMG_SRC = "/img/summer-flyer-desktop.png";
const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov"];

interface TemporadaProps {
  bannerUrl?: string;
  bannerUrlMobile?: string;
  ticketsUrl?: string;
}

export default function Temporada({ bannerUrl, bannerUrlMobile, ticketsUrl }: TemporadaProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [media, setMedia] = useState<{ type: "video" | "image"; src: string }>({
    type: "video",
    src: DEFAULT_VIDEO_SRC,
  });
  const [videoFailed, setVideoFailed] = useState(false);

  // El banner de temporada viene de config_web (banner_url / banner_url_mobile);
  // si no hay dato en la API, se mantiene el video de fallback hardcodeado.
  // window.innerWidth no existe en SSR, así que esto no se puede derivar durante
  // el render — debe resolverse post-hidratación en un efecto.
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const resolvedUrl = isMobile ? bannerUrlMobile || bannerUrl : bannerUrl || bannerUrlMobile;
    if (!resolvedUrl) return;
    const ext = resolvedUrl.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza con window.innerWidth, no derivable en render (SSR)
    setMedia({ type: VIDEO_EXTENSIONS.includes(ext) ? "video" : "image", src: resolvedUrl });
  }, [bannerUrl, bannerUrlMobile]);

  // Reproduce el video de temporada una sola vez y lo deja en el último frame;
  // si falla (autoplay bloqueado, error de carga) cae a la imagen fija.
  useEffect(() => {
    if (media.type !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    video.load();
    const onEnded = () => video.pause();
    const onError = () => setVideoFailed(true);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    const playPromise = video.play();
    if (playPromise !== undefined) playPromise.catch(onError);

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, [media]);

  useGSAP(
    () => {
      if (track1Ref.current) {
        const tl1 = gsap.timeline({ repeat: -1 });
        tl1.fromTo(track1Ref.current, { x: "0%" }, { x: "-50%", duration: 350, ease: "none" });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => tl1.timeScale(1 + self.progress * 1),
          onLeave: () => tl1.timeScale(1),
          onEnterBack: () => tl1.timeScale(1),
        });
      }
      if (track2Ref.current) {
        const tl2 = gsap.timeline({ repeat: -1 });
        tl2.fromTo(track2Ref.current, { x: "-50%" }, { x: "0%", duration: 350, ease: "none" });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => tl2.timeScale(1 + self.progress * 1),
          onLeave: () => tl2.timeScale(1),
          onEnterBack: () => tl2.timeScale(1),
        });
      }
    },
    { scope: sectionRef },
  );

  const mediaClass =
    "block max-h-[525px] max-w-[262px] rounded-image object-cover shadow-[0_10px_40px_rgba(0,0,0,0.5)] md:h-auto md:w-[62vw] md:min-w-[520px] md:max-w-[1000px] max-md:h-auto max-md:max-h-none max-md:w-full max-md:max-w-full";
  const showImage = media.type === "image" || videoFailed;

  return (
    <section id="temporada">
      <div className="relative z-0 mt-4 w-full pb-4 pt-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/SUMMER-SEASON.png"
          alt="CICLIC Summer Season 2025 & 2026 - Temporada de Verano"
          width={300}
          height={100}
          loading="lazy"
          className="mx-auto block h-auto w-[90%] max-w-[225px]"
        />
      </div>

      <div
        ref={sectionRef}
        className="relative flex w-full items-center justify-center overflow-hidden pt-2 md:pt-3"
      >
        <div className="absolute inset-x-0 top-[20%] z-[1] h-[105px] overflow-hidden text-[60px] font-thin uppercase text-primary-white opacity-50">
          <div ref={track1Ref} className="absolute whitespace-nowrap will-change-transform">
            {MARQUEE_REPEATED}
          </div>
        </div>
        <div className="absolute inset-x-0 top-[45%] z-[1] flex h-[105px] items-center overflow-hidden text-[60px] font-thin uppercase text-primary-white opacity-50">
          <div ref={track2Ref} className="absolute whitespace-nowrap will-change-transform">
            {MARQUEE_REPEATED}
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] justify-center">
          <div className="group relative h-fit w-fit rounded-image shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-md:w-[90vw] max-md:max-w-[320px]">
            {!showImage && (
              <video ref={videoRef} muted playsInline preload="auto" className={mediaClass}>
                <source src={media.src} type="video/mp4" />
                Tu navegador no soporta videos.
              </video>
            )}
            {showImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.type === "image" ? media.src : DEFAULT_IMG_SRC}
                alt="Flyer temporada verano - versión desktop"
                width={262}
                height={525}
                loading="lazy"
                className={mediaClass}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-image bg-black/50 opacity-0 backdrop-blur-[3px] transition-opacity duration-300 group-hover:opacity-100">
              <a
                href={ticketsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 font-semibold text-white no-underline transition-opacity duration-300 hover:opacity-80"
              >
                <i className="bi bi-ticket-detailed-fill text-[2.5rem]" />
                <span className="text-[1.2rem] uppercase tracking-[3px]">TICKETS</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
