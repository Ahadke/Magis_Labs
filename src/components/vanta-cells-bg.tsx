import { useEffect, useRef } from "react";

type VantaEffect = { destroy: () => void };

type VantaCellsFactory = (options: Record<string, unknown>) => VantaEffect;

export function VantaCellsBackground({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffect | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let cancelled = false;

    async function mount() {
      const [threeModule, vantaModule] = await Promise.all([
        import("three"),
        import("vanta/dist/vanta.cells.min.js"),
      ]);

      if (cancelled || !hostRef.current) return;

      const THREE = (threeModule as { default?: unknown }).default ?? threeModule;
      const factory =
        ((vantaModule as { default?: VantaCellsFactory }).default ??
          vantaModule) as VantaCellsFactory;

      effectRef.current?.destroy();
      effectRef.current = factory({
        el: hostRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        color1: 0x98097d,
        color2: 0xa759a7,
        size: 2.5,
      });
    }

    void mount();

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden />;
}
