import Newsletter from "./Newsletter";
import { toWhatsappUrl } from "@/lib/utils";

interface FooterProps {
  eventosDisponibles?: boolean;
  ticketsUrl?: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export default function Footer({
  eventosDisponibles = true,
  ticketsUrl,
  whatsapp,
  instagram,
  tiktok,
  youtube,
}: FooterProps) {
  const whatsappNumber = whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const reservaMesaHref = whatsappNumber
    ? toWhatsappUrl(whatsappNumber, "Hola! Quiero reservar una mesa.")
    : "#";
  const contactoHref = whatsappNumber
    ? toWhatsappUrl(whatsappNumber, "Hola! Quería hacerles una consulta.")
    : "#";
  return (
    <footer className="bg-secondary-black">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">CICLIC</h3>
            <p className="text-sm font-light text-white/70">
              + 20 años creando experiencias únicas a través de la música electrónica. Conectando artistas con
              audiencias apasionadas desde 2006.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-white">Eventos</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {eventosDisponibles && (
                <li>
                  <a href="#eventos" className="text-white/70 transition-colors hover:text-white">
                    Próximos Eventos
                  </a>
                </li>
              )}
              <li>
                <a href="#galeria" className="text-white/70 transition-colors hover:text-white">
                  Eventos Pasados
                </a>
              </li>
              <li>
                <a
                  href={reservaMesaHref}
                  target={whatsappNumber ? "_blank" : undefined}
                  rel={whatsappNumber ? "noopener noreferrer" : undefined}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  Reservar Mesa
                </a>
              </li>
              <li>
                <a
                  href={ticketsUrl || "#"}
                  target={ticketsUrl ? "_blank" : undefined}
                  rel={ticketsUrl ? "noopener noreferrer" : undefined}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  Tickets
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-white">Información</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a
                  href={contactoHref}
                  target={whatsappNumber ? "_blank" : undefined}
                  rel={whatsappNumber ? "noopener noreferrer" : undefined}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  Contacto
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/70 transition-colors hover:text-white">
                  Nuestra Historia
                </a>
              </li>
              <li>
                <a href="/politica-de-privacidad" className="text-white/70 transition-colors hover:text-white">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="/politica-de-devolucion-de-entradas"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  Política de Devolución
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-white">Seguinos</h4>
            <div className="mb-6 flex flex-col gap-2 text-sm">
              <a
                href={instagram || "#"}
                target={instagram ? "_blank" : undefined}
                rel={instagram ? "noopener noreferrer" : undefined}
                data-social="instagram"
                className="text-white/70 transition-colors hover:text-white"
              >
                Instagram
              </a>
              <a
                href={tiktok || "#"}
                target={tiktok ? "_blank" : undefined}
                rel={tiktok ? "noopener noreferrer" : undefined}
                data-social="tiktok"
                className="text-white/70 transition-colors hover:text-white"
              >
                TikTok
              </a>
              <a
                href={youtube || "#"}
                target={youtube ? "_blank" : undefined}
                rel={youtube ? "noopener noreferrer" : undefined}
                data-social="youtube"
                className="text-white/70 transition-colors hover:text-white"
              >
                YouTube
              </a>
            </div>
            <Newsletter />
          </div>
        </div>

        <div className="mt-16 text-center">
          <h1 className="text-4xl font-semibold uppercase tracking-wide text-white md:text-6xl">ciclic community</h1>
        </div>
      </div>
    </footer>
  );
}
