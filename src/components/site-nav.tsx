import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import logoBonsai from "@/assets/logo-bonsai-gradient-bg.png";
import { SOLUTION_NAV_ITEMS } from "@/data/solutions-nav";

const NAV = [
  { label: "Home", href: "/" as const },
  { label: "About", href: "/about" as const },
  { label: "Solutions", href: "/pricing" as const },
  { label: "Insights", href: "/our-work" as const },
  { label: "Contact", href: "/contact" as const },
] as const;

const NAV_FADE_DISTANCE = 120;

function mixChannel(from: number, to: number, t: number) {
  return Math.round(from + (to - from) * t);
}

function navLinkColor(blend: number) {
  return `rgba(${mixChannel(255, 0, blend)}, ${mixChannel(255, 0, blend)}, ${mixChannel(255, 0, blend)}, ${mixChannel(0.82, 0.7, blend)})`;
}

export function SiteNav() {
  const [scrollY, setScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isHome = pathname === "/";
  const isSolutions = pathname === "/pricing";
  const blend = isHome ? Math.min(1, scrollY / NAV_FADE_DISTANCE) : 1;
  const onHero = isHome && blend < 0.35;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!solutionsRef.current?.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const linkColor = navLinkColor(blend);
  const labsColor = "#484C56";
  const activeColor = blend < 0.5 && isHome ? "#fff" : "#8C2860";

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <div
        className="w-full"
        style={{
          backgroundColor: `rgba(245, 242, 239, ${blend * 0.97})`,
          backgroundImage: blend > 0.02 ? "var(--paper-grain)" : "none",
          backgroundSize: "180px 180px",
          backdropFilter: blend > 0.02 ? `blur(${20 * blend}px) saturate(150%)` : "none",
          borderBottom: `1px solid rgba(0,0,0,${blend * 0.06})`,
          transition:
            "background-color 200ms cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="mx-auto flex h-[74px] max-w-[1600px] items-center justify-between px-5 md:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoBonsai}
              alt="Magis Labs"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="font-display text-[22px] font-bold tracking-tight">
              <span style={{ color: "#8C2860" }}>Magis</span>
              <span style={{ color: labsColor }}>Labs</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) =>
              item.label === "Solutions" ? (
                <div
                  key={item.label}
                  className="site-nav-dd"
                  ref={solutionsRef}
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <Link
                    to="/pricing"
                    className="site-nav-dd__trigger rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium tracking-wide transition-colors duration-200"
                    style={{ color: isSolutions ? activeColor : linkColor }}
                    aria-expanded={solutionsOpen}
                    aria-haspopup="true"
                    onMouseEnter={(e) => {
                      if (onHero) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                      else e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Solutions
                    <ChevronDown className={`site-nav-dd__chevron ${solutionsOpen ? "is-open" : ""}`} />
                  </Link>
                  {solutionsOpen ? (
                    <div className="site-nav-dd__menu" role="menu">
                      {SOLUTION_NAV_ITEMS.map((tab) => (
                        <Link
                          key={tab.id}
                          to="/pricing"
                          hash={tab.id}
                          role="menuitem"
                          className="site-nav-dd__item"
                          onClick={() => setSolutionsOpen(false)}
                        >
                          {tab.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  activeProps={{ style: { color: activeColor } }}
                  activeOptions={{
                    exact: item.href === "/",
                  }}
                  className="rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium tracking-wide transition-colors duration-200"
                  style={{
                    color: linkColor,
                  }}
                  onMouseEnter={(e) => {
                    if (onHero) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    else e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              hash="book"
              className="hp-cta-btn hp-cta-btn--nav hidden sm:inline-flex"
            >
              Book an AI Strategy Call
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors duration-200 lg:hidden"
              style={{ color: linkColor }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav
            className="border-t px-5 pb-5 pt-3 lg:hidden"
            style={{
              borderColor: onHero ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
              backgroundColor: onHero ? "rgba(20,20,20,0.92)" : "var(--paper)",
              backgroundImage: onHero ? "none" : "var(--paper-grain)",
              backgroundSize: "180px 180px",
              backdropFilter: onHero ? "blur(20px)" : "none",
            }}
          >
            {NAV.map((item) =>
              item.label === "Solutions" ? (
                <div key={item.label}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium"
                    style={{ color: onHero ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.75)" }}
                    aria-expanded={mobileSolutionsOpen}
                    onClick={() => setMobileSolutionsOpen((v) => !v)}
                  >
                    Solutions
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${mobileSolutionsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileSolutionsOpen ? (
                    <div className="mb-1 ml-2 border-l border-black/10 pl-3">
                      <Link
                        to="/pricing"
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-3 py-2.5 text-[14px] font-medium"
                        style={{ color: onHero ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.75)" }}
                      >
                        All solutions
                      </Link>
                      {SOLUTION_NAV_ITEMS.map((tab) => (
                        <Link
                          key={tab.id}
                          to="/pricing"
                          hash={tab.id}
                          onClick={() => setOpen(false)}
                          className="block rounded-xl px-3 py-2.5 text-[14px] font-medium"
                          style={{ color: onHero ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.62)" }}
                        >
                          {tab.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-[15px] font-medium transition-colors"
                  style={{ color: onHero ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.75)" }}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              to="/contact"
              hash="book"
              onClick={() => setOpen(false)}
              className="hp-cta-btn mt-3 w-full justify-center"
            >
              Book an AI Strategy Call
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
