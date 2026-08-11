import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | CICLIC",
  description:
    "Términos y condiciones, política de privacidad y política de devolución de entradas de Ciclic Producciones S.A.S.",
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Aceptación de los Términos",
    body: 'Mediante el acceso a la página de CICLIC PRODUCCIONES S.A.S (CUIT N° 30-71809586-3), denominada CICLIC.AR (en adelante "CICLIC"), usted en su carácter de Usuario se compromete a cumplir con los presentes Términos y Condiciones. El presente dominio tiene como finalidad informar sobre nuestra política de privacidad relativa a la recopilación, uso y protección de datos personales. En caso de no aceptarlos, deberá abstenerse de utilizar el Sitio y sus servicios. CICLIC se reserva el derecho de modificar estos términos, los cuales entrarán en vigencia al ser publicados o notificados.',
  },
  {
    title: "2. Recopilación de Información",
    body: "Al navegar por el sitio, usted autoriza la recopilación de datos como número de teléfono, configuración del sistema, dirección IP, tipo de navegador, ubicación geográfica y tiempos de visita. También podemos solicitar datos personales como nombre, documento de identidad, correo electrónico y dirección postal.",
  },
  {
    title: "3. Finalidad de los Datos",
    body: "Utilizamos sus datos para permitir el acceso a los Sitios de CICLIC, mejorar la interacción, proporcionar soporte técnico, responder consultas y personalizar contenidos adaptados a sus intereses. Asimismo, los datos serán utilizados para el envío de comunicaciones promocionales, newsletters y novedades sobre nuestra grilla de eventos a través de correo electrónico o servicios de mensajería como WhatsApp.",
  },
  {
    title: "4. Información Compartida y Confidencialidad",
    body: "Los Datos Personales podrán revelarse a terceros, filiales o proveedores de servicios únicamente bajo nuestras instrucciones y para las finalidades descritas, manteniendo siempre el secreto profesional. CICLIC podrá revelar datos ante requerimientos legales, órdenes judiciales o para evitar daños económicos y fraudes. Los titulares autorizan la transferencia de datos en caso de venta o reestructuración de la empresa.",
  },
  {
    title: "5. Verificación y Datos Financieros",
    body: "El Usuario es responsable de la veracidad de los datos aportados, y CICLIC podrá consultar bases de datos públicas o privadas para verificarlos. Usted consiente que CICLIC recopile información sobre su historial de transacciones, billeteras virtuales (wallets) e identificación fiscal con el fin de supervisar actividades sospechosas y cumplir con la normativa de prevención de lavado de dinero.",
  },
  {
    title: "6. Protección de Datos Personales y Derechos ARCO",
    body: (
      <>
        Los datos formarán parte de una Base de Datos conforme a la Ley de Protección de Datos Personales N°
        25.326. El Usuario tiene el derecho de Acceso, Rectificación, Cancelación y Oposición (Derechos ARCO) de
        sus datos personales de manera gratuita. Para ejercerlos, deberá enviar una solicitud acreditando su
        identidad a{" "}
        <a href="mailto:produccion@ciclic.ar" className="text-primary-white underline hover:no-underline">
          produccion@ciclic.ar
        </a>
        . La Agencia de Acceso a la Información Pública (AAIP) es el órgano de control de la Ley 25.326.
      </>
    ),
  },
  {
    title: "7. Menores de Edad",
    body: "Los Sitios de CICLIC están destinados exclusivamente a mayores de 18 años. Los menores no están autorizados a registrarse. Si un padre o tutor detecta que un menor proporcionó datos, debe contactarnos inmediatamente.",
  },
  {
    title: "8. Servicios y Limitación por Ticketeras Externas",
    body: 'CICLIC no efectúa cobros ni ventas de tickets directamente a través de esta página. El uso del sitio no implica la celebración de un contrato ni obligación alguna entre las partes. Al actuar la web como un "hub" informativo, el Usuario reconoce que la compra de entradas se realiza en plataformas externas (ej. Passline, Venti). CICLIC no se responsabiliza por fallas técnicas, procesamiento de pagos o políticas de privacidad de dichas ticketeras.',
  },
  {
    title: "9. Uso de Imagen y Registro Audiovisual",
    body: "Al registrarse en este sitio y/o asistir a los eventos producidos por CICLIC, el Usuario presta su consentimiento expreso para que su imagen y voz sean captadas en soportes fotográficos y audiovisuales. El Usuario autoriza de forma gratuita e irrevocable el uso de dicho material con fines promocionales en este sitio web, redes sociales (Instagram, TikTok, Facebook) y carpetas de descarga pública (Google Drive), sin derecho a compensación alguna.",
  },
  {
    title: "10. Registro y Solicitud de Contacto",
    body: "Para registrarse, el solicitante debe ser mayor de 18 años y poseer capacidad legal para contratar. Se debe proporcionar información válida, veraz y vigente en el formulario de contacto.",
  },
  {
    title: "11. Enlaces a Otros Sitios",
    body: "El Sitio contiene enlaces a sitios operados por terceros (redes sociales, plataformas de venta de tickets, carpetas de fotos). CICLIC no asume responsabilidad alguna por el contenido, uso o prácticas de privacidad de dichos sitios ajenos. Se recomienda leer las políticas de privacidad de cada enlace visitado.",
  },
  {
    title: "12. Seguridad de los Datos",
    body: "Mantenemos medidas de seguridad técnicas y administrativas para proteger sus datos. Sin embargo, el Usuario reconoce que los medios técnicos no son inexpugnables y es posible sufrir manipulaciones o pérdida de información ajenas a nuestra voluntad. Si sospecha que su interacción no es segura, notifíquese a través de nuestra información de contacto.",
  },
  {
    title: "13. Compromiso del Usuario y Propiedad Intelectual",
    body: 'El Usuario es responsable de la correcta utilización del sitio y se compromete a no transmitir archivos dañinos ni intentar accesos no autorizados. Todo el contenido de este sitio, incluyendo pero no limitado a: diseños gráficos, logos, textos, videos de "highlights", fotos de venues y grillas de artistas, es propiedad exclusiva de CICLIC PRODUCCIONES S.A.S o cuenta con las licencias correspondientes. Queda prohibida su reproducción, distribución o uso comercial sin autorización expresa por escrito.',
  },
  {
    title: "14. Condiciones Adicionales y Contacto",
    body: (
      <>
        Regirán además las condiciones generales aplicables a las relaciones entre CICLIC y el Usuario. Para
        actualizar datos o ejercer sus derechos, puede escribir a{" "}
        <a href="mailto:produccion@ciclic.ar" className="text-primary-white underline hover:no-underline">
          produccion@ciclic.ar
        </a>
        .
      </>
    ),
  },
  {
    title: "15. Ley Aplicable y Jurisdicción",
    body: "Este documento se rige por las leyes de la República Argentina. Para cualquier controversia, las partes se someten a la jurisdicción de los Tribunales de la Ciudad de San Carlos de Bariloche, renunciando a cualquier otro fuero.",
  },
  {
    title: "16. Política de Devolución de Entradas",
    body: 'La devolución de tickets solo procederá en caso de suspensión del evento. Las plataformas de venta externas declaran explícitamente que no se aceptan cambios ni devoluciones por "errores" en la compra. Es responsabilidad exclusiva del comprador revisar los datos antes de confirmar. Por seguridad, no se permite el cambio de titularidad ni reventa; se requerirá DNI y QR a nombre del asistente para el ingreso. Todo lo anterior conforme a la Ley 24.240 y el Código Civil y Comercial de la Nación.',
  },
];

export default function PoliticaDePrivacidad() {
  return (
    <main className="mx-auto max-w-[800px] px-6 pb-24 pt-24 text-[15px] font-light leading-[1.8] text-[#f5f5f5] md:px-10">
      <h1 className="mb-2 text-[clamp(22px,4vw,32px)] font-bold uppercase tracking-[3px]">Términos y Condiciones</h1>
      <p className="mb-14 border-b border-white/10 pb-8 text-[13px] uppercase tracking-[2px] opacity-50">
        Ciclic Producciones S.A.S — CUIT N° 30-71809586-3
      </p>

      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-10">
          <h2 className="mb-4 text-left text-xs font-bold uppercase tracking-[3px] opacity-50">{section.title}</h2>
          <p className="opacity-85">{section.body}</p>
        </div>
      ))}
    </main>
  );
}
