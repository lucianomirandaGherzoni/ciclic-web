import type { Metadata, Viewport } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/hooks/useLenis";
import { MenuContainerProvider } from "@/hooks/useMenuContainer";
import IntroSplash from "@/components/layout/IntroSplash";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import { getConfigWeb, getEventos } from "@/lib/api";

// Arimo está dibujada para ser métricamente idéntica a Helvetica/Arial: es la
// forma de tener "Helvetica" de verdad en todos los sistemas operativos (real
// Helvetica no es una web font licenciable) sin depender de qué tenga
// instalado cada usuario.
const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Mismo dominio placeholder que usaba el sitio viejo (ciclic-demo-v1.vercel.app) —
// actualizar a la URL real de producción en la Fase 13 (corte de dominio).
const SITE_URL = "https://ciclic-demo-v1.vercel.app";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "CICLIC - Eventos de Música Electrónica en Bariloche | Los Mejores DJs",
  description:
    "Descubre los mejores eventos de música electrónica en Bariloche con CICLIC. Experiencias únicas con los mejores DJs internacionales, festivales de verano e invierno. Reservá tu entrada.",
  keywords: [
    "CICLIC",
    "música electrónica",
    "eventos Bariloche",
    "DJs",
    "fiestas electrónicas",
    "festivales",
    "techno",
    "house",
    "progressive",
    "Patagonia",
    "Argentina",
  ],
  authors: [{ name: "CICLIC" }],
  icons: {
    icon: "/img/logos/Ciclic-CIRCULO-negro.png",
    apple: "/img/logos/Ciclic-CIRCULO-negro.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "CICLIC - Eventos de Música Electrónica en Bariloche",
    description: "CICLIC te invita a vivir la escena de música electrónica en Bariloche. Los mejores eventos te esperan.",
    images: [`${SITE_URL}/img/ciclic-logo-3.png`],
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CICLIC - Eventos de Música Electrónica",
    description: "Los mejores eventos de música electrónica en Bariloche.",
    images: [`${SITE_URL}/img/ciclic-logo-3.png`],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "NightClub",
  name: "CICLIC",
  description:
    "Eventos de música electrónica en Bariloche desde el 2006. Festivales de verano e invierno con los mejores DJs internacionales.",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/img/ciclic-logo-3.png`,
  image: `${SITE_URL}/img/hero/hero-desktop-04.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Carlos de Bariloche",
    addressRegion: "Río Negro",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-41.1335",
    longitude: "-71.3103",
  },
  foundingDate: "2006",
  sameAs: ["https://www.instagram.com/ciclic.ar/", "https://www.facebook.com/ciclic.ar"],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [config, eventos] = await Promise.all([getConfigWeb(), getEventos()]);
  // Mismo criterio que la sección Eventos (config.mostrar_eventos + que haya
  // eventos activos): si la sección no se renderiza, tampoco debe verse el
  // link "#eventos" en el Nav ni en el Footer.
  const eventosDisponibles = config.mostrar_eventos !== false && eventos.length > 0;

  return (
    <html lang="es" className={arimo.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      {/* suppressHydrationWarning: extensiones de navegador (ej. ColorZilla) inyectan
          atributos como cz-shortcut-listen en <body> antes de que React hidrate. */}
      <body className="bg-primary-black text-primary-white" suppressHydrationWarning>
        <MenuContainerProvider>
          <LenisProvider>
            <IntroSplash />
            <Nav
              ticketsUrl={config.ticketera_url}
              eventosDisponibles={eventosDisponibles}
              bannerImage={config.banner_url_mobile}
              instagram={config.instagram}
              tiktok={config.tiktok}
              youtube={config.youtube}
            />
            {children}
            <Footer
              eventosDisponibles={eventosDisponibles}
              ticketsUrl={config.ticketera_url}
              whatsapp={config.whatsapp}
              instagram={config.instagram}
              tiktok={config.tiktok}
              youtube={config.youtube}
            />
            <FloatingButtons whatsappNumber={config.whatsapp} />
          </LenisProvider>
        </MenuContainerProvider>
      </body>
    </html>
  );
}
