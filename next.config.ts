import type { NextConfig } from "next";

const UN_ANIO_EN_SEGUNDOS = 31536000;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mwdzrnqjflyebzwgvlfj.supabase.co",
        pathname: "/storage/v1/object/public/CICLIC-CONTENT/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Los assets ya vienen redimensionados server-side (tope 1920px de ancho,
    // ver ciclic-backend/config/imagen.mjs), así que no tiene sentido que Next
    // genere ni cachee variantes de 2048/3840: nunca se van a pedir.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Cada subida genera un nombre de archivo nuevo (timestamp + random) y la
    // fila de la DB pasa a apuntar al path nuevo — un mismo path nunca cambia
    // de contenido, así que se puede cachear "para siempre" sin riesgo de
    // servir una imagen vieja. Ver también el cacheControl del upload en
    // ciclic-backend/modulos/modelo.mjs (Fase 2 del pedido de cache-control).
    minimumCacheTTL: UN_ANIO_EN_SEGUNDOS,
  },
};

export default nextConfig;
