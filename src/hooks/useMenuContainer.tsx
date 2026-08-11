"use client";

import { createContext, useContext, useRef, RefObject } from "react";

// El sitio viejo animaba (rotate/scale/translate) solo el div.container que
// envuelve al Hero cuando se abre el menú — no toda la página. Este contexto
// deja que Nav (dueño de la animación) y Hero (dueño del nodo) compartan el ref.
const MenuContainerContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function MenuContainerProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <MenuContainerContext.Provider value={ref}>{children}</MenuContainerContext.Provider>
  );
}

export function useMenuContainerRef() {
  const ctx = useContext(MenuContainerContext);
  if (!ctx) throw new Error("useMenuContainerRef debe usarse dentro de <MenuContainerProvider>");
  return ctx;
}
