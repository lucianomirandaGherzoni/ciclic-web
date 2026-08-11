import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Devolución de Entradas | CICLIC",
  description: "Política de devolución de entradas de Ciclic Producciones S.A.S.",
};

export default function PoliticaDeDevolucion() {
  return (
    <main className="mx-auto max-w-[800px] px-6 pb-24 pt-24 text-[15px] font-light leading-[1.8] text-[#f5f5f5] md:px-10">
      <h1 className="mb-14 border-b border-white/10 pb-8 text-[clamp(22px,4vw,32px)] font-bold uppercase tracking-[3px]">
        Política de Devolución de Entradas
      </h1>

      <div className="space-y-4 opacity-85">
        <p>
          Solamente se procederá a realizar la devolución en el caso de suspensión del evento. Durante el proceso
          de compra, la plataforma de venta (Passline) declara expresamente que no se aceptarán cambios ni
          devoluciones. Por esta razón, invita a sus consumidores a revisar cuidadosamente los datos de su orden
          antes de confirmar la compra.
        </p>
        <p>
          Será de exclusiva responsabilidad del comprador la revisión de todos los antecedentes proporcionados en
          el proceso de compra y de las características de los eventos o servicios contratados.
        </p>
        <p>
          Por las nuevas normativas de seguridad, no se puede realizar el cambio de titularidad ni la reventa de
          entradas, pidiendo al usuario DNI y QR a su nombre para poder ingresar al evento.
        </p>
        <p>No se procederá a reembolsar por &quot;errores&quot; en la compra de dichos eventos y servicios.</p>
        <p>
          Las declaraciones anteriores se encuentran conforme con lo establecido con la Ley 24.240 y Código Civil
          y Comercial de la Nación.
        </p>
      </div>
    </main>
  );
}
