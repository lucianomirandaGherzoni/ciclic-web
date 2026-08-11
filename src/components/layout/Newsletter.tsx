"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origen: "footer" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div className="footer-newsletter">
      <h5 className="mb-1 text-sm font-medium text-white">Newsletter</h5>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Tu email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // El navegador (autofill/leak-detection de Chromium) inyecta style="caret-color"
          // en inputs de email/password antes de la hidratación — no es un mismatch real.
          suppressHydrationWarning
          className="min-w-0 flex-1 rounded border border-white/15 bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/40 focus:border-accent-gray-light focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded bg-white px-4 py-2 text-xs font-medium text-primary-black transition-colors hover:bg-accent-gray-light disabled:opacity-60"
        >
          {status === "success" ? "¡Listo!" : status === "loading" ? "..." : "Suscribirse"}
        </button>
      </form>
    </div>
  );
}
