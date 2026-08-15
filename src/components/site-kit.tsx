import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/subscribe.functions";

export const ELDERBERRY = "#8C2860";
export const TWILIGHT = "#8C2860";
export const CHAMPAGNE = "#E4CBA5";

/* ------------------------------ Reveal ------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "-8% 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(26px)",
        transition: `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------ Text bits ------------------------------ */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em]"
      style={{ color: ELDERBERRY }}
    >
      <span
        className="h-px w-10"
        style={{ background: `linear-gradient(90deg, ${TWILIGHT}, transparent)` }}
      />
      {children}
    </span>
  );
}

export function DisplayHeading({
  children,
  className = "",
  centered = false,
}: {
  children: ReactNode;
  className?: string;
  centered?: boolean;
}) {
  return (
    <SectionHeading className={className} centered={centered}>
      {children}
    </SectionHeading>
  );
}

export function PageHeroHeading({
  children,
  className = "",
  inverted = false,
}: {
  children: ReactNode;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <h1
      className={`font-display leading-[0.95] tracking-[-0.045em] text-[3rem] sm:text-[4.2rem] lg:text-[5.2rem] ${
        inverted ? "text-white" : "text-black"
      } ${className}`}
    >
      {children}
    </h1>
  );
}

export function SectionHeading({
  children,
  className = "",
  as: Tag = "h2",
  centered = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  centered?: boolean;
}) {
  return (
    <Tag
      className={`font-display leading-[1.02] tracking-[-0.035em] text-black text-[2.2rem] md:text-[2.9rem] ${
        centered ? "text-center" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return (
    <em className="italic" style={{ color: TWILIGHT }}>
      {children}
    </em>
  );
}

/* ------------------------------ Buttons ------------------------------ */

export function SolidButton({
  to,
  hash,
  href,
  children,
  className = "",
}: {
  to?: string;
  hash?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `group inline-flex items-center gap-2 rounded-[8px] px-7 py-4 text-[13px] font-semibold tracking-wide text-white transition-all duration-500 hover:-translate-y-[2px] ${className}`;
  const style = {
    background: `linear-gradient(135deg, ${ELDERBERRY} 0%, ${TWILIGHT} 100%)`,
    boxShadow: "0 22px 50px -22px rgba(140,40,96,0.65)",
  };
  const inner = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
    </>
  );
  if (href)
    return (
      <a href={href} className={cls} style={style}>
        {inner}
      </a>
    );
  return (
    <Link to={to ?? "/contact"} hash={hash} className={cls} style={style}>
      {inner}
    </Link>
  );
}

export function GhostButton({
  to,
  hash,
  href,
  children,
  className = "",
}: {
  to?: string;
  hash?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `group inline-flex items-center gap-2 rounded-[8px] border px-7 py-4 text-[13px] font-semibold tracking-wide transition-all duration-500 hover:-translate-y-[2px] hover:bg-black/[0.03] ${className}`;
  const style = { borderColor: "rgba(0,0,0,0.14)", color: "#111" };
  const inner = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
    </>
  );
  if (href)
    return (
      <a href={href} className={cls} style={style}>
        {inner}
      </a>
    );
  return (
    <Link to={to ?? "/contact"} hash={hash} className={cls} style={style}>
      {inner}
    </Link>
  );
}

/* ------------------------------ Media ------------------------------ */

export function LoopVideo({
  src,
  className = "",
  poster,
}: {
  src: string;
  className?: string;
  poster?: string;
}) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      suppressHydrationWarning
      className={className}
    />
  );
}

/* ------------------------------ Accordion ------------------------------ */

export type Faq = { q: string; a: string };

export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-8 py-7 text-left transition-colors hover:opacity-80"
            >
              <span className="font-display text-[1.4rem] leading-tight tracking-[-0.02em] text-black sm:text-[1.7rem]">
                {f.q}
              </span>
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "#F6EDE8", color: ELDERBERRY }}
              >
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <div
              className="grid transition-all duration-500 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-8 text-[15.5px] leading-[1.8] text-black/60">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Newsletter ------------------------------ */

export function NewsletterForm({
  dark = false,
  whiteSurface = false,
}: {
  dark?: boolean;
  whiteSurface?: boolean;
}) {
  const subscribe = useServerFn(subscribeToNewsletter);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setState("loading");
    try {
      const result = await subscribe({ data: { email: trimmed } });
      setState("done");
      setMessage(
        (result as { message?: string })?.message ?? "You're on the list. Welcome.",
      );
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg">
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 sm:rounded-none sm:border sm:p-1.5 ${
          whiteSurface ? "border-black/[0.08] bg-white shadow-[0_8px_24px_-16px_rgba(0,0,0,0.08)]" : ""
        }`}
        style={{
          borderColor: whiteSurface
            ? undefined
            : dark
              ? "rgba(255,255,255,0.22)"
              : "rgba(0,0,0,0.12)",
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@organisation.com"
          aria-label="Email address"
          className={`w-full rounded-none border px-5 py-3.5 text-[14px] outline-none sm:py-2.5 ${
            whiteSurface
              ? "border-black/[0.08] bg-white text-black placeholder:text-black/40 sm:border-0"
              : dark
                ? "text-white placeholder:text-white/50 sm:border-0 sm:bg-transparent"
                : "border-black/[0.12] text-black placeholder:text-black/40 sm:border-0 sm:bg-transparent"
          }`}
          style={
            whiteSurface
              ? undefined
              : { borderColor: dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)" }
          }
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[8px] px-6 py-3.5 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] disabled:opacity-60 sm:py-3"
          style={{
            background: `linear-gradient(135deg, ${ELDERBERRY} 0%, ${TWILIGHT} 100%)`,
          }}
        >
          {state === "loading" ? "Joining…" : "Subscribe"}
          {state === "done" ? <Check className="h-4 w-4" /> : null}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-[13px] ${
            state === "error"
              ? "text-red-600"
              : dark
                ? "text-white/70"
                : "text-black/60"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
