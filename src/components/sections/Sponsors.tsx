const LOGO_COUNT = 12;

export default function Sponsors() {
  return (
    <section id="sponsors" className="sponsors-section overflow-hidden pb-0">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 text-center">
        <p className="px-5 pb-0 pt-[45px] font-sans text-[1.1rem] uppercase leading-[1.4] text-primary-white max-[600px]:!py-10 max-[600px]:!text-[1.2rem]">
          Marcas que confían y hacen posible cada <span className="text-accent-pink">experiencia única.</span>
        </p>
        <div className="relative w-full overflow-hidden bg-primary-white py-4">
          <div className="flex items-center justify-center gap-0 [animation:desplazamiento-infinito_10s_linear_infinite] max-md:[animation:desplazamiento-infinito_1s_linear_infinite]">
            {Array.from({ length: LOGO_COUNT }).map((_, i) => (
              <div key={i} className="h-auto shrink-0 px-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/LOGOS-NEGRO.png"
                  alt="CICLIC Partners"
                  width={150}
                  height={50}
                  loading="lazy"
                  className="h-[35px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
