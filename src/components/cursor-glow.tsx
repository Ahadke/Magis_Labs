import { useEffect, useRef } from "react";

export function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reducedMotion || !finePointer) return;

    document.body.classList.add("cursor-dot-active");

    const hide = () => {
      cursor.style.opacity = "0";
    };

    const usesNativeCursor = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest("iframe, input, textarea, select, [contenteditable='true']"),
      );
    };

    const onMove = (e: MouseEvent) => {
      // Iframes swallow events; text fields show a native I-beam. Hide so we don't stack cursors.
      if (usesNativeCursor(e.target)) {
        hide();
        return;
      }
      cursor.style.opacity = "1";
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const onOverNative = (e: MouseEvent) => {
      if (usesNativeCursor(e.target)) hide();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOverNative, true);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      document.body.classList.remove("cursor-dot-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOverNative, true);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div ref={cursorRef} id="cursor-glow" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 2L5 18L9.5 13.5L13 21L15.5 20L12 12.5L18.5 12.5L5 2Z"
          fill="#8C2860"
          stroke="#FFFFFF"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
