"use client";

import type { ReactNode } from "react";
import { useMenuContainerRef } from "@/hooks/useMenuContainer";

export default function PageContainer({ children }: { children: ReactNode }) {
  const containerRef = useMenuContainerRef();

  return (
    <div ref={containerRef} className="container">
      {children}
    </div>
  );
}
