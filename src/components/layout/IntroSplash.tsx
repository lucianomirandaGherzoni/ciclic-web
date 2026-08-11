"use client";

import { useEffect, useState } from "react";

export default function IntroSplash() {
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div
      id="intro-splash"
      onTransitionEnd={() => fadeOut && setHidden(true)}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-[900ms] ease-in-out ${
        fadeOut ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/ciclic-logo-3.png"
        alt="CICLIC"
        className="h-auto w-[60vw] max-w-[280px] scale-[0.88] object-contain opacity-0 [animation:splashLogoIn_0.6s_ease-out_0.2s_forwards] md:w-auto md:max-w-[320px]"
      />
    </div>
  );
}
