import { Link, useNavigate } from "@tanstack/react-router";
import gsap from "gsap";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { LoopVideo } from "@/components/site-kit";

export type AudienceMedia =
  | { type: "video"; src: string }
  | { type: "image"; src: string };

export type AudienceArcItem = {
  title: string;
  line: string;
  media: AudienceMedia;
  to: "/pricing";
  hash: "consulting" | "ai";
};

/** ~1cm at 96dpi — always kept between card edges. */
const GAP_PX = 38;
/** Target cards visible across the full stage. */
const VISIBLE_CARDS = 4;
/** Mild yaw so faces don't swing into the 1cm gap. */
const YAW_PER_SLOT = 10;
/** Concave bowl depth (px) — center sits further back. */
const BOWL_Z = 90;

function wrapDelta(index: number, progress: number, total: number) {
  let d = index - progress;
  d = ((((d + total / 2) % total) + total) % total) - total / 2;
  return d;
}

/**
 * Full-width 3D arc: 4 cards, ~1cm gaps, visible concave arch.
 * Spacing via translateX; arch via rotateY + bowl translateZ.
 * No auto-rotate — drag, edge hover, and click only.
 */
export function AudienceArcCarousel({ items }: { items: readonly AudienceArcItem[] }) {
  const total = items.length;
  const navigate = useNavigate();

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const tweenStateRef = useRef({ p: 0 });
  const autoPausedRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [metrics, setMetrics] = useState({
    cardW: 240,
    cardH: 310,
  });

  const dragRef = useRef({
    active: false,
    startX: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);

  const applyTransforms = (progress: number) => {
    const { cardW } = metrics;
    // Center-to-center pitch: exact card width + 1cm — never overlap
    const pitch = cardW + GAP_PX;
    const cards = cardRefs.current;
    let nearest = 0;
    let nearestAbs = Infinity;

    for (let i = 0; i < total; i++) {
      const el = cards[i];
      if (!el) continue;

      const slot = wrapDelta(i, progress, total);
      const abs = Math.abs(slot);
      if (abs < nearestAbs) {
        nearestAbs = abs;
        nearest = i;
      }

      const visible = abs <= VISIBLE_CARDS / 2 + 0.35;
      const t = Math.min(1, abs / (VISIBLE_CARDS / 2));
      const x = slot * pitch;
      // Mild arch only — no scale (scale was enlarging side cards into the gap)
      const rotY = -slot * YAW_PER_SLOT;
      // Concave: center further back, sides closer (no size-up compensation)
      const z = -BOWL_Z * Math.cos(slot * (Math.PI / (VISIBLE_CARDS + 0.5)));
      const opacity = visible ? 1 - t * 0.08 : 0;

      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg)`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(Math.round(100 - abs * 10));
      el.style.pointerEvents = visible ? "auto" : "none";
      el.style.width = `${cardW}px`;
      el.style.height = `${metrics.cardH}px`;
    }

    setActiveIndex(nearest);
  };

  // Full-page width: 4 cards + 1cm gaps
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth || el.getBoundingClientRect().width;
      if (w < 80) return;

      const cardW = Math.round(
        Math.min(340, Math.max(150, (w - (VISIBLE_CARDS - 1) * GAP_PX) / VISIBLE_CARDS)),
      );
      const cardH = Math.round(cardW * (360 / 280));
      setMetrics({ cardW, cardH });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useLayoutEffect(() => {
    applyTransforms(progressRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, total, items.length]);

  const snapToNearest = () => {
    const target = Math.round(progressRef.current);
    autoPausedRef.current = true;
    const state = tweenStateRef.current;
    state.p = progressRef.current;
    gsap.to(state, {
      p: target,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
      onUpdate: () => {
        progressRef.current = state.p;
        applyTransforms(state.p);
      },
      onComplete: () => {
        progressRef.current = ((target % total) + total) % total;
        applyTransforms(progressRef.current);
        autoPausedRef.current = false;
      },
    });
  };

  const goToIndex = (index: number) => {
    autoPausedRef.current = true;
    const current = progressRef.current;
    let delta = index - current;
    delta = ((((delta + total / 2) % total) + total) % total) - total / 2;
    const state = tweenStateRef.current;
    state.p = current;
    gsap.to(state, {
      p: current + delta,
      duration: 0.65,
      ease: "power3.out",
      overwrite: "auto",
      onUpdate: () => {
        progressRef.current = state.p;
        applyTransforms(state.p);
      },
      onComplete: () => {
        progressRef.current = index;
        applyTransforms(index);
        autoPausedRef.current = false;
      },
    });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    autoPausedRef.current = true;
    gsap.killTweensOf(tweenStateRef.current);
    dragRef.current = { active: true, startX: e.clientX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    const { cardW } = metrics;
    progressRef.current -= dx / (cardW + GAP_PX);
    dragRef.current.startX = e.clientX;
    applyTransforms(progressRef.current);
  };

  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    const moved = dragRef.current.moved;
    dragRef.current.active = false;
    snapToNearest();
    if (moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  // Edge hover nudge
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    let dir = 0;

    const tick = () => {
      if (dir !== 0 && !dragRef.current.active && !autoPausedRef.current) {
        progressRef.current += dir * 0.008;
        if (progressRef.current >= total) progressRef.current -= total;
        if (progressRef.current < 0) progressRef.current += total;
        applyTransforms(progressRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: globalThis.PointerEvent) => {
      if (dragRef.current.active) return;
      const rect = stage.getBoundingClientRect();
      const t = (e.clientX - rect.left) / rect.width;
      if (t < 0.2) dir = -1;
      else if (t > 0.8) dir = 1;
      else dir = 0;
    };
    const onLeave = () => {
      dir = 0;
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, total]);

  const { cardW, cardH } = metrics;

  return (
    <div className="hp-audience-carousel">
      <div
        ref={stageRef}
        className="hp-audience-carousel__stage"
        style={
          {
            ["--card-w"]: `${cardW}px`,
            ["--card-h"]: `${cardH}px`,
          } as CSSProperties
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="hp-audience-carousel__container">
          <div className="hp-audience-carousel__ring">
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={item.title}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`hp-audience-carousel__card${isActive ? " is-center" : ""}`}
                  role={isActive ? "link" : "button"}
                  tabIndex={0}
                  onClick={() => {
                    if (suppressClickRef.current) return;
                    if (isActive) {
                      void navigate({ to: item.to, hash: item.hash });
                      return;
                    }
                    goToIndex(index);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    if (isActive) {
                      void navigate({ to: item.to, hash: item.hash });
                      return;
                    }
                    goToIndex(index);
                  }}
                >
                  <div className="hp-audience-carousel__media">
                    {item.media.type === "video" ? (
                      <LoopVideo src={item.media.src} className="hp-audience__video" />
                    ) : (
                      <img
                        src={item.media.src}
                        alt=""
                        className="hp-audience__video"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    {!isActive ? (
                      <div className="hp-audience-carousel__dim" aria-hidden />
                    ) : null}
                  </div>
                  <div className="hp-audience-carousel__caption">
                    <h3 className="hp-audience-carousel__title font-display">{item.title}</h3>
                  </div>
                  {isActive ? (
                    <Link
                      to={item.to}
                      hash={item.hash}
                      className="hp-audience-carousel__sr-link"
                      tabIndex={-1}
                      aria-hidden
                    >
                      {item.title}
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
