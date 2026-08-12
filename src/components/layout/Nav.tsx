"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";
import { useMenuContainerRef } from "@/hooks/useMenuContainer";
import { shimmerDataUrl } from "@/lib/imagePlaceholder";

interface MenuLink {
  href: string;
  label: string;
  external?: boolean;
}

const MENU_LINKS: MenuLink[] = [
  { href: "#", label: "PASSLINE TICKETS", external: true },
  { href: "#temporada", label: "WINTER SEASON" },
  { href: "#eventos", label: "PRÓXIMOS EVENTOS" },
  { href: "#about", label: "QUIENES SOMOS" },
  { href: "#galeria", label: "BUSCATE EN FOTOS" },
  { href: "#highlights", label: "SHOW HIGHLIGHTS" },
];

const MENU_SOCIALS = [
  { label: "Instagram", icon: "fa-instagram", social: "instagram" },
  { label: "YouTube", icon: "fa-youtube", social: "youtube" },
  { label: "TikTok", icon: "fa-tiktok", social: "tiktok" },
];

interface NavProps {
  ticketsUrl?: string;
  eventosDisponibles?: boolean;
  bannerImage?: string;
}

const DEFAULT_MENU_IMAGE = "/img/ciclic-logo-3.png";

export default function Nav({ ticketsUrl, eventosDisponibles = true, bannerImage }: NavProps) {
  const menuLinks = MENU_LINKS.filter((link) => eventosDisponibles || link.href !== "#eventos").map((link) =>
    link.label === "PASSLINE TICKETS"
      ? { ...link, href: ticketsUrl || process.env.NEXT_PUBLIC_TICKETS_URL || "#" }
      : link,
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const containerRef = useMenuContainerRef();
  const lenisRef = useLenis();

  useGSAP(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.3);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openMenu() {
    if (isAnimating.current || menuOpen) return;
    isAnimating.current = true;
    setMenuOpen(true);
    // eslint-disable-next-line react-hooks/immutability -- mutación de DOM global válida en un event handler, no durante el render
    document.body.style.overflow = "hidden";
    lenisRef.current?.stop();

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        rotation: 10,
        x: 300,
        y: 450,
        scale: 1.5,
        duration: 1.25,
        ease: "power4.inOut",
      });
    }
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.25,
        ease: "power4.inOut",
      });
    }
    gsap.to(".menu-link-item, .menu-social-item", {
      y: "0%",
      opacity: 1,
      duration: 1,
      delay: 0.75,
      stagger: 0.1,
      ease: "power3.inOut",
    });
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    }
  }

  function closeMenu() {
    if (isAnimating.current || !menuOpen) return;
    isAnimating.current = true;
    setMenuOpen(false);
    // eslint-disable-next-line react-hooks/immutability -- mutación de DOM global válida en un event handler, no durante el render
    document.body.style.overflow = "";
    lenisRef.current?.start();

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.25,
        ease: "power4.inOut",
      });
    }
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        rotation: -15,
        x: -100,
        y: -100,
        scale: 1.5,
        opacity: 0.25,
        duration: 1.25,
        ease: "power4.inOut",
      });
    }
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          isAnimating.current = false;
          gsap.set(".menu-link-item, .menu-social-item", { y: "120%", opacity: 0.25 });
        },
      });
    }
  }

  function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      closeMenu();
      setTimeout(() => {
        gsap.to(window, { duration: 2, scrollTo: { y: href, offsetY: 80 }, ease: "power2.inOut" });
      }, 1300);
    } else {
      closeMenu();
    }
  }

  // El logo lleva al inicio: si ya estamos en home, hace scroll suave arriba
  // en vez de recargar la página; si estamos en otra ruta (ej. políticas),
  // navega normalmente a "/" vía el href nativo.
  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== "/") return;
    e.preventDefault();
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else {
      gsap.to(window, { duration: 1.5, scrollTo: { y: 0 }, ease: "power2.out" });
    }
  }

  return (
    <>
      <nav
        className={`fixed z-[1000] flex min-h-[60px] w-full items-center justify-end px-6 py-6 transition-all duration-300 ${
          scrolled ? "bg-secondary-black/90 py-6 px-8 backdrop-blur-xl" : ""
        }`}
      >
        <Link
          href="/"
          onClick={handleLogoClick}
          aria-label="Ir al inicio"
          className="absolute left-8 top-1/2 z-[3] -translate-y-1/2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/logos/CICLIC-BLANCO.png"
            id="ciclic-logo"
            alt="CICLIC - Eventos de Música Electrónica Bariloche"
            width={120}
            height={40}
            className="h-5 w-auto [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.3))]"
          />
        </Link>

        <button
          type="button"
          onClick={() => (menuOpen ? closeMenu() : openMenu())}
          className="relative z-[3] flex min-h-11 min-w-11 items-center gap-3 p-3"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <p className={`text-sm font-light tracking-wide transition-opacity ${menuOpen ? "opacity-0" : ""}`}>
            MENU
          </p>
          <div className={`relative flex h-4 w-[22px] flex-col justify-between ${menuOpen ? "items-center" : ""}`}>
            <span
              className={`block h-px bg-white transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
                menuOpen ? "h-[1.5px] w-full translate-y-[7.5px] rotate-45" : "w-[18px]"
              }`}
            />
            <span
              className={`block h-px w-full bg-white transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
                menuOpen ? "h-[1.5px] translate-x-5 opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px bg-white transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
                menuOpen ? "h-[1.5px] w-full -translate-y-[7.5px] -rotate-45" : "w-[18px]"
              }`}
            />
          </div>
        </button>
      </nav>

      <div
        ref={overlayRef}
        className={`fixed inset-0 h-dvh w-screen bg-primary-black ${menuOpen ? "z-50" : "z-[1]"}`}
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
      >
        <div
          ref={contentRef}
          className="relative flex h-full w-full origin-bottom-left scale-150 flex-col items-center justify-center gap-8 p-4 opacity-25 [transform:rotate(-15deg)_translate(-100px,-100px)] md:flex-row md:flex-wrap"
        >
          <div className="flex w-full flex-1 flex-col gap-8 p-4 md:flex-row">
            <div className="hidden flex-[3] md:flex md:items-center md:justify-center">
              <div className="relative h-full w-1/2 overflow-hidden rounded-image [@media(min-width:1024px)_and_(max-width:1366px)]:w-[45%]">
                <Image
                  src={bannerImage || DEFAULT_MENU_IMAGE}
                  alt=""
                  fill
                  sizes="40vw"
                  placeholder={shimmerDataUrl(700, 900)}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-[2] flex-col justify-center gap-8 py-6 text-white md:gap-[1.9rem] md:py-[1.9rem]">
              <div className="flex flex-col gap-2">
                {menuLinks.map((link) => (
                  <div key={link.label} className="overflow-hidden pb-1.5">
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="menu-link-item relative inline-block translate-y-[120%] text-[1.9rem] font-extralight tracking-[-0.02rem] opacity-25 transition-colors duration-500 hover:text-accent-pink md:text-[2rem] md:font-normal"
                    >
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {MENU_SOCIALS.map((s) => (
                  <div key={s.label} className="overflow-hidden pb-1.5">
                    <a
                      href="#"
                      data-social={s.social}
                      onClick={closeMenu}
                      className="menu-social-item inline-block translate-y-[120%] text-[#8f8f8f] opacity-25 transition-colors duration-500 hover:text-white"
                    >
                      <i className={`fab ${s.icon} mr-1`} /> {s.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
