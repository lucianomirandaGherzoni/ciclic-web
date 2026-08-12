// Placeholder "shimmer" para next/image en imágenes remotas (Storage): al ser
// remotas, Next no puede generar un blurDataURL real a partir del archivo (eso
// solo pasa con imports estáticos). En vez de blur real, se muestra un SVG con
// una animación de barrido mientras carga — mejora la percepción de carga sin
// requerir pre-procesar cada imagen.
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#1a1a1a" offset="20%" />
      <stop stop-color="#2a2a2a" offset="50%" />
      <stop stop-color="#1a1a1a" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#1a1a1a" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

export function shimmerDataUrl(w: number, h: number): `data:image/${string}` {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
}
