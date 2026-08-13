# Magis Labs — Full Website Source (bundled)

Generated from `src/`. Assets (videos/images) stay in `src/assets/` and are referenced by import paths.

---

## `src/router.tsx`

```tsx
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
```

---

## `src/start.ts`

```ts
import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
```

---

## `src/server.ts`

```ts
import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
```

---

## `src/routes/__root.tsx`

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CursorGlow } from "../components/cursor-glow";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Magis Labs — Helping Eldercare Businesses Grow, Scale, and Innovate with AI" },
      {
        name: "description",
        content:
          "Magis Labs partners with eldercare organizations to accelerate growth through AI, marketing, and long-term business strategy.",
      },
      { name: "author", content: "Magis Labs Co" },
      { property: "og:title", content: "Magis Labs — Helping Eldercare Businesses Scale" },
      {
        property: "og:description",
        content:
          "AI, marketing, and long-term strategy for assisted living, home care, hospice, and aging services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <CursorGlow />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
```

---

## `src/routes/index.tsx`

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Play } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  LoopVideo,
  Reveal,
  ELDERBERRY,
  TWILIGHT,
} from "@/components/site-kit";
import homeHeroVideo from "@/assets/home-hero.mp4";
import longevityVideo from "@/assets/who-we-serve-longevity.mp4";
import videoProduction from "@/assets/video-production.mp4";
import eldercareVideo from "@/assets/who-we-serve-eldercare.mp4";
import aiStartupsVideo from "@/assets/who-we-serve-ai-startups.mp4";
import brandUiuxImg from "@/assets/what-we-do-uiux.png";
import seoImg from "@/assets/what-we-do-seo.png";
import droneImg from "@/assets/what-we-do-drone.png";
import webSpanishImg from "@/assets/work-web-spanish-center-dubai.png";
import webRandeepImg from "@/assets/work-web-randeep-wadhawan.png";
import webNikhilImg from "@/assets/work-web-nikhil-mahajan.png";
import workLaunchVideo from "@/assets/work-launch-debut.mp4";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Magis Labs — Healthcare Growth Partner" },
      {
        name: "description",
        content:
          "Magis Labs is an end-to-end healthcare growth partner. Branding, content, AI, marketing, and technology for clinics, care organizations, and healthtech.",
      },
      {
        property: "og:title",
        content: "Magis Labs — Healthcare Growth Partner",
      },
      {
        property: "og:description",
        content:
          "We build, market, and scale healthcare businesses with branding, content, AI, and growth strategy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const HERO_CLIPS = [
  homeHeroVideo,
  longevityVideo,
  videoProduction,
  eldercareVideo,
  aiStartupsVideo,
] as const;

const CLIP_DURATION = 2.8;

const PROOF_ITEMS = [
  {
    label: "Spanish Center Dubai",
    image: webSpanishImg,
    href: "/our-work" as const,
  },
  {
    label: "Dr Randeep Wadhawan",
    image: webRandeepImg,
    href: "/our-work" as const,
  },
  {
    label: "Dr Nikhil Mahajan",
    image: webNikhilImg,
    href: "/our-work" as const,
  },
  {
    label: "Launch campaign",
    video: workLaunchVideo,
    href: "/our-work" as const,
  },
] as const;

const TRUST_MARKS = [
  "Smile Hair Clinic",
  "Spanish Center Dubai",
  "Dr Neil Galletly",
  "Dr Kavya Dendukuri",
  "Dr Nikhil Mahajan",
] as const;

function HomePage() {
  return (
    <div className="relative min-h-screen bg-white text-foreground">
      <SiteNav />
      <Hero />
      <WhyWeExist />
      <WhatWeDo />
      <WhoWeServe />
      <Vision />
      <Proof />
      <ClosingCta />
      <SiteFooter />
    </div>
  );
}

function StrategyCallButton({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link
      to="/contact"
      hash="book"
      className={`hp-cta-btn ${inverted ? "hp-cta-btn--inverted" : ""} ${className}`}
    >
      Book an AI Strategy Call
    </Link>
  );
}

/* ================================ HERO ================================ */

function HeroVideoSequence() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [clipIndex, setClipIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = HERO_CLIPS[clipIndex];
    video.load();
    void video.play().catch(() => {});

    const onTimeUpdate = () => {
      if (video.currentTime >= CLIP_DURATION) {
        setClipIndex((current) => (current + 1) % HERO_CLIPS.length);
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [clipIndex]);

  return (
    <video
      ref={videoRef}
      className="hp-hero__video"
      muted
      playsInline
      preload="auto"
      aria-hidden
    />
  );
}

function Hero() {
  return (
    <section className="hp-hero">
      <HeroVideoSequence />
      <div className="hp-hero__overlay" aria-hidden />
      <div className="hp-hero__content">
        <Reveal>
          <h1 className="hp-hero__headline font-display">
            We build, market, and scale healthcare businesses.
          </h1>
          <p className="hp-hero__subhead">
            Branding, content, AI, and growth, for every kind of healthcare
            organization.
          </p>
          <StrategyCallButton className="mt-10" />
        </Reveal>
      </div>
      <a href="#why" className="hp-hero__scroll" aria-label="Scroll to content">
        <span className="hp-hero__scroll-line" />
        <ChevronDown className="hp-hero__scroll-icon" strokeWidth={1.5} />
      </a>
    </section>
  );
}

/* ========================= WHY WE EXIST ========================= */

function WhyWeExist() {
  return (
    <section id="why" className="hp-why">
      <Reveal>
        <p className="hp-why__statement font-display">
          Healthcare professionals need the right tools to build their brand and
          scale with confidence. We make that effortless.
        </p>
      </Reveal>
    </section>
  );
}

/* ============================== WHAT WE DO ============================== */

type BentoTileProps = {
  title: string;
  video?: string;
  image?: string;
  gradient?: string;
  showPlay?: boolean;
};

function BentoTile({
  title,
  video,
  image,
  gradient,
  showPlay = false,
}: BentoTileProps) {
  return (
    <Link to="/pricing" className="hp-bento__tile group">
      <div className="hp-tile__media">
        {video ? (
          <LoopVideo src={video} className="hp-tile__video" />
        ) : gradient ? (
          <div className="hp-tile__gradient" style={{ background: gradient }} />
        ) : image ? (
          <img src={image} alt="" loading="lazy" className="hp-tile__image" />
        ) : null}
        {showPlay && !video ? (
          <span className="hp-tile__play" aria-hidden>
            <Play className="h-5 w-5 fill-white text-white" strokeWidth={0} />
          </span>
        ) : null}
        <div className="hp-tile__scrim" aria-hidden />
        <h3 className="hp-tile__title font-display">{title}</h3>
      </div>
    </Link>
  );
}

function WhatWeDo() {
  return (
    <section id="capabilities" className="hp-capabilities">
      <div className="hp-section-inner">
        <Reveal>
          <div className="hp-section-head">
            <p className="hp-eyebrow">What we do</p>
            <h2 className="hp-section-title font-display">
              Full-stack growth for healthcare.
            </h2>
          </div>
        </Reveal>

        <div className="hp-bento">
          <Reveal delay={40} className="hp-bento__cell hp-bento__cell--lg">
            <BentoTile title="Content & Creative" video={videoProduction} />
          </Reveal>
          <Reveal delay={80} className="hp-bento__cell hp-bento__cell--lg">
            <BentoTile
              title="Growth & Marketing"
              gradient={`linear-gradient(145deg, ${ELDERBERRY} 0%, #5c1f45 42%, #2a1524 100%)`}
              showPlay
            />
          </Reveal>
          <Reveal delay={120} className="hp-bento__cell hp-bento__cell--md">
            <BentoTile
              title="Brand & Digital Experience"
              image={brandUiuxImg}
              showPlay
            />
          </Reveal>
          <Reveal delay={160} className="hp-bento__cell hp-bento__cell--md">
            <BentoTile
              title="AI & Automation"
              gradient={`linear-gradient(145deg, ${TWILIGHT} 0%, #6b3a62 45%, #241820 100%)`}
              showPlay
            />
          </Reveal>
          <Reveal delay={200} className="hp-bento__cell hp-bento__cell--sm">
            <BentoTile title="Search Visibility" image={seoImg} showPlay />
          </Reveal>
          <Reveal delay={240} className="hp-bento__cell hp-bento__cell--sm">
            <BentoTile title="Aerial & Facility Marketing" image={droneImg} showPlay />
          </Reveal>
        </div>

        <Reveal delay={280}>
          <div className="mt-10">
            <Link to="/pricing" className="hp-secondary-link group">
              Explore Solutions
              <ArrowUpRight className="h-4 w-4 transition-transform duration-[350ms] ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================ WHO WE SERVE ============================ */

type FocusCardProps = {
  title: string;
  line: string;
  video: string;
  delay?: number;
};

function FocusCard({ title, line, video, delay = 0 }: FocusCardProps) {
  return (
    <Reveal delay={delay} className="hp-focus__cell">
      <Link to="/contact" className="hp-focus__card group">
        <LoopVideo src={video} className="hp-focus__video" />
        <div className="hp-focus__scrim" aria-hidden />
        <div className="hp-focus__copy">
          <h3 className="hp-focus__title font-display">{title}</h3>
          <p className="hp-focus__line">{line}</p>
        </div>
      </Link>
    </Reveal>
  );
}

function WhoWeServe() {
  return (
    <section id="focus" className="hp-focus">
      <div className="hp-section-inner">
        <Reveal>
          <div className="hp-section-head hp-section-head--narrow">
            <p className="hp-eyebrow">Who we serve</p>
            <h2 className="hp-section-title font-display">
              Every corner of healthcare.
            </h2>
          </div>
        </Reveal>

        <div className="hp-focus__grid">
          <FocusCard
            title="Clinics & Practices"
            line="Private, specialty, and multi-location practices."
            video={longevityVideo}
            delay={40}
          />
          <FocusCard
            title="Care & Senior Organizations"
            line="Living communities, home care, and campus care."
            video={eldercareVideo}
            delay={80}
          />
          <FocusCard
            title="Healthcare Technology & Innovation"
            line="Startups, platforms, and emerging health tech."
            video={aiStartupsVideo}
            delay={120}
          />
        </div>
      </div>
    </section>
  );
}

/* =============================== VISION =============================== */

function Vision() {
  return (
    <section id="vision" className="hp-vision">
      <div className="hp-vision__motion" aria-hidden />
      <Reveal>
        <p className="hp-vision__text font-display">
          We envision a future where healthcare businesses build, innovate, and
          scale effortlessly, from smarter clinics today to what&apos;s next.
        </p>
      </Reveal>
    </section>
  );
}

/* ================================ PROOF ================================ */

function Proof() {
  return (
    <section id="work" className="hp-proof">
      <div className="hp-section-inner">
        <Reveal>
          <div className="hp-proof__head">
            <p className="hp-eyebrow">Our work</p>
            <Link to="/our-work" className="hp-secondary-link group">
              See Our Work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-[350ms] ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="hp-proof__scroll-wrap">
          <div className="hp-proof__track">
            {PROOF_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="hp-proof__card group"
              >
                {"video" in item && item.video ? (
                  <LoopVideo src={item.video} className="hp-proof__media" />
                ) : (
                  <img
                    src={"image" in item ? item.image : ""}
                    alt={item.label}
                    loading="lazy"
                    className="hp-proof__media"
                  />
                )}
                <div className="hp-proof__card-scrim" aria-hidden />
                <span className="hp-proof__card-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <Reveal delay={80}>
          <p className="hp-proof__trust">Trusted by healthcare teams</p>
          <div className="hp-proof__marks">
            {TRUST_MARKS.map((mark) => (
              <span key={mark} className="hp-proof__mark">
                {mark}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =============================== CLOSING CTA =============================== */

function ClosingCta() {
  return (
    <section className="hp-close">
      <Reveal>
        <p className="hp-close__copy font-display">
          Ready to grow your healthcare business?
        </p>
        <StrategyCallButton className="mt-8" />
      </Reveal>
    </section>
  );
}
```

---

## `src/routes/pricing.tsx`

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Accent, LoopVideo, PageHeroHeading, SectionHeading } from "@/components/site-kit";
import pricingVideoProduction from "@/assets/pricing-video-production.mp4";
import growthMarketing from "@/assets/growth-marketing.png";
import consultingStrategy from "@/assets/consulting-strategy.png";
import designUiux from "@/assets/design-uiux.png";
import aiAutomation from "@/assets/ai-automation.png";
import seoImg from "@/assets/what-we-do-seo.png";
import workCampus from "@/assets/work-campus-aerial.jpg";
import { PRICING_FAQS } from "@/data/pricing-faq";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Transparent Healthcare Growth Services | Magis Labs" },
      {
        name: "description",
        content:
          "Transparent pricing for healthcare video production, performance marketing, UI/UX design, AI automation and growth consulting.",
      },
      { property: "og:title", content: "Pricing — Magis Labs" },
      {
        property: "og:description",
        content:
          "Choose the service you need or book a strategy call for a tailored healthcare growth solution.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const TABS = [
  { id: "video", label: "Video & Content" },
  { id: "growth", label: "Growth & Marketing" },
  { id: "brand", label: "Brand & Digital" },
  { id: "ai", label: "AI & Technology" },
  { id: "consulting", label: "Strategy" },
  { id: "drone", label: "Drone" },
];

const VIDEO_CARDS = [
  {
    featured: true,
    span3: true,
    name: "Launch Videos",
    price: "$10,000",
    description:
      "End-to-end launch storytelling for new products, services, clinics, and healthcare brands.",
    listLabel: "Includes",
    splitItems: true,
    items: [
      "Creative strategy",
      "Scripting",
      "Storyboarding",
      "Production",
      "Editing",
      "Motion graphics",
      "Multi-platform deliverables",
    ],
    cta: "Get a Quote",
  },
  {
    name: "Explainer & Product Demo Videos",
    price: "$1,500",
    description:
      "Turn complex healthcare products, services, and technology into clear, engaging stories.",
    listLabel: "Ideal for",
    items: [
      "Healthcare software",
      "AI products",
      "Medical devices",
      "Patient education",
      "New services",
    ],
    cta: "Get Started",
  },
  {
    name: "Founder & Brand Stories",
    price: "$2,500",
    description:
      "Tell the story behind your company through interviews, storytelling, cinematic editing, and social-ready content.",
    listLabel: "Includes",
    items: [
      "Founder interview",
      "Story development",
      "Cinematic editing",
      "Social media versions",
    ],
  },
  {
    name: "Testimonials",
    price: "$500",
    unit: "/ video",
    listLabel: "Perfect for",
    items: [
      "Patient stories",
      "Customer success stories",
      "Team interviews",
      "Partner stories",
    ],
  },
  {
    name: "Social Content & Video Editing",
    price: "$3,000",
    unit: "/ month",
    listLabel: "Includes",
    items: [
      "Editing",
      "Captions",
      "Motion graphics",
      "Content repurposing",
      "Platform optimization",
    ],
  },
  {
    name: "Cinematic Brand Films",
    price: "$5,000",
    description:
      "Premium films for healthcare brands, clinics, facilities, campaigns, and organizations.",
  },
  {
    name: "Podcast Production",
    price: "$500",
    unit: "/ episode",
    listLabel: "Includes",
    items: [
      "Audio and video editing",
      "Captions",
      "Short-form content repurposing",
    ],
  },
];

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="pp-section-head">
      <SectionHeading as="h2" className="pp-serif text-[clamp(32px,4vw,52px)]">
        {children}
      </SectionHeading>
    </div>
  );
}

function PricingPage() {
  const [activeTab, setActiveTab] = useState("video");
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionIds = TABS.map((t) => t.id);
    const subnavOffset = 132;

    const updateActiveTab = () => {
      let active = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= subnavOffset) {
          active = id;
        }
      }

      setActiveTab(active);
    };

    updateActiveTab();
    window.addEventListener("scroll", updateActiveTab, { passive: true });
    window.addEventListener("resize", updateActiveTab);

    return () => {
      window.removeEventListener("scroll", updateActiveTab);
      window.removeEventListener("resize", updateActiveTab);
    };
  }, []);

  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    const activeButton = tabs.querySelector<HTMLButtonElement>(".pp-tab.is-active");
    activeButton?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab]);

  return (
    <div className="pp-page min-h-screen">
      <SiteNav />

      <nav className="pp-subnav" aria-label="Pricing sections">
        <div className="pp-tabs" ref={tabsRef}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`pp-tab ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => {
                document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <header className="pp-hero">
        <PageHeroHeading className="pp-serif mx-auto max-w-[16ch] text-center">
          Simple, transparent <Accent>pricing</Accent>
        </PageHeroHeading>
        <p>
          <span className="pp-hero-line">
            Flexible solutions for healthcare businesses, clinics, and startups at
            every stage of growth.
          </span>
          <span className="pp-hero-line">
            Choose a service or talk with us about a custom engagement.
          </span>
        </p>
      </header>

      <section className="pp-section" id="video">
        <SectionTitle>
          Video & <Accent>Content</Accent>
        </SectionTitle>
        <div className="pp-grid">
          <div className="pp-bento-video">
            <LoopVideo
              src={pricingVideoProduction}
              className="h-full w-full object-cover"
            />
          </div>
          <PricingCard {...VIDEO_CARDS[0]} />
          <PricingCard {...VIDEO_CARDS[1]} />
          {VIDEO_CARDS.slice(2).map((card) => (
            <PricingCard key={card.name} {...card} />
          ))}
        </div>
      </section>

      <div className="pp-divider" />

      <section className="pp-section pp-section--stacked">
        <div className="pp-service-group" id="growth">
          <SectionTitle>
            Growth & <Accent>Marketing</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              name="Growth Marketing"
              price="$5,000"
              unit="/ month"
              image={growthMarketing}
              imageAlt="Marketing team analyzing performance data and campaign charts"
              imagePosition="right"
              imageCrop="bottom"
              description="Build a scalable patient or customer acquisition engine."
              listLabel="Includes"
              items={[
                "Paid media",
                "Lead generation",
                "Campaign strategy",
                "Conversion optimization",
                "Performance reporting",
              ]}
              cta="Book a Strategy Call"
            />
            <PricingCard
              full
              name="SEO, GEO & AEO"
              price="$2,500"
              unit="/ month"
              image={seoImg}
              imageAlt="Search analytics and optimization dashboard"
              imagePosition="left"
              description="Increase your visibility across traditional search, local search, and AI-powered discovery."
              listLabel="Includes"
              items={[
                "Healthcare SEO",
                "Local search optimization",
                "AEO & GEO strategy",
                "Content optimization",
              ]}
              cta="Get a Quote"
            />
          </div>
        </div>

        <div className="pp-service-group" id="brand">
          <SectionTitle>
            Brand & Digital <Accent>Experience</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              name="Branding & Identity"
              price="$5,000"
              image={designUiux}
              imageAlt="Brand identity design materials"
              imagePosition="left"
              description="Build a distinctive, trusted healthcare brand with strategy, visual identity, messaging, and brand guidelines."
              cta="Get a Quote"
            />
            <PricingCard
              full
              name="UI/UX & Website Design"
              price="$10,000"
              image={designUiux}
              imageAlt="Designer reviewing UI layouts and visual references on a laptop"
              imagePosition="right"
              listLabel="Includes"
              items={[
                "UX strategy",
                "UI design",
                "Responsive experiences",
                "Design systems",
                "Prototypes",
              ]}
              cta="Get a Quote"
            />
          </div>
        </div>

        <div className="pp-service-group" id="ai">
          <SectionTitle>
            AI & <Accent>Technology</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              name="AI Automation"
              price="$5,000"
              image={aiAutomation}
              imageAlt="Person using a smartphone for automated business workflows"
              imagePosition="right"
              imageCrop="bottom"
              description="Automate repetitive workflows and build smarter healthcare operations."
              listLabel="Solutions can include"
              items={[
                "CRM automation",
                "Lead management",
                "Communication workflows",
                "Newsletters",
                "AI assistants",
                "Custom automations",
              ]}
              cta="Get a Quote"
            />
            <PricingCard
              full
              name="Custom AI & Technology"
              price="Custom"
              image={aiAutomation}
              imageAlt="Healthcare technology integration"
              imagePosition="left"
              description="For healthcare businesses and startups looking to integrate AI, intelligent workflows, digital products, or emerging technologies into their operations."
              cta="Talk to Us"
            />
          </div>
        </div>

        <div className="pp-service-group" id="consulting">
          <SectionTitle>
            Strategy & <Accent>Consulting</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              name="Healthcare Growth Consulting"
              price="$5,000"
              image={consultingStrategy}
              imageAlt="Business consultants reviewing strategy on a laptop"
              imagePosition="left"
              description="Strategic support for clinics, healthcare businesses, and founders looking to launch, grow, or scale."
              listLabel="Services can include"
              items={[
                "Go-to-market strategy",
                "Growth planning",
                "Product launches",
                "Positioning",
                "Content strategy",
                "Technology adoption",
              ]}
              cta="Get a Quote"
            />
          </div>
        </div>

        <div className="pp-service-group" id="drone">
          <SectionTitle>
            Drone & Facility <Accent>Marketing</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              name="Drone Videography"
              price="$2,500"
              image={workCampus}
              imageAlt="Aerial view of a healthcare campus"
              imagePosition="right"
              description="Cinematic aerial content for clinics, healthcare campuses, senior living communities, wellness facilities, and healthcare real estate."
              listLabel="Includes"
              items={[
                "Facility showcases",
                "Campus tours",
                "Aerial photography",
                "Promotional videos",
              ]}
              cta="Get a Quote"
            />
          </div>
        </div>
      </section>

      <div className="pp-divider" />

      <section className="pp-section">
        <div className="pp-section-head mx-auto max-w-[720px] text-center">
          <SectionHeading as="h2" className="pp-serif text-[clamp(28px,3.5vw,44px)]">
            Building Something <Accent>Bigger</Accent>?
          </SectionHeading>
          <p className="mt-5 text-[15.5px] leading-[1.75] text-black/55">
            From launching a clinic to scaling a healthcare startup, integrating AI,
            or creating a complete digital growth system, we build solutions around
            your goals.
          </p>
          <Link to="/contact" hash="book" className="pp-card-cta mx-auto mt-8 inline-flex">
            Book a Discovery Call
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <div className="pp-divider" />

      <section className="pp-section" id="faq">
        <div className="pp-section-head">
          <SectionHeading as="h2" className="pp-serif text-[clamp(32px,4vw,52px)]">
            Frequently Asked <Accent>Questions</Accent>
          </SectionHeading>
        </div>
        <FaqList items={PRICING_FAQS} />
      </section>

      <SiteFooter />
    </div>
  );
}

type CardProps = {
  id?: string;
  featured?: boolean;
  span3?: boolean;
  span4?: boolean;
  full?: boolean;
  compact?: boolean;
  tag?: string;
  name: string;
  price: string;
  unit?: string;
  subtitle?: string;
  description?: string;
  listLabel?: string;
  items?: string[];
  splitItems?: boolean;
  cta?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  imageCrop?: "top" | "bottom";
};

function PricingCard({
  id,
  featured,
  span3,
  span4,
  full,
  compact,
  tag,
  name,
  price,
  unit,
  subtitle,
  description,
  listLabel,
  items,
  splitItems,
  cta,
  image,
  imageAlt = "",
  imagePosition = "left",
  imageCrop,
}: CardProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            card.classList.add("pp-in");
            revealObserver.unobserve(card);
          }
        }
      },
      { threshold: 0.12 },
    );
    revealObserver.observe(card);
    return () => revealObserver.disconnect();
  }, []);

  const listItems = items ?? [];
  const splitAt = Math.ceil(listItems.length / 2);

  const content = (
    <>
      {tag && <span className="pp-card-tag">{tag}</span>}
      <div className="pp-card-name pp-serif">{name}</div>

      {subtitle && <p className="pp-card-subtitle">{subtitle}</p>}

      <div className="pp-card-price-row">
        <span className="pp-card-label">Starting at</span>
        <span className="pp-card-price">{price}</span>
        {unit && <span className="pp-card-unit">{unit}</span>}
      </div>

      {description && <p className="pp-card-desc">{description}</p>}

      {listItems.length > 0 && listLabel && (
        <>
          <p className="pp-list-label">{listLabel}</p>
          {splitItems ? (
            <div className="pp-list-columns">
              <ul className="pp-list">
                {listItems.slice(0, splitAt).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ul className="pp-list">
                {listItems.slice(splitAt).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="pp-list">
              {listItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </>
      )}

      {cta && (
        <Link to="/contact" hash="book" className="pp-card-cta">
          {cta}
          <ArrowIcon />
        </Link>
      )}
    </>
  );

  return (
    <article
      ref={ref}
      id={id}
      className={[
        "pp-card",
        span3 ? "pp-span-3" : "",
        span4 ? "pp-span-4" : "",
        full ? "pp-full" : "",
        compact ? "pp-card--compact" : "",
        featured ? "pp-featured" : "",
        image ? "pp-card--with-image" : "",
        image && imagePosition === "right" ? "pp-card--image-right" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ scrollMarginTop: 140 }}
    >
      {image && (
        <div
          className={[
            "pp-card-media",
            imageCrop === "top" ? "pp-card-media--crop-top" : "",
            imageCrop === "bottom" ? "pp-card-media--crop-bottom" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <img src={image} alt={imageAlt} loading="lazy" />
        </div>
      )}

      {image ? <div className="pp-card-body">{content}</div> : content}
    </article>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => (
        <FaqItem
          key={item.q}
          q={item.q}
          a={item.a}
          open={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (answerRef.current) {
      setHeight(open ? answerRef.current.scrollHeight : 0);
    }
  }, [open, a]);

  return (
    <div className={`pp-faq-item ${open ? "is-open" : ""}`}>
      <button type="button" className="pp-faq-q" aria-expanded={open} onClick={onToggle}>
        <span className="pp-faq-q-text">{q}</span>
        <span className="pp-faq-icon" />
      </button>
      <div ref={answerRef} className="pp-faq-a" style={{ maxHeight: height }}>
        <p>{a}</p>
      </div>
    </div>
  );
}
```

---

## `src/routes/our-work.tsx`

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  Accent,
  Eyebrow,
  Reveal,
} from "@/components/site-kit";
import webRandeepImg from "@/assets/work-web-randeep-wadhawan.png";
import webNikhilImg from "@/assets/work-web-nikhil-mahajan.png";
import webSpanishImg from "@/assets/work-web-spanish-center-dubai.png";
import webEnvisionImg from "@/assets/work-web-envision-lasik.png";
import { CtaDnaIllustration } from "@/components/ow-cta-dna";

export const Route = createFileRoute("/our-work")({
  component: OurWorkPage,
  head: () => ({
    meta: [
      { title: "Our Work — Testimonials & Client Stories | Magis Labs" },
      {
        name: "description",
        content:
          "Client testimonials and proven results from healthcare clinics, practices, and organizations we've helped grow.",
      },
      { property: "og:title", content: "Our Work — Magis Labs" },
      {
        property: "og:description",
        content:
          "Case studies in Instagram growth, clinic websites and client reviews from Magis Labs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const HERO_STATS = [
  { value: "20+", label: "Clients helped" },
  { value: "+48%", label: "Avg follower growth" },
  { value: "1.9×", label: "Avg engagement lift" },
  { value: "4.7/5", label: "Client rating" },
] as const;

const IG_CASES = [
  {
    initials: "SH",
    name: "Smile Hair Clinic",
    field: "Istanbul, Türkiye · Hair transplant",
    followers: "820K",
    posts: "787",
    engagement: "1.8%",
    growthFrom: "718K",
    growthTo: "820K",
    growthPeriod: "6 months",
    growthPct: "+14%",
    quote:
      "At our size, big jumps aren't realistic. Steady growth, cleaner visuals, and fewer random posts — that's what we wanted.",
  },
  {
    initials: "SC",
    name: "Spanish Center Dubai",
    field: "Dubai, UAE · Laser eye & cosmetic",
    followers: "54K",
    posts: "1,781",
    engagement: "2.4%",
    growthFrom: "41K",
    growthTo: "54K",
    growthPeriod: "8 months",
    growthPct: "+32%",
    quote:
      "Our feed used to feel scattered. Now patients save posts and message us with specific questions — the front desk notices it.",
  },
  {
    initials: "NG",
    name: "Dr Neil Galletly",
    field: "Dubai, UAE · Gastroenterologist & Hepatologist",
    followers: "8.1K",
    posts: "462",
    engagement: "2.1%",
    growthFrom: "4.2K",
    growthTo: "8.1K",
    growthPeriod: "5 months",
    growthPct: "+93%",
    quote:
      "We started getting DMs from patients who'd already watched a few Reels before they booked. That wasn't happening six months ago.",
  },
  {
    initials: "KD",
    name: "Dr Kavya Dendukuri",
    field: "Gastroenterologist & Hepatologist",
    followers: "66K",
    posts: "359",
    engagement: "3.1%",
    growthFrom: "54K",
    growthTo: "66K",
    growthPeriod: "4 months",
    growthPct: "+22%",
    quote:
      "The content finally sounds like me in clinic — plain language, no jargon. My team doesn't have to rewrite captions anymore.",
  },
  {
    initials: "NM",
    name: "Dr Nikhil Mahajan",
    field: "Gastroenterologist & Liver Doctor",
    followers: "22K",
    posts: "121",
    engagement: "2.6%",
    growthFrom: "15K",
    growthTo: "22K",
    growthPeriod: "7 months",
    growthPct: "+47%",
    quote:
      "People mention specific posts when they call. Small thing, but it tells me they're actually reading before they visit.",
  },
] as const;

const WEB_CASES = [
  {
    url: "spanishcenterdubai.com",
    image: webSpanishImg,
    tag: "Website · Multi-clinic site",
    name: "Spanish Center Dubai",
    field: "Laser eye, cosmetic & wellness · Dubai",
    quote:
      "One site now serves every department instead of five outdated microsites.",
    metrics: [
      { value: "+95%", label: "WhatsApp inquiry clicks" },
      { value: "4.9/5", label: "Client rating" },
      { value: "8 wks", label: "Build time" },
    ],
  },
  {
    url: "randeepwadhawan.com",
    image: webRandeepImg,
    tag: "Website · Specialist rebrand",
    name: "Dr Randeep Wadhawan",
    field: "GI, Bariatric & Metabolic Surgeon · New Delhi",
    quote:
      "The new site explains robotic surgery in plain language — patients come in already reassured.",
    metrics: [
      { value: "+170%", label: "Consult form submits" },
      { value: "2.8×", label: "Time on site" },
      { value: "6 wks", label: "Build time" },
    ],
  },
  {
    url: "drnikhilmahajan.getmy.clinic",
    image: webNikhilImg,
    tag: "Website · Clinic booking site",
    name: "Dr Nikhil Mahajan",
    field: "Gastroenterologist & Liver Doctor · Jammu",
    quote:
      "Online bookings replaced most of our phone-tag scheduling within the first month.",
    metrics: [
      { value: "+140%", label: "Appointment bookings" },
      { value: "-38%", label: "Bounce rate" },
      { value: "5 wks", label: "Build time" },
    ],
  },
  {
    url: "envisionlasikcentre.com",
    image: webEnvisionImg,
    tag: "Website · New build",
    name: "Envision LASIK Centre",
    field: "Laser vision correction · Hyderabad",
    quote:
      "We went from a static brochure page to a site that pre-qualifies patients before they call.",
    metrics: [
      { value: "+210%", label: "Consultation requests" },
      { value: "3.4×", label: "Pages per visit" },
      { value: "5 wks", label: "Build time" },
    ],
  },
] as const;

function CarouselControls({
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: {
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="ow-carousel-controls">
      <button
        type="button"
        className="ow-carousel-btn"
        aria-label={prevLabel}
        onClick={onPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="ow-carousel-btn"
        aria-label={nextLabel}
        onClick={onNext}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

type IgCase = (typeof IG_CASES)[number];

function ringOffset(index: number, active: number, total: number): number {
  let diff = index - active;
  const half = total / 2;
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  return diff;
}

function IgCard({
  item,
  offset,
  onSelect,
}: {
  item: IgCase;
  offset: -1 | 0 | 1;
  onSelect: () => void;
}) {
  const isActive = offset === 0;
  const slotClass =
    offset === 0 ? "is-center" : offset === -1 ? "is-left" : "is-right";

  return (
    <article
      className={`ow-ig-card ow-case-card grain-card grain-card--lift ow-ig-carousel-card ${slotClass}`}
      onClick={isActive ? undefined : onSelect}
      onKeyDown={
        isActive
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
      }
      role={isActive ? undefined : "button"}
      tabIndex={isActive ? -1 : 0}
      aria-label={isActive ? undefined : `View ${item.name}`}
      aria-hidden={false}
    >
      <div className="ow-ig-top">
        <div className="ow-ig-head">
          <div className="ow-ig-avatar">
            <span>{item.initials}</span>
          </div>
          <div className="ow-ig-id">
            <div className="ow-ig-name">{item.name}</div>
            <div className="ow-ig-field">{item.field}</div>
          </div>
        </div>
      </div>
      <div className="ow-ig-metrics">
        <div>
          <strong>{item.followers}</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>{item.posts}</strong>
          <span>Posts</span>
        </div>
        <div>
          <strong>{item.engagement}</strong>
          <span>Engagement</span>
        </div>
      </div>
      <div className="ow-ig-growth">
        <div className="ow-ig-growth-row">
          <div className="ow-ig-growth-nums">
            {item.growthFrom} → <b>{item.growthTo}</b> in {item.growthPeriod}
          </div>
          <div className="ow-ig-growth-pill">{item.growthPct}</div>
        </div>
      </div>
      <div className="ow-ig-quote">
        <p>&ldquo;{item.quote}&rdquo;</p>
      </div>
    </article>
  );
}

type WebCase = (typeof WEB_CASES)[number];

function WebCard({
  item,
  offset,
  onSelect,
}: {
  item: WebCase;
  offset: -1 | 0 | 1;
  onSelect: () => void;
}) {
  const isActive = offset === 0;
  const slotClass =
    offset === 0 ? "is-center" : offset === -1 ? "is-left" : "is-right";

  return (
    <article
      className={`ow-web-card ow-case-card grain-card grain-card--lift ow-web-carousel-card ${slotClass}`}
      onClick={isActive ? undefined : onSelect}
      onKeyDown={
        isActive
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
      }
      role={isActive ? undefined : "button"}
      tabIndex={isActive ? -1 : 0}
      aria-label={isActive ? undefined : `View ${item.name}`}
      aria-hidden={false}
    >
      <div className="ow-browser-bar">
        <span className="ow-dot" />
        <span className="ow-dot" />
        <span className="ow-dot" />
        <div className="ow-addr">{item.url}</div>
      </div>
      <img
        className="ow-web-photo"
        src={item.image}
        alt={`${item.name} website homepage`}
        loading="lazy"
      />
      <div className="ow-web-body">
        <div className="ow-web-tag">{item.tag}</div>
        <div className="ow-web-name">{item.name}</div>
        <div className="ow-web-field">{item.field}</div>
        <p className="ow-web-quote">&ldquo;{item.quote}&rdquo;</p>
        <div className="ow-web-metrics">
          {item.metrics.map((m) => (
            <div key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function WebCarousel({
  items,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
}: {
  items: readonly WebCase[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="ow-web-carousel">
      <div className="ow-web-carousel-shell">
        <button
          type="button"
          className="ow-web-carousel-side-btn"
          aria-label="Previous website case"
          onClick={onPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="ow-web-carousel-stage" aria-live="polite">
          {items.map((item, index) => {
            const offset = ringOffset(index, activeIndex, items.length);
            if (offset < -1 || offset > 1) return null;
            return (
              <WebCard
                key={item.url}
                item={item}
                offset={offset as -1 | 0 | 1}
                onSelect={() => onSelect(index)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="ow-web-carousel-side-btn"
          aria-label="Next website case"
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="ow-web-carousel-dots" role="tablist" aria-label="Website case studies">
        {items.map((item, index) => (
          <button
            key={item.url}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={item.name}
            className={`ow-web-carousel-dot${index === activeIndex ? " is-active" : ""}`}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  );
}

function IgCarousel({
  items,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
}: {
  items: readonly IgCase[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="ow-ig-carousel">
      <div className="ow-ig-carousel-shell">
        <button
          type="button"
          className="ow-ig-carousel-side-btn"
          aria-label="Previous Instagram case"
          onClick={onPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="ow-ig-carousel-stage" aria-live="polite">
          {items.map((item, index) => {
            const offset = ringOffset(index, activeIndex, items.length);
            if (offset < -1 || offset > 1) return null;
            return (
              <IgCard
                key={item.name}
                item={item}
                offset={offset as -1 | 0 | 1}
                onSelect={() => onSelect(index)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="ow-ig-carousel-side-btn"
          aria-label="Next Instagram case"
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="ow-ig-carousel-dots" role="tablist" aria-label="Instagram case studies">
        {items.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={item.name}
            className={`ow-ig-carousel-dot${index === activeIndex ? " is-active" : ""}`}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  );
}

function OurWorkPage() {
  const [igActive, setIgActive] = useState(0);
  const [webActive, setWebActive] = useState(0);

  const igPrev = () =>
    setIgActive((i) => (i - 1 + IG_CASES.length) % IG_CASES.length);
  const igNext = () => setIgActive((i) => (i + 1) % IG_CASES.length);
  const webPrev = () =>
    setWebActive((i) => (i - 1 + WEB_CASES.length) % WEB_CASES.length);
  const webNext = () => setWebActive((i) => (i + 1) % WEB_CASES.length);

  return (
    <div className="ow-page min-h-screen bg-white">
      <SiteNav />

      <section className="ow-page-head">
        <div className="mx-auto max-w-[1260px] px-6 md:px-8">
          <Reveal>
            <h1>
              Testimonials & <Accent>client work</Accent>.
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="ow-stats-band">
        <div className="ow-stats-band-track">
          {[...HERO_STATS, ...HERO_STATS].map((stat, i) => (
            <div key={`${stat.label}-${i}`} className="ow-stats-band-item">
              <span className="ow-stats-band-value">{stat.value}</span>
              <span className="ow-stats-band-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="ow-section" id="instagram">
        <div className="mx-auto max-w-[1260px] px-6 md:px-8">
          <div className="ow-carousel-head">
            <div className="ow-section-head">
              <Reveal>
                <Eyebrow>Testimonials</Eyebrow>
              </Reveal>
              <Reveal>
                <div className="ow-section-title-row">
                  <h2>
                    Feeds that now <Accent>convert</Accent>, not just scroll.
                  </h2>
                  <CarouselControls
                    prevLabel="Previous Instagram case"
                    nextLabel="Next Instagram case"
                    onPrev={igPrev}
                    onNext={igNext}
                  />
                </div>
              </Reveal>
              <Reveal>
                <p className="ow-section-desc">
                  Before-and-after follower counts and engagement rate for five
                  medical & aesthetic accounts we manage the visual identity for.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        <IgCarousel
          items={IG_CASES}
          activeIndex={igActive}
          onPrev={igPrev}
          onNext={igNext}
          onSelect={setIgActive}
        />
      </section>

      <section className="ow-section" id="websites">
        <div className="mx-auto max-w-[1260px] px-6 md:px-8">
          <div className="ow-carousel-head">
            <div className="ow-section-head">
              <Reveal>
                <Eyebrow>Clients</Eyebrow>
              </Reveal>
              <Reveal>
                <h2>
                  Sites that <Accent>answer</Accent> before the phone even rings.
                </h2>
              </Reveal>
              <Reveal>
                <p className="ow-section-desc">
                  Consultation and inquiry lift for four clinic and specialist
                  websites we designed and built.
                </p>
              </Reveal>
            </div>
            <CarouselControls
              prevLabel="Previous website case"
              nextLabel="Next website case"
              onPrev={webPrev}
              onNext={webNext}
            />
          </div>
        </div>

        <WebCarousel
          items={WEB_CASES}
          activeIndex={webActive}
          onPrev={webPrev}
          onNext={webNext}
          onSelect={setWebActive}
        />
      </section>

      <section className="ow-cta" id="cta">
        <div className="ow-cta-dna" aria-hidden>
          <CtaDnaIllustration />
        </div>

        <div className="ow-cta-content">
          <Reveal>
            <h2>
              Your practice deserves
              <br />a proof stack like this.
            </h2>
          </Reveal>
          <Reveal>
            <p>
              Tell us where things stand — we&apos;ll show you what a launch could look
              like, with the numbers to back it.
            </p>
          </Reveal>
          <Reveal delay={110}>
            <div className="ow-cta-actions">
              <Link to="/contact" hash="book" className="ow-cta-btn">
                Start a project
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
```

---

## `src/routes/contact.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CalEmbed } from "@/components/cal-embed";
import {
  Accent,
  Reveal,
  NewsletterForm,
  PageHeroHeading,
  SectionHeading,
  ELDERBERRY,
  TWILIGHT,
} from "@/components/site-kit";
import {
  ArrowUpRight,
  Check,
  FileText,
  Linkedin,
  Mail,
  UploadCloud,
  X,
} from "lucide-react";
import logoBonsai from "@/assets/logo-bonsai-gradient-bg.png";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Where Great Partnerships Begin | Magis Labs" },
      {
        name: "description",
        content:
          "Book a strategy call, email us, or connect on LinkedIn. Subscribe for insights on healthcare AI, storytelling and growth — or apply to build with Magis Labs.",
      },
      { property: "og:title", content: "Where Great Partnerships Begin" },
      {
        property: "og:description",
        content:
          "Book a strategy call with Magis Labs, subscribe for healthcare AI insights, or apply to join the studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const EMAIL = "connect@themagislabs.com";
const RECRUITING = "hr@themagislabs.com";
const LINKEDIN = "https://www.linkedin.com/showcase/the-magis-labs/";

function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* 1 — HERO */}
      <section className="px-6 pt-[86px] md:px-10 md:pt-[112px]">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <PageHeroHeading className="max-w-[14ch]">
              Talk to our <Accent>Team</Accent>.
            </PageHeroHeading>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-7 max-w-[46ch] text-[17px] leading-[1.75] text-black/50">
              Tell us where you're headed and we'll take it from there.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2 — BOOKING + CONTACT */}
      <section
        id="book"
        className="mt-2 scroll-mt-24 bg-white px-6 py-8 md:mt-3 md:px-10 md:py-10"
      >
        <div className="mx-auto grid max-w-[1320px] gap-4 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <article className="grain-card flex h-full flex-col rounded-[36px] p-3 md:p-4">
              <SectionHeading className="px-4 pb-0 pt-2 text-[1.8rem] md:text-[2.1rem]">
                Book a <Accent>Call</Accent>
              </SectionHeading>
              <div className="mt-2 rounded-[26px] bg-white/85">
                <CalEmbed />
              </div>
            </article>
          </Reveal>

          <div className="grid content-start gap-4">
            <Reveal delay={80}>
              <SideCard
                icon={<Mail className="h-6 w-6" strokeWidth={1.5} />}
                circle={ELDERBERRY}
                title="Email"
                body={EMAIL}
                cta="Write to Us"
                href={`mailto:${EMAIL}`}
                accent={ELDERBERRY}
              />
            </Reveal>
            <Reveal delay={150}>
              <SideCard
                icon={<Linkedin className="h-6 w-6" strokeWidth={1.5} />}
                circle="#3f3f46"
                title="LinkedIn"
                body="Studio updates and new work."
                cta="Follow"
                href={LINKEDIN}
                external
                accent="#3f3f46"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 — NEWSLETTER */}
      <section id="newsletter" className="scroll-mt-24 px-6 py-14 md:px-10 md:py-20">
        <div className="grain-card mx-auto max-w-[1120px] rounded-[38px] px-8 py-10 md:px-14 md:py-14">
          <div className="mx-auto max-w-[640px] text-center">
            <Reveal>
              <SectionHeading>
                Worth <Accent>Reading</Accent>.
              </SectionHeading>
              <p className="mx-auto mt-5 max-w-[38ch] text-[16px] leading-[1.75] text-black/50">
                Subscribe to Magis Labs for notes on healthcare, AI and the craft
                of building.
              </p>
            </Reveal>
            <Reveal delay={90} className="mt-8 flex justify-center">
              <NewsletterForm whiteSurface />
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="mt-10 flex justify-center">
              <PubCard
                href="https://magislabs.substack.com/subscribe"
                label="Magis Labs Newsletter"
                img={logoBonsai}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 — CAREERS */}
      <section id="join" className="scroll-mt-24 bg-white px-6 py-14 md:px-10 md:py-20">
        <div className="grain-card mx-auto max-w-[1000px] rounded-[38px] px-8 py-10 md:px-12 md:py-14">
          <Reveal>
            <div className="max-w-2xl">
              <SectionHeading>
                Careers with <Accent>Magis Labs</Accent>.
              </SectionHeading>
              <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.75] text-black/50">
                Join the studio and help healthcare brands tell stories that
                build trust. Send your application to{" "}
                <a
                  href={`mailto:${RECRUITING}`}
                  className="font-medium text-[#8C2860] hover:underline"
                >
                  {RECRUITING}
                </a>
                .
              </p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-9">
              <ApplicationForm />
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}


/* ------------------------------- Small bits ------------------------------- */

function PubCard({
  href,
  label,
  img,
}: {
  href: string;
  label: string;
  img: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="surface-card surface-card--lift group flex w-full max-w-[420px] items-center gap-4 rounded-[22px] p-4"
    >
      <img
        src={img}
        alt="Magis Labs logo"
        loading="lazy"
        width={512}
        height={512}
        className="h-14 w-14 shrink-0 rounded-full object-cover"
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span
          className="font-display text-[1.05rem] leading-tight tracking-[-0.02em]"
          style={{ color: ELDERBERRY }}
        >
          {label}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40 transition-colors group-hover:text-black/70">
          Subscribe
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </span>
    </a>
  );
}


function SideCard({
  icon,
  circle,
  title,
  body,
  cta,
  href,
  external,
  accent,
}: {
  icon: React.ReactNode;
  circle: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  external?: boolean;
  accent: string;
}) {
  return (
    <article className="grain-card grain-card--lift flex h-full flex-col rounded-[30px] p-7 md:p-8">
      <div className="flex items-center gap-4">
        <span
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: circle, boxShadow: `0 22px 44px -24px ${circle}` }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[1.5rem] leading-tight tracking-[-0.03em] text-black">
            {title}
          </h3>
          <p className="mt-1 truncate text-[14.5px] leading-[1.6] text-black/50">
            {body}
          </p>
        </div>
      </div>

      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group mt-6 inline-flex items-center justify-center gap-2 self-start rounded-full px-7 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-all duration-500 hover:-translate-y-[2px]"
        style={{ background: accent, boxShadow: `0 20px 44px -26px ${accent}` }}
      >
        {cta}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </article>
  );

}

/* ------------------------------ Application ------------------------------ */

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  linkedin: z.string().trim().max(300).optional().or(z.literal("")),
  portfolio: z.string().trim().max(300).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more — at least a couple of sentences.")
    .max(2000),
});

const FIELDS = [
  { name: "name", label: "Full Name", placeholder: "Jane Doe", type: "text", required: true },
  { name: "email", label: "Email Address", placeholder: "jane@email.com", type: "email", required: true },
  { name: "linkedin", label: "LinkedIn Profile", placeholder: "linkedin.com/in/…", type: "url", required: false },
  { name: "portfolio", label: "Portfolio Website", placeholder: "yourwork.com", type: "url", required: false },
] as const;

type FieldName = (typeof FIELDS)[number]["name"] | "message";

const inputClass =
  "mt-3 w-full rounded-2xl border border-black/[0.08] bg-white px-5 py-4 text-[15.5px] text-black outline-none transition-all duration-300 placeholder:text-black/25 focus:border-[#8C2860] focus:shadow-[0_0_0_4px_rgba(140,40,96,0.09)]";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40";

function ApplicationForm() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    email: "",
    linkedin: "",
    portfolio: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function set(field: FieldName, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function accept(f: File | undefined | null) {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Resumes must be a PDF file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Please keep the PDF under 10MB.");
      return;
    }
    setError("");
    setFile(f);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    if (!file) {
      setError("Please upload your resume as a PDF.");
      return;
    }
    const d = parsed.data;
    const subject = `${d.name} | Application for Magis Labs`;
    const body = [
      `Applicant Name: ${d.name}`,
      `Email Address: ${d.email}`,
      `LinkedIn: ${d.linkedin || "—"}`,
      `Portfolio: ${d.portfolio || "—"}`,
      `Resume: ${file.name} (attached)`,
      "",
      "Why Magis Labs:",
      d.message,
    ].join("\n");
    window.location.href = `mailto:${RECRUITING}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setError("");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="surface-card flex min-h-[320px] flex-col items-center justify-center rounded-[40px] bg-white p-9 text-center md:p-14">
        <span
          className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white"
          style={{ background: ELDERBERRY }}
        >
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 font-display text-[2rem] leading-tight tracking-[-0.03em] text-black md:text-[2.4rem]">
          Application received.
        </h3>
        <p className="mt-3 max-w-[40ch] text-[15.5px] leading-[1.75] text-black/50">
          We'll be in touch if there's a fit.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="surface-card rounded-[36px] bg-white p-7 md:p-12"
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">

        {FIELDS.map((f) => (
          <label key={f.name}>
            <span className={labelClass}>
              {f.label}
              {f.required ? (
                <span style={{ color: ELDERBERRY }}> *</span>
              ) : (
                <span className="text-black/25"> (optional)</span>
              )}
            </span>
            <input
              type={f.type}
              value={values[f.name]}
              onChange={(e) => set(f.name, e.target.value)}
              placeholder={f.placeholder}
              className={inputClass}
            />
          </label>
        ))}

        {/* Resume upload */}
        <div className="sm:col-span-2">
          <span className={labelClass}>
            Resume<span style={{ color: ELDERBERRY }}> *</span>
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => accept(e.target.files?.[0])}
          />
          {file ? (
            <div
              className="mt-3 flex items-center gap-4 rounded-2xl px-5 py-4"
              style={{
                background: "rgba(155,74,128,0.06)",
                border: "1px solid rgba(155,74,128,0.20)",
              }}
            >
              <FileText
                className="h-5 w-5 shrink-0"
                style={{ color: ELDERBERRY }}
              />
              <span className="flex-1 truncate text-[15px] text-black/70">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/[0.05] hover:text-black/70"
                aria-label="Remove resume"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                accept(e.dataTransfer.files?.[0]);
              }}
              className="mt-3 flex w-full flex-col items-center justify-center rounded-3xl px-6 py-11 text-center transition-all duration-300"
              style={{
                border: `1.5px dashed ${dragging ? ELDERBERRY : "rgba(155,74,128,0.28)"}`,
                background: dragging
                  ? "rgba(140,40,96,0.05)"
                  : "rgba(155,74,128,0.025)",
              }}
            >
              <UploadCloud
                className="h-7 w-7"
                strokeWidth={1.4}
                style={{ color: TWILIGHT }}
              />
              <span className="mt-4 text-[15.5px] text-black/65">
                Drag & drop your resume, or{" "}
                <span style={{ color: ELDERBERRY }} className="font-semibold">
                  browse
                </span>
              </span>
              <span className="mt-1.5 text-[12.5px] tracking-wide text-black/35">
                PDF only · max 10MB
              </span>
            </button>
          )}
        </div>

        <label className="sm:col-span-2">
          <span className={labelClass}>
            Why would you like to work with Magis Labs?
            <span style={{ color: ELDERBERRY }}> *</span>
          </span>
          <textarea
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            rows={5}
            placeholder="Tell us what you'd build here."
            className={`${inputClass} resize-none leading-[1.7]`}
          />
        </label>
      </div>

      {error && <p className="mt-6 text-[13.5px] text-red-600">{error}</p>}

      <button
        type="submit"
        className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full px-9 py-5 text-[14px] font-semibold tracking-wide text-white transition-all duration-500 hover:-translate-y-[2px]"
        style={{
          background: ELDERBERRY,
          boxShadow: "0 26px 56px -24px rgba(140,40,96,0.65)",
        }}
      >
        Submit Application
      </button>
    </form>
  );
}
```

---

## `src/routes/resources.tsx`

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Accent, PageHeroHeading, Reveal, SolidButton } from "@/components/site-kit";

export const Route = createFileRoute("/resources")({
  component: ResourcesPage,
  head: () => ({
    meta: [
      { title: "Resources — Coming Soon | Magis Labs" },
      {
        name: "description",
        content:
          "Healthcare research, editorial insights, and practical resources from Magis Labs — coming soon.",
      },
      { property: "og:title", content: "Resources — Magis Labs" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <section className="flex min-h-[70vh] items-center px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal>
            <PageHeroHeading>
              Resources <Accent>Coming Soon</Accent>
            </PageHeroHeading>
            <p className="mx-auto mt-7 max-w-[42ch] text-[17px] leading-[1.75] text-black/55">
              We&apos;re building a library of healthcare growth insights,
              research, and practical guides. Check back soon — or subscribe on
              our contact page in the meantime.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <SolidButton to="/contact" hash="newsletter">
                Join Newsletter
              </SolidButton>
              <Link
                to="/"
                className="rounded-full border border-black/[0.1] px-6 py-3.5 text-[13px] font-semibold text-black/70 transition-colors hover:border-black/20 hover:text-black"
              >
                Back to Home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
```

---

## `src/routes/privacy.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHeroHeading, Reveal } from "@/components/site-kit";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — Magis Labs" },
      {
        name: "description",
        content: "Privacy policy for Magis Labs Co.",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="mx-auto max-w-[720px] px-6 pb-20 pt-32 md:px-8">
        <Reveal>
          <PageHeroHeading>Privacy Policy</PageHeroHeading>
        </Reveal>
        <Reveal>
          <p className="mt-6 text-[15px] leading-[1.75] text-black/60">
            This page will outline how Magis Labs collects, uses, and protects
            your information. For questions, contact{" "}
            <a
              href="mailto:connect@themagislabs.com"
              className="text-[#8C2860] hover:underline"
            >
              connect@themagislabs.com
            </a>
            .
          </p>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
```

---

## `src/routes/terms.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHeroHeading, Reveal } from "@/components/site-kit";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Magis Labs" },
      {
        name: "description",
        content: "Terms and conditions for Magis Labs Co.",
      },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="mx-auto max-w-[720px] px-6 pb-20 pt-32 md:px-8">
        <Reveal>
          <PageHeroHeading>Terms &amp; Conditions</PageHeroHeading>
        </Reveal>
        <Reveal>
          <p className="mt-6 text-[15px] leading-[1.75] text-black/60">
            This page will outline the terms governing use of Magis Labs services
            and website. For questions, contact{" "}
            <a
              href="mailto:connect@themagislabs.com"
              className="text-[#8C2860] hover:underline"
            >
              connect@themagislabs.com
            </a>
            .
          </p>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
```

---

## `src/components/site-nav.tsx`

```tsx
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoBonsai from "@/assets/logo-bonsai-gradient-bg.png";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/", hash: "why" as const },
  { label: "Solutions", href: "/pricing" },
  { label: "Focus", href: "/", hash: "focus" as const },
  { label: "Insights", href: "/our-work" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = useRouterState({
    select: (state) => state.location.pathname === "/",
  });
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <div
        className="w-full transition-all duration-[350ms] ease-out"
        style={{
          backgroundColor: transparent
            ? "rgba(255,255,255,0)"
            : "rgba(255,255,255,0.94)",
          backdropFilter: transparent ? "none" : "blur(20px) saturate(150%)",
          borderBottom: transparent
            ? "1px solid rgba(255,255,255,0)"
            : "1px solid rgba(0,0,0,0.06)",
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
              <span style={{ color: "#9B4A80" }}>Magis</span>
              <span style={{ color: transparent ? "rgba(255,255,255,0.82)" : "#6B7280" }}>
                Labs
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                {...("hash" in item && item.hash ? { hash: item.hash } : {})}
                activeProps={{
                  style: { color: transparent ? "#fff" : "#8C2860" },
                }}
                activeOptions={{ exact: item.href === "/" && !("hash" in item && item.hash) }}
                className={`rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium tracking-wide transition-colors duration-[350ms] ease-out hover:bg-black/[0.04] ${
                  transparent
                    ? "text-white/82 hover:bg-white/10 hover:text-white"
                    : "text-black/70 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              hash="book"
              className={`hp-cta-btn hidden sm:inline-flex ${
                transparent ? "hp-cta-btn--nav-transparent" : ""
              }`}
            >
              Book an AI Strategy Call
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors duration-[350ms] ease-out lg:hidden ${
                transparent
                  ? "text-white/85 hover:bg-white/10"
                  : "text-black/70 hover:bg-black/[0.05]"
              }`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav
            className={`border-t px-5 pb-5 pt-3 lg:hidden ${
              transparent
                ? "border-white/12 bg-[rgba(20,8,16,0.92)] backdrop-blur-xl"
                : "border-black/[0.06] bg-white"
            }`}
          >
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                {...("hash" in item && item.hash ? { hash: item.hash } : {})}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-3 py-3 text-[15px] font-medium transition-colors ${
                  transparent
                    ? "text-white/82 hover:bg-white/10 hover:text-white"
                    : "text-black/75 hover:bg-black/[0.04]"
                }`}
              >
                {item.label}
              </Link>
            ))}
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
```

---

## `src/components/site-footer.tsx`

```tsx
import { Link } from "@tanstack/react-router";
import { Linkedin, Mail } from "lucide-react";
import logoBonsai from "@/assets/logo-bonsai-gradient-bg.png";

const EMAIL = "connect@themagislabs.com";
const LINKEDIN = "https://www.linkedin.com/showcase/the-magis-labs/";

const COLUMN_ONE_LINKS = [
  { label: "Vision", to: "/" as const, hash: "vision" as const },
  { label: "Industries", to: "/" as const, hash: "focus" as const },
  { label: "Solutions", to: "/" as const, hash: "capabilities" as const },
] as const;

const COLUMN_TWO_LINKS = [
  { label: "Testimonials", to: "/our-work" as const },
  { label: "Plans", to: "/pricing" as const },
  { label: "Newsletter", to: "/contact" as const, hash: "newsletter" as const },
] as const;

const CONNECT_LINKS = [
  { label: "Contact", to: "/contact" as const },
  { label: "Careers", to: "/contact" as const, hash: "join" as const },
  { label: "Book a Call", to: "/contact" as const, hash: "book" as const },
] as const;

function FooterLinkList({
  links,
}: {
  links: readonly {
    label: string;
    to: "/" | "/our-work" | "/pricing" | "/contact";
    hash?: "vision" | "focus" | "capabilities" | "newsletter" | "join" | "book";
  }[];
}) {
  return (
    <ul className="mt-3 space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.to}
            {...(link.hash ? { hash: link.hash } : {})}
            className="text-[14px] text-black/68 transition-colors hover:text-black"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly {
    label: string;
    to: "/" | "/our-work" | "/pricing" | "/contact";
    hash?: "vision" | "focus" | "capabilities" | "newsletter" | "join" | "book";
  }[];
}) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-black/42">
        {title}
      </p>
      <FooterLinkList links={links} />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-black/[0.08] bg-white">
      <div className="mx-auto max-w-[1500px] px-6 py-10 md:px-10 md:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.1fr)_1fr_1fr_1fr] lg:gap-8 xl:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img
                src={logoBonsai}
                alt="Magis Labs"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-display text-[19px] font-bold tracking-tight">
                <span style={{ color: "#9B4A80" }}>Magis</span>
                <span style={{ color: "#000000" }}>Labs</span>
              </span>
            </Link>
            <p className="mt-3 max-w-[26ch] text-[13.5px] leading-[1.65] text-black/52">
              Storytelling, AI and growth for eldercare and longevity.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-1.5 text-[13px] text-black/62 transition-colors hover:text-black"
              >
                <Mail className="h-3.5 w-3.5" style={{ color: "#8C2860" }} />
                {EMAIL}
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                aria-label="Magis Labs on LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] text-black/62 transition-colors hover:border-black/15 hover:text-[#8C2860]"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <FooterColumn title="Explore" links={COLUMN_ONE_LINKS} />
          <FooterColumn title="Discover" links={COLUMN_TWO_LINKS} />
          <FooterColumn title="Connect" links={CONNECT_LINKS} />
        </div>

        <div className="mt-8 border-t border-black/[0.06] pt-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11.5px] text-black/42">
              <span>© {new Date().getFullYear()} Magis Labs Co. All rights reserved.</span>
              <span aria-hidden className="hidden sm:inline text-black/18">
                ·
              </span>
              <Link
                to="/privacy"
                className="transition-colors hover:text-black"
              >
                Privacy
              </Link>
              <span aria-hidden className="text-black/18">
                ·
              </span>
              <Link
                to="/terms"
                className="transition-colors hover:text-black"
              >
                Terms &amp; Conditions
              </Link>
            </div>
            <p className="font-display text-[12.5px] italic tracking-[0.02em] text-black/38">
              Built for better care
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

---

## `src/components/site-kit.tsx`

```tsx
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/subscribe.functions";

export const ELDERBERRY = "#8C2860";
export const TWILIGHT = "#9B4A80";
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
  const cls = `group inline-flex items-center gap-2 rounded-full px-7 py-4 text-[13px] font-semibold tracking-wide text-white transition-all duration-500 hover:-translate-y-[2px] ${className}`;
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
  const cls = `group inline-flex items-center gap-2 rounded-full border px-7 py-4 text-[13px] font-semibold tracking-wide transition-all duration-500 hover:-translate-y-[2px] hover:bg-black/[0.03] ${className}`;
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
        className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:border sm:p-1.5 ${
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
          className={`w-full rounded-full border px-5 py-3.5 text-[14px] outline-none sm:py-2.5 ${
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
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] disabled:opacity-60 sm:py-3"
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
```

---

## `src/components/ow-cta-dna.tsx`

```tsx
type Point = { x: number; y: number };

const WIDTH = 720;
const HEIGHT = 520;
const CX = WIDTH * 0.54;
const AMPLITUDE = 78;
const CYCLES = 2.15;
const RUNG_COUNT = 16;
const SEGMENTS = 140;

function helixPoint(t: number, phase: number): Point {
  return {
    x: CX + AMPLITUDE * Math.sin(t * Math.PI * 2 * CYCLES + phase),
    y: 36 + t * (HEIGHT - 72),
  };
}

function strandPath(phase: number): string {
  const parts: string[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const { x, y } = helixPoint(t, phase);
    parts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return parts.join(" ");
}

function rungPath(t: number): string {
  const a = helixPoint(t, 0);
  const b = helixPoint(t, Math.PI);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} L ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

export function CtaDnaIllustration() {
  const rungs = Array.from({ length: RUNG_COUNT }, (_, i) => i / (RUNG_COUNT - 1));

  return (
    <svg
      className="ow-cta-dna-svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ow-dna-strand-front" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffdfb" />
          <stop offset="42%" stopColor="#f7e8f0" />
          <stop offset="100%" stopColor="#ddb8cc" />
        </linearGradient>
        <linearGradient id="ow-dna-strand-back" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3ddea" />
          <stop offset="55%" stopColor="#e8c8d8" />
          <stop offset="100%" stopColor="#c995b0" />
        </linearGradient>
        <linearGradient id="ow-dna-rung" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8edf3" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5c4d6" />
        </linearGradient>
        <filter id="ow-dna-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#5a1438" floodOpacity="0.28" />
        </filter>
        <filter id="ow-dna-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <g filter="url(#ow-dna-shadow)" opacity="0.92">
        {rungs.map((t) => (
          <path
            key={`rung-back-${t}`}
            d={rungPath(t)}
            stroke="url(#ow-dna-rung)"
            strokeWidth={14}
            strokeLinecap="round"
            opacity={0.72}
          />
        ))}

        <path
          d={strandPath(Math.PI)}
          stroke="url(#ow-dna-strand-back)"
          strokeWidth={30}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.82}
        />

        {rungs.map((t) => (
          <path
            key={`rung-front-${t}`}
            d={rungPath(t)}
            stroke="url(#ow-dna-rung)"
            strokeWidth={16}
            strokeLinecap="round"
          />
        ))}

        <path
          d={strandPath(0)}
          stroke="url(#ow-dna-strand-front)"
          strokeWidth={32}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={strandPath(0)}
          stroke="rgba(255,255,255,0.42)"
          strokeWidth={10}
          strokeLinecap="round"
          transform="translate(-6,-4)"
          filter="url(#ow-dna-soft)"
          opacity={0.55}
        />
      </g>
    </svg>
  );
}
```

---

## `src/components/cursor-glow.tsx`

```tsx
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

    const onMove = (e: MouseEvent) => {
      cursor.style.opacity = "1";
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const onLeave = () => {
      cursor.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.body.classList.remove("cursor-dot-active");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={cursorRef} id="cursor-glow" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 2L5 18L9.5 13.5L13 21L15.5 20L12 12.5L18.5 12.5L5 2Z"
          fill="#8C2D60"
          stroke="#FFFFFF"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
```

---

## `src/components/cal-embed.tsx`

```tsx
import { useEffect } from "react";

const CAL_LINK = "austin-pereira-f5qmwb/15min";
const NAMESPACE = "15min";

declare global {
  interface Window {
    Cal?: any;
  }
}

/** Inline Cal.com booking widget. */
export function CalEmbed({ className = "" }: { className?: string }) {
  useEffect(() => {
    const C = window as any;
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: any[]) {
          const cal = C.Cal;
          const ar = args;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function (...inner: any[]) {
              p(api, inner);
            };
            const namespace = ar[1];
            (api as any).q = (api as any).q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(C, "https://app.cal.com/embed/embed.js", "init");

    C.Cal("init", NAMESPACE, { origin: "https://app.cal.com" });
    C.Cal.config = C.Cal.config || {};
    C.Cal.config.forwardQueryParams = true;
    C.Cal.ns[NAMESPACE]("inline", {
      elementOrSelector: "#magis-cal-inline",
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
      calLink: CAL_LINK,
    });
    C.Cal.ns[NAMESPACE]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, []);

  return (
    <div
      id="magis-cal-inline"
      className={className}
      style={{ width: "100%", minHeight: "720px" }}
    />
  );
}
```

---

## `src/data/pricing-faq.ts`

```ts
export const PRICING_FAQS = [
  {
    q: "What does your healthcare marketing and technology agency do?",
    a: "We help healthcare businesses build their brand, grow their digital presence, attract patients and customers, and scale through strategic marketing, content, video production, branding, AI automation, SEO, web design, and technology solutions.",
  },
  {
    q: "What types of healthcare businesses do you work with?",
    a: "We work across the healthcare industry, including private practices, specialty clinics, medical groups, wellness clinics, longevity clinics, senior care organizations, healthcare startups, digital health companies, medical device companies, healthcare SaaS, and other health and wellness businesses.",
  },
  {
    q: "Do you provide marketing for specialty clinics and private practices?",
    a: "Yes. We help specialty clinics and private healthcare practices strengthen their brand, improve online visibility, create engaging content, and develop marketing systems designed to support patient acquisition and long-term growth.",
  },
  {
    q: "What healthcare marketing services do you offer?",
    a: "Our services include healthcare branding, video production, social media marketing, content strategy, website and UI/UX design, SEO, local SEO, AEO and GEO optimization, paid advertising, AI automation, CRM integration, drone videography, and growth strategy.",
  },
  {
    q: "Can you help healthcare businesses attract more patients?",
    a: "Yes. We combine healthcare SEO, local search optimization, content, social media, paid advertising, conversion strategy, and digital experiences to help clinics increase visibility and connect with prospective patients.",
  },
  {
    q: "Do you provide SEO for healthcare companies and medical practices?",
    a: "Yes. We provide healthcare SEO strategies designed to improve visibility across Google and other search engines. This can include website optimization, local SEO, content strategy, technical improvements, and search-focused digital experiences.",
  },
  {
    q: "What are AEO and GEO for healthcare?",
    a: "Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) help make your healthcare brand and content easier to discover and understand across AI-powered search and answer platforms. We combine these strategies with traditional SEO to build broader digital visibility.",
  },
  {
    q: "Do you build websites for healthcare businesses?",
    a: "Yes. We design modern websites and digital experiences for clinics, healthcare companies, startups, and care organizations. Our UI/UX approach focuses on clarity, trust, usability, brand experience, and conversion.",
  },
  {
    q: "Do you offer AI automation for healthcare businesses?",
    a: "Yes. We help healthcare businesses integrate AI and automation into areas such as CRM workflows, lead management, newsletters, internal processes, marketing operations, and other repetitive business workflows.",
  },
  {
    q: "Do you work with healthcare and AI startups?",
    a: "Yes. We support healthcare, digital health, and AI startups with branding, product launches, go-to-market strategy, explainer videos, product demos, websites, content, growth marketing, and AI-powered solutions.",
  },
  {
    q: "Do you create healthcare videos and medical content?",
    a: "Yes. We produce launch videos, explainer videos, founder stories, testimonials, social media content, educational videos, product demos, brand films, and other creative content for healthcare organizations.",
  },
  {
    q: "Why are explainer videos useful for healthcare companies?",
    a: "Healthcare products, treatments, services, and technologies can be difficult to explain. A well-designed explainer video can make complex information easier to understand while helping healthcare brands educate audiences and communicate their value clearly.",
  },
  {
    q: "Do you offer social media marketing for healthcare?",
    a: "Yes. We help healthcare businesses develop content strategies, produce short-form and long-form content, manage creative workflows, and build a consistent presence across relevant social platforms.",
  },
  {
    q: "Do you provide healthcare branding services?",
    a: "Yes. We help healthcare businesses develop strong, recognizable brands through positioning, messaging, visual identity, content, digital experiences, and creative strategy.",
  },
  {
    q: "Do you offer drone videography for healthcare facilities?",
    a: "Yes. We create cinematic drone content for clinics, healthcare campuses, senior living communities, wellness facilities, medical real estate, and other healthcare properties.",
  },
  {
    q: "Do you work with senior care and eldercare businesses?",
    a: "Yes. We work with senior living, assisted living, memory care, hospice, home healthcare, and other care organizations to strengthen their brands, showcase their facilities, and improve their digital presence.",
  },
  {
    q: "Do you work with small clinics and growing healthcare businesses?",
    a: "Yes. We work with independent practices, specialty clinics, growing healthcare organizations, startups, and established companies. Solutions can be tailored around your current stage, goals, and growth priorities.",
  },
  {
    q: "Do you work with healthcare organizations outside the United States?",
    a: "Yes. We can work with healthcare businesses and startups internationally, with projects delivered through remote collaboration, structured communication, and clear project timelines.",
  },
  {
    q: "How much does healthcare marketing cost?",
    a: "Healthcare marketing costs depend on the services, scope, goals, and complexity of the project. We offer individual services, ongoing growth engagements, and custom solutions based on what your healthcare business needs.",
  },
  {
    q: "How long does a healthcare marketing project take?",
    a: "Timelines depend on the project. Individual creative projects may take several weeks, while websites, branding, automation, and larger growth initiatives can require longer engagements. Every project begins with a defined scope, timeline, and deliverables.",
  },
  {
    q: "Why choose a healthcare-focused marketing and technology partner?",
    a: "Healthcare requires trust, clarity, and an understanding of how patients, professionals, and businesses make decisions. We combine healthcare-focused strategy with storytelling, design, marketing, AI, automation, and technology to help businesses build and scale.",
  },
  {
    q: "Can you help launch a new healthcare clinic or business?",
    a: "Yes. We can support new clinics and healthcare businesses with branding, websites, launch campaigns, content, video production, digital marketing, automation, and growth strategy to create a stronger foundation for launch and expansion.",
  },
  {
    q: "Can you create a custom solution for our healthcare business?",
    a: "Yes. If your needs go beyond a single service, we can develop a custom combination of strategy, creative, marketing, AI, automation, and technology around your goals.",
  },
  {
    q: "How do we get started?",
    a: "Book a discovery call with our team. We'll learn about your healthcare business, goals, challenges, and growth plans, then recommend the services and strategy that best fit your needs.",
  },
] as const;
```

---

## `src/lib/subscribe.functions.ts`

```ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      throw new Error(
        "Newsletter is not configured yet. Please add MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID.",
      );
    }

    const dc = apiKey.split("-")[1];
    if (!dc) {
      throw new Error("Invalid Mailchimp API key format.");
    }

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
    const auth = "Basic " + Buffer.from(`anystring:${apiKey}`).toString("base64");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: data.email,
        status: "subscribed",
      }),
    });

    if (res.ok) {
      return { ok: true as const, alreadySubscribed: false };
    }

    // Mailchimp returns 400 with title "Member Exists" when already subscribed.
    let body: { title?: string; detail?: string } = {};
    try {
      body = (await res.json()) as { title?: string; detail?: string };
    } catch {
      // ignore
    }

    if (res.status === 400 && body.title === "Member Exists") {
      return { ok: true as const, alreadySubscribed: true };
    }

    console.error("Mailchimp subscribe failed", res.status, body);
    throw new Error(body.detail || "Unable to subscribe right now. Please try again later.");
  });
```

---

## `src/styles.css`

```css
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Fraunces", "Cormorant", ui-serif, Georgia, serif;

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-plum: var(--plum);
  --color-plum-deep: var(--plum-deep);
  --color-plum-soft: var(--plum-soft);
  --color-manicure: var(--manicure);
  --color-holo-pink: var(--holo-pink);
  --color-holo-cyan: var(--holo-cyan);
  --color-holo-lime: var(--holo-lime);
  --color-holo-violet: var(--holo-violet);
  --color-dust-pink: var(--dust-pink);

  --animate-aurora: aurora 18s ease-in-out infinite;
  --animate-spin-slow: spin 24s linear infinite;
  --animate-spin-slower: spin 48s linear infinite;
  --animate-spin-slowest: spin 90s linear infinite;
  --animate-spin-reverse: spin-reverse 60s linear infinite;
  --animate-float: float 9s ease-in-out infinite;
  --animate-float-delayed: float 11s ease-in-out -3s infinite;
  --animate-shimmer: shimmer 8s linear infinite;
  --animate-holo-shift: holo-shift 14s ease-in-out infinite;
  --animate-scan: scan 6s linear infinite;
  --animate-marquee: marquee 40s linear infinite;
  --animate-pulse-glow: pulse-glow 4s ease-in-out infinite;
  --animate-orbit: orbit 20s linear infinite;
  --animate-fade-up: fade-up 0.9s ease-out both;
  --animate-dash: dash 6s linear infinite;
  --animate-node-pulse: node-pulse 3.6s ease-in-out infinite;
}

:root {
  --radius: 1rem;

  /* Ivory + Elderberry foundation */
  --background: oklch(0.995 0.003 20);
  --foreground: oklch(0.18 0.07 355);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0.07 355);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.18 0.07 355);
  --primary: oklch(0.36 0.15 355);
  --primary-foreground: oklch(0.995 0.003 20);
  --secondary: oklch(0.96 0.025 355);
  --secondary-foreground: oklch(0.3 0.15 355);
  --muted: oklch(0.97 0.014 355);
  --muted-foreground: oklch(0.5 0.06 355);
  --accent: oklch(0.5 0.22 5);
  --accent-foreground: oklch(0.995 0.003 20);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --border: oklch(0.9 0.022 355);
  --input: oklch(0.9 0.022 355);
  --ring: oklch(0.5 0.22 5);

  /* Elderberry + raspberry tokens (plum-* kept as aliases for compatibility) */
  --plum: #9B4A80;                       /* elderberry */
  --plum-deep: #8C2D60;                  /* elderberry dark */
  --manicure: #8C2860;                   /* manicure raspberry */
  --plum-soft: oklch(0.9 0.05 355);      /* whisper berry */
  --holo-pink: oklch(0.7 0.22 5);        /* raspberry */
  --holo-cyan: oklch(0.85 0.13 210);
  --holo-lime: oklch(0.9 0.15 130);
  --holo-violet: #9B4A80;                /* elderberry violet */
  --dust-pink: #E2C7D0;                  /* dusty pink band */

  /* Elderberry gradients */
  --gradient-holo: linear-gradient(
    120deg,
    oklch(0.55 0.22 5),
    oklch(0.42 0.18 355),
    oklch(0.62 0.2 15),
    oklch(0.5 0.2 355),
    oklch(0.55 0.22 5)
  );
  --gradient-holo-soft: linear-gradient(
    135deg,
    oklch(0.95 0.05 355 / 0.9),
    oklch(0.94 0.06 5 / 0.9),
    oklch(0.96 0.04 15 / 0.9),
    oklch(0.95 0.05 355 / 0.9)
  );
  --gradient-plum: linear-gradient(135deg, #9B4A80, #8C2D60);
  --gradient-mesh:
    radial-gradient(at 20% 20%, oklch(0.72 0.18 5 / 0.4) 0px, transparent 55%),
    radial-gradient(at 80% 10%, oklch(0.7 0.16 355 / 0.4) 0px, transparent 55%),
    radial-gradient(at 70% 80%, oklch(0.78 0.15 15 / 0.4) 0px, transparent 55%),
    radial-gradient(at 15% 85%, oklch(0.8 0.1 355 / 0.35) 0px, transparent 55%);

  --shadow-soft: 0 1px 2px oklch(0.26 0.13 355 / 0.05),
    0 8px 24px oklch(0.26 0.13 355 / 0.08);
  --shadow-lift: 0 20px 60px -18px oklch(0.42 0.16 355 / 0.35);
  --shadow-holo: 0 30px 80px -30px oklch(0.55 0.22 5 / 0.5);
}

@layer base {
  * {
    border-color: var(--color-border);
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-feature-settings: "ss01";
    letter-spacing: -0.03em;
  }
  ::selection {
    background: var(--holo-violet);
    color: var(--primary-foreground);
  }
}

/* Legacy pink stroke hero — prefer PageHeroHeading + Accent instead */
.page-hero-title {
  font-family: var(--font-display);
  font-weight: 400;
  line-height: 1.04;
  font-size: clamp(40px, 6.4vw, 96px);
  letter-spacing: -0.02em;
  color: #c9789f;
  -webkit-text-fill-color: #c9789f;
  -webkit-text-stroke: 0.75px #000000;
  paint-order: stroke fill;
}

.page-hero-title em {
  font-style: italic;
  color: #c9789f;
  -webkit-text-fill-color: #c9789f;
}

.home-ken-burns {
  position: relative;
  overflow: hidden;
}

.home-ken-burns__media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  animation: home-ken-burns-zoom 22s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes home-ken-burns-zoom {
  from {
    transform: scale(1) translate3d(0, 0, 0);
  }
  to {
    transform: scale(1.14) translate3d(-2.5%, -1.5%, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-ken-burns__media {
    animation: none;
    transform: none;
  }
}

@utility text-holo {
  background-image: var(--gradient-holo);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: holo-shift 8s ease-in-out infinite;
}

@utility border-holo {
  position: relative;
  isolation: isolate;
}
@utility border-holo-body {
  position: relative;
  border-radius: inherit;
}

@utility bento {
  position: relative;
  overflow: hidden;
  border-radius: 1.75rem;
  background: var(--card);
  border: 1px solid var(--border);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@utility bento-lift {
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-holo);
  }
}

@utility glass {
  background: color-mix(in oklab, white 65%, transparent);
  backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid color-mix(in oklab, white 60%, transparent);
}

@utility grain {
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.15;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
  }
}

@utility nav-elegant-link {
  position: relative;
  transition: color 300ms ease;
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -6px;
    height: 1.5px;
    width: 0;
    background: linear-gradient(90deg, transparent, #F8E4EA, #3F5D4E, #F8E4EA, transparent);
    transform: translateX(-50%);
    transition: width 350ms ease;
    box-shadow: 0 0 8px color-mix(in oklab, #F8E4EA 80%, transparent);
  }
  &:hover::after {
    width: 100%;
  }
}

@keyframes aurora {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate3d(4%, -6%, 0) scale(1.15) rotate(20deg);
  }
  66% {
    transform: translate3d(-5%, 4%, 0) scale(0.95) rotate(-15deg);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-14px) rotate(4deg); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes holo-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes scan {
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 oklch(0.7 0.2 305 / 0.5),
      0 0 60px 0 oklch(0.7 0.2 305 / 0.25);
  }
  50% {
    box-shadow: 0 0 0 12px oklch(0.7 0.2 305 / 0),
      0 0 80px 8px oklch(0.7 0.2 305 / 0.15);
  }
}

@keyframes orbit {
  from { transform: rotate(0deg) translateX(var(--orbit-r, 120px)) rotate(0deg); }
  to { transform: rotate(360deg) translateX(var(--orbit-r, 120px)) rotate(-360deg); }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes spin-reverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes dash {
  to { stroke-dashoffset: -200; }
}

@keyframes node-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
    box-shadow: 0 0 0 0 rgba(255,255,255,0.9), 0 0 18px 4px rgba(176,48,96,0.55);
  }
  50% {
    transform: scale(1.35);
    opacity: 1;
    box-shadow: 0 0 0 6px rgba(255,255,255,0), 0 0 30px 10px rgba(176,48,96,0.25);
  }
}

/* -------- global cursor dot -------- */
body.cursor-dot-active,
body.cursor-dot-active a,
body.cursor-dot-active button,
body.cursor-dot-active [role="button"] {
  cursor: none;
}

#cursor-glow {
  position: fixed;
  width: 18px;
  height: 18px;
  pointer-events: none;
  z-index: 9999;
  transform: translate(2px, 2px);
  opacity: 0;
  transition: opacity 0.15s ease;
  background: none;
  border-radius: 0;
  box-shadow: none;
}

#cursor-glow svg {
  display: block;
  width: 18px;
  height: 18px;
}

@media (prefers-reduced-motion: reduce), (pointer: coarse) {
  body.cursor-dot-active,
  body.cursor-dot-active a,
  body.cursor-dot-active button,
  body.cursor-dot-active [role="button"] {
    cursor: auto;
  }
  #cursor-glow {
    display: none;
  }
}

/* -------- pricing page (pp-*) -------- */
.pp-page {
  --pp-ink: #ffffff;
  --pp-ink-elev: #fbeef2;
  --pp-ink-elev-2: #f4f0ec;
  --pp-line: rgba(50, 24, 38, 0.09);
  --pp-line-strong: rgba(50, 24, 38, 0.16);
  --pp-ivory: #2b1420;
  --pp-ivory-dim: #7a5f69;
  --pp-ivory-dimmer: #ab939b;
  --pp-signal: #8c2d60;
  --pp-signal-soft: #9b4a80;
  --pp-signal-glow: rgba(140, 45, 96, 0.2);
  --pp-radius: 20px;
  --pp-ease: cubic-bezier(0.16, 0.8, 0.24, 1);

  background:
    radial-gradient(1100px 600px at 15% -10%, rgba(155, 74, 128, 0.08), transparent 60%),
    radial-gradient(900px 500px at 100% 10%, rgba(140, 45, 96, 0.05), transparent 55%),
    var(--pp-ink);
  color: var(--pp-ivory);
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
}

.pp-page .pp-serif {
  font-family: "Fraunces", "Cormorant", ui-serif, Georgia, serif;
}

.pp-page .pp-mono {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
}

.pp-subnav {
  position: sticky;
  top: 72px;
  z-index: 40;
  display: flex;
  justify-content: center;
  padding: 12px clamp(20px, 4vw, 56px);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px) saturate(140%);
  border-bottom: 1px solid var(--pp-line);
}

.pp-tabs {
  display: flex;
  gap: 2px;
  padding: 4px;
  background: var(--pp-ink-elev);
  border: 1px solid var(--pp-line);
  border-radius: 100px;
  overflow-x: auto;
  scrollbar-width: none;
  max-width: 100%;
}

.pp-tabs::-webkit-scrollbar {
  display: none;
}

.pp-tab {
  padding: 8px 14px;
  font-size: 12.5px;
  white-space: nowrap;
  border-radius: 100px;
  color: var(--pp-ivory-dim);
  transition: color 0.25s var(--pp-ease), background 0.25s var(--pp-ease);
  cursor: pointer;
  font-weight: 500;
}

.pp-tab:hover {
  color: var(--pp-ivory);
}

.pp-tab.is-active {
  color: var(--pp-ink);
  background: var(--pp-signal);
}

@media (max-width: 860px) {
  .pp-subnav {
    top: 64px;
  }
}

.pp-hero {
  position: relative;
  z-index: 1;
  padding: clamp(48px, 8vw, 96px) clamp(20px, 4vw, 56px) clamp(20px, 3vw, 36px);
  padding-top: clamp(32px, 5vw, 56px);
  text-align: center;
  overflow: hidden;
}

.pp-hero h1 {
  max-width: 16ch;
  margin: 2cm auto 0;
}

.pp-hero p {
  max-width: min(92vw, 78ch);
  margin: 28px auto 0;
  color: var(--pp-ivory-dim);
  font-size: clamp(15px, 1.6vw, 18px);
  line-height: 1.65;
}

.pp-hero-line {
  display: block;
}

@media (min-width: 640px) {
  .pp-hero-line:first-child {
    white-space: nowrap;
  }
}

.pp-hero-ctas {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 40px;
  flex-wrap: wrap;
}

.pp-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 26px;
  border-radius: 100px;
  font-size: 14.5px;
  font-weight: 500;
  transition: transform 0.3s var(--pp-ease), box-shadow 0.3s var(--pp-ease);
  text-decoration: none;
}

.pp-btn-primary {
  background: linear-gradient(135deg, var(--pp-signal), var(--pp-signal-soft));
  color: #ffffff;
}

.pp-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px -8px var(--pp-signal-glow);
}

.pp-btn-ghost {
  border: 1px solid var(--pp-line-strong);
  color: var(--pp-ivory);
}

.pp-btn-ghost:hover {
  border-color: var(--pp-signal);
  transform: translateY(-2px);
}

.pp-wave-wrap {
  margin-top: 64px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
}

.pp-wave path {
  fill: none;
  stroke: var(--pp-signal);
  stroke-width: 1.6;
  stroke-dasharray: 1400;
  stroke-dashoffset: 1400;
  animation: pp-draw 2.6s var(--pp-ease) forwards 0.3s;
  filter: drop-shadow(0 0 6px rgba(140, 45, 96, 0.3));
}

@keyframes pp-draw {
  to {
    stroke-dashoffset: 0;
  }
}

.pp-divider {
  position: relative;
  height: 1px;
  margin: 0 clamp(20px, 4vw, 56px);
  overflow: visible;
  background: rgba(140, 45, 96, 0.08);
}

.pp-divider::before,
.pp-divider::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.pp-divider::before {
  left: 0;
  right: 0;
  top: -1px;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(155, 74, 128, 0.1) 25%,
    rgba(140, 45, 96, 0.32) 50%,
    rgba(155, 74, 128, 0.1) 75%,
    transparent 100%
  );
  background-size: 220% 100%;
  animation: pp-div-glow-move 5s ease-in-out infinite;
  filter: blur(2px);
}

.pp-divider::after {
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(155, 74, 128, 0.3) 30%,
    var(--pp-signal) 50%,
    rgba(155, 74, 128, 0.3) 70%,
    transparent 100%
  );
  background-size: 220% 100%;
  animation: pp-div-glow-move 5s ease-in-out infinite;
  box-shadow:
    0 0 4px rgba(140, 45, 96, 0.28),
    0 0 10px rgba(155, 74, 128, 0.14);
}

@keyframes pp-div-glow-move {
  0%,
  100% {
    background-position: 0% 50%;
    opacity: 0.55;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
}

.pp-section {
  padding: clamp(56px, 9vw, 110px) clamp(20px, 4vw, 56px);
  position: relative;
  z-index: 1;
  scroll-margin-top: 140px;
}

.pp-section#video {
  padding-top: clamp(16px, 2.5vw, 28px);
}

.pp-section--stacked {
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 6vw, 72px);
  padding-top: clamp(40px, 6vw, 72px);
  padding-bottom: clamp(40px, 6vw, 72px);
}

.pp-service-group {
  scroll-margin-top: 140px;
}

.pp-section--stacked .pp-service-group > .pp-section-head {
  margin-bottom: 36px;
  text-align: left;
}

.pp-section--stacked .pp-grid {
  justify-items: center;
}

.pp-section--stacked .pp-card.pp-full {
  width: 100%;
  max-width: min(960px, 100%);
  justify-self: center;
}

.pp-bento-video {
  grid-column: span 3;
  position: relative;
  overflow: hidden;
  min-height: 100%;
  align-self: stretch;
  background: #000;
  border: 1px solid rgba(140, 45, 96, 0.14);
  border-radius: 24px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 10px 30px -24px rgba(140, 45, 96, 0.18);
  isolation: isolate;
}

.pp-bento-video::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  border-radius: inherit;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.22) 45%,
    rgba(0, 0, 0, 0.52) 100%
  );
}

.pp-bento-video video {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pp-card--with-image .pp-card-media::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.22) 45%,
    rgba(0, 0, 0, 0.52) 100%
  );
}

.pp-section > .pp-section-head {
  margin-bottom: 36px;
}

.pp-section-layout {
  display: grid;
  gap: 28px;
  margin-bottom: 36px;
}

@media (min-width: 900px) {
  .pp-section-layout {
    grid-template-columns: 1fr min(42%, 420px);
    align-items: center;
    gap: 40px;
  }

  .pp-section-layout--flip {
    grid-template-columns: min(42%, 420px) 1fr;
  }

  .pp-section-layout--flip .pp-section-head {
    order: 2;
  }

  .pp-section-layout--flip .pp-section-visual {
    order: 1;
  }
}

.pp-section-visual {
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(140, 45, 96, 0.12);
  background: linear-gradient(160deg, #ffffff 0%, var(--pp-ink-elev) 100%);
  box-shadow: 0 24px 50px -36px rgba(50, 24, 38, 0.18);
}

.pp-section-visual img,
.pp-section-visual video {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 1.1s cubic-bezier(0.16, 0.8, 0.24, 1);
}

.pp-section-visual:hover img,
.pp-section-visual:hover video {
  transform: scale(1.03);
}

.pp-section-visual-caption {
  padding: 12px 16px;
  font-size: 11px;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-ivory-dimmer);
  border-top: 1px solid var(--pp-line);
}

.pp-section-head h2 {
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: #1c1c1c;
}

.pp-section-sub {
  display: none;
}

.pp-eyebrow {
  display: none;
}

.pp-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.pp-card {
  grid-column: span 2;
  --pp-card-text: var(--pp-ivory);
  --pp-card-text-dim: var(--pp-ivory-dim);
  --pp-card-text-muted: var(--pp-ivory-dimmer);
  background: linear-gradient(
    90deg,
    rgba(196, 132, 168, 0.34) 0%,
    rgba(176, 108, 148, 0.24) 52%,
    rgba(155, 74, 128, 0.16) 100%
  );
  backdrop-filter: blur(14px) saturate(145%);
  -webkit-backdrop-filter: blur(14px) saturate(145%);
  border: 1px solid rgba(140, 45, 96, 0.14);
  border-radius: 24px;
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 10px 30px -24px rgba(140, 45, 96, 0.18);
  transition: transform 0.45s var(--pp-ease), border-color 0.35s var(--pp-ease),
    box-shadow 0.35s var(--pp-ease);
  opacity: 0;
  transform: translateY(24px);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  isolation: isolate;
}

.pp-card > * {
  position: relative;
  z-index: 1;
}

.pp-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0.28;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.75'/></svg>");
  z-index: 2;
}

.pp-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0.48;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/></svg>");
  z-index: 3;
}

.pp-card.pp-span-3 {
  grid-column: span 3;
}

.pp-card.pp-span-4 {
  grid-column: span 4;
}

.pp-card.pp-full {
  grid-column: span 6;
  max-width: 720px;
}

.pp-card.pp-full.pp-card--with-image {
  max-width: min(960px, 100%);
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .pp-card.pp-full.pp-card--with-image {
    grid-template-columns: 1.05fr 1fr;
    align-items: stretch;
  }

  .pp-card--image-right.pp-card--with-image .pp-card-media {
    order: 2;
  }

  .pp-card--image-right.pp-card--with-image .pp-card-body {
    order: 1;
  }
}

.pp-card-media {
  overflow: hidden;
  min-height: 220px;
}

.pp-card--with-image .pp-card-media {
  position: relative;
  min-height: 220px;
  height: 100%;
}

.pp-card-media img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 220px;
  object-fit: cover;
  transition: transform 1.1s cubic-bezier(0.16, 0.8, 0.24, 1);
}

.pp-card--with-image .pp-card-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: cover;
}

.pp-card-media--crop-top img {
  object-position: 50% 0%;
  object-fit: cover;
}

.pp-card-media--crop-bottom img {
  object-position: 50% 100%;
  object-fit: cover;
}

.pp-card--with-image:hover .pp-card-media--crop-top img {
  transform: scale(1.04);
  transform-origin: top center;
}

.pp-card--with-image:hover .pp-card-media--crop-bottom img {
  transform: scale(1.04);
  transform-origin: bottom center;
}

.pp-card--with-image:hover .pp-card-media:not(.pp-card-media--crop-top):not(.pp-card-media--crop-bottom) img {
  transform: scale(1.04);
}

.pp-card-body {
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.pp-card--with-image .pp-card-tag {
  top: 16px;
  right: 16px;
  z-index: 1;
}

.pp-card--with-image.pp-card--image-right .pp-card-tag {
  right: auto;
  left: 16px;
}

.pp-card.pp-featured {
  border-color: rgba(140, 45, 96, 0.2);
  background: linear-gradient(
    90deg,
    rgba(205, 145, 178, 0.4) 0%,
    rgba(186, 118, 158, 0.28) 50%,
    rgba(155, 74, 128, 0.18) 100%
  );
}

.pp-card:hover {
  border-color: rgba(140, 45, 96, 0.24);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.62),
    0 20px 40px -24px rgba(140, 45, 96, 0.22);
  transform: translateY(-3px);
}

.pp-card.pp-in:hover {
  transform: translateY(-3px);
}

.pp-card-tag {
  position: absolute;
  top: 20px;
  right: 20px;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-signal);
  background: rgba(255, 255, 255, 0.42);
  border: 1px solid rgba(140, 45, 96, 0.16);
  padding: 4px 10px;
  border-radius: 100px;
}

.pp-card-name {
  font-family: "Fraunces", "Cormorant", ui-serif, Georgia, serif;
  font-size: 1.45rem;
  font-weight: 500;
  line-height: 1.15;
  margin-bottom: 4px;
  padding-right: 0;
  color: var(--pp-card-text);
}

.pp-card-subtitle {
  color: var(--pp-card-text-dim);
  font-size: 14px;
  line-height: 1.6;
  margin: 10px 0 4px;
}

.pp-card-desc {
  color: var(--pp-card-text-dim);
  font-size: 14px;
  line-height: 1.65;
  margin: 12px 0 4px;
}

.pp-card-price-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 8px;
  margin: 16px 0 18px;
}

.pp-card-label {
  font-size: 11px;
  color: var(--pp-card-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  width: 100%;
}

.pp-card-price {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: clamp(1.35rem, 2vw, 1.65rem);
  font-weight: 500;
  color: var(--pp-ivory);
  letter-spacing: -0.02em;
}

.pp-card-unit {
  color: var(--pp-card-text-dim);
  font-size: 13px;
  font-weight: 400;
}

.pp-list-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pp-signal-soft);
  margin-bottom: 10px;
}

.pp-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;
  flex: 1;
}

.pp-list-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 28px;
  flex: 1;
}

@media (max-width: 640px) {
  .pp-list-columns {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.pp-card--compact {
  padding: 24px 22px;
}

.pp-card--compact .pp-card-name {
  font-size: 1.2rem;
}

.pp-card--compact .pp-card-price-row {
  margin: 12px 0 14px;
}

.pp-card--compact .pp-card-price {
  font-size: clamp(1.1rem, 1.6vw, 1.35rem);
}

.pp-card--compact .pp-list {
  gap: 6px;
}

.pp-card--compact .pp-list li {
  font-size: 13px;
}

.pp-list li {
  font-size: 13.5px;
  color: var(--pp-card-text-dim);
  line-height: 1.5;
  padding-left: 14px;
  position: relative;
}

.pp-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--pp-signal-soft);
}

.pp-card-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--pp-ivory);
  border-top: 1px solid rgba(140, 45, 96, 0.12);
  padding-top: 18px;
  margin-top: 22px;
  width: 100%;
  transition: color 0.3s var(--pp-ease);
  text-decoration: none;
}

.pp-card-cta svg {
  width: 14px;
  height: 14px;
  transition: transform 0.3s var(--pp-ease);
}

.pp-card:hover .pp-card-cta {
  color: var(--pp-signal-soft);
}

.pp-card:hover .pp-card-cta svg {
  transform: translateX(4px);
}

@media (max-width: 960px) {
  .pp-grid {
    grid-template-columns: 1fr;
  }
  .pp-card,
  .pp-card.pp-span-3,
  .pp-card.pp-span-4,
  .pp-card.pp-full,
  .pp-bento-video {
    grid-column: span 1;
  }

  .pp-bento-video {
    min-height: min(52vw, 260px);
  }
}

.pp-card.pp-in {
  opacity: 1;
  transform: translateY(0);
}

.pp-custom {
  margin: 0;
  border-radius: 28px;
  padding: clamp(40px, 6vw, 72px);
  background: linear-gradient(135deg, rgba(155, 74, 128, 0.1), rgba(140, 45, 96, 0.02));
  border: 1px solid rgba(140, 45, 96, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
}

.pp-custom h3 {
  font-family: "Fraunces", "Cormorant", ui-serif, Georgia, serif;
  font-weight: 400;
  font-size: clamp(26px, 3vw, 36px);
  color: var(--pp-signal);
  max-width: none;
}

@media (min-width: 640px) {
  .pp-custom h3 {
    white-space: nowrap;
  }
}

.pp-custom p {
  color: var(--pp-ivory-dim);
  margin-top: 10px;
  max-width: 44ch;
  font-size: 14.5px;
}

.pp-faq-item {
  border-bottom: 1px solid var(--pp-line);
}

.pp-faq-q {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: var(--pp-ivory-dim);
  font-family: "Fraunces", "Cormorant", ui-serif, Georgia, serif;
  font-size: clamp(17px, 2vw, 21px);
  font-weight: 400;
  padding: 24px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;
}

.pp-faq-q-text {
  flex: 1;
  min-width: 0;
  line-height: 1.35;
  text-wrap: pretty;
}

.pp-faq-icon {
  position: relative;
  width: 18px;
  height: 18px;
  flex: none;
}

.pp-faq-icon::before,
.pp-faq-icon::after {
  content: "";
  position: absolute;
  background: var(--pp-signal-soft);
  border-radius: 2px;
  transition: transform 0.35s var(--pp-ease);
}

.pp-faq-icon::before {
  top: 8px;
  left: 0;
  width: 18px;
  height: 1.6px;
}

.pp-faq-icon::after {
  top: 0;
  left: 8px;
  width: 1.6px;
  height: 18px;
}

.pp-faq-item.is-open .pp-faq-icon::after {
  transform: rotate(90deg) scaleX(0);
}

.pp-faq-a {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s var(--pp-ease);
}

.pp-faq-a p {
  color: var(--pp-ivory-dim);
  font-size: 14.5px;
  line-height: 1.7;
  padding-bottom: 24px;
  max-width: none;
  width: 100%;
}

.pp-footer-cta {
  padding: clamp(56px, 9vw, 100px) clamp(20px, 4vw, 56px) 48px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.pp-footer-cta h2 {
  font-family: "Fraunces", "Cormorant", ui-serif, Georgia, serif;
  font-weight: 400;
  font-size: clamp(32px, 5vw, 64px);
  max-width: 14ch;
  margin: 0 auto;
  letter-spacing: -0.01em;
}

.pp-page :focus-visible {
  outline: 2px solid var(--pp-signal);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .pp-page .pp-wave path,
  .pp-page .pp-divider::before,
  .pp-page .pp-divider::after,
  .pp-page .pp-dot {
    animation: none !important;
  }
  .pp-page .pp-wave path {
    stroke-dashoffset: 0;
  }
  .pp-card {
    opacity: 1;
    transform: none;
  }
}

/* -------- shared pink grain card -------- */
.grain-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(140, 45, 96, 0.14);
  background: linear-gradient(
    90deg,
    rgba(196, 132, 168, 0.34) 0%,
    rgba(176, 108, 148, 0.24) 52%,
    rgba(155, 74, 128, 0.16) 100%
  );
  backdrop-filter: blur(14px) saturate(145%);
  -webkit-backdrop-filter: blur(14px) saturate(145%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 10px 30px -24px rgba(140, 45, 96, 0.18);
  isolation: isolate;
  transition:
    transform 0.45s cubic-bezier(0.16, 0.8, 0.24, 1),
    border-color 0.35s cubic-bezier(0.16, 0.8, 0.24, 1),
    box-shadow 0.35s cubic-bezier(0.16, 0.8, 0.24, 1);
}

.grain-card > * {
  position: relative;
  z-index: 1;
}

.grain-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0.28;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.75'/></svg>");
  z-index: 2;
}

.grain-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0.48;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/></svg>");
  z-index: 3;
}

.grain-card--lift:hover,
.res-feature-card:hover {
  transform: translateY(-3px);
  border-color: rgba(140, 45, 96, 0.24);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.62),
    0 20px 40px -24px rgba(140, 45, 96, 0.22);
}

.surface-card {
  background: #ffffff;
  border: 1px solid rgba(140, 45, 96, 0.1);
  box-shadow: 0 10px 30px -24px rgba(140, 45, 96, 0.16);
  transition:
    transform 0.45s cubic-bezier(0.16, 0.8, 0.24, 1),
    border-color 0.35s cubic-bezier(0.16, 0.8, 0.24, 1),
    box-shadow 0.35s cubic-bezier(0.16, 0.8, 0.24, 1);
}

.surface-card--lift:hover {
  transform: translateY(-3px);
  border-color: rgba(140, 45, 96, 0.18);
  box-shadow: 0 20px 40px -24px rgba(140, 45, 96, 0.2);
}

/* -------- resources page (res-*) -------- */
.res-page {
  --res-manicure: #8c2d60;
  --res-twilight: #9b4a80;
  --res-blush: #faf3f6;
  --res-lavender: #f5f0f8;
  --res-warm: #f7f7f7;
  --res-shadow: 0 28px 70px -52px rgba(140, 45, 96, 0.22);
  --res-shadow-hover: 0 36px 90px -48px rgba(140, 45, 96, 0.3);
  --res-ease: cubic-bezier(0.16, 0.8, 0.24, 1);
}

.res-container {
  max-width: 1400px;
  margin: 0 auto;
}

.res-section {
  position: relative;
}

.res-grain::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.14;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>");
  z-index: 0;
}

.res-section > * {
  position: relative;
  z-index: 1;
}

.res-hero-texture {
  position: relative;
  height: min(52vh, 420px);
  border-radius: 32px;
  overflow: hidden;
  background: linear-gradient(145deg, #faf3f6 0%, #f5f0f8 45%, #efefef 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.res-hero-texture::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.65'/></svg>");
  animation: res-grain-drift 14s ease-in-out infinite alternate;
}

.res-hero-texture::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.55) 0%,
    transparent 55%,
    rgba(155, 74, 128, 0.06) 100%
  );
}

@keyframes res-grain-drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(-2%, -3%, 0) scale(1.04);
  }
}

.res-category {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--res-manicure);
}

.res-featured-grid {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 1024px;
  margin: 0 auto;
}

.res-feature-card {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 240px 1fr;
  min-height: 460px;
  border-radius: 24px;
  text-decoration: none;
  color: inherit;
}

@media (min-width: 768px) {
  .res-feature-card {
    grid-template-columns: 42% 1fr;
    grid-template-rows: none;
    height: 320px;
    min-height: 320px;
    align-items: stretch;
  }
}

.res-feature-card__media {
  position: relative;
  overflow: hidden;
  height: 240px;
  min-height: 240px;
}

@media (min-width: 768px) {
  .res-feature-card__media {
    height: 100%;
    min-height: 0;
  }
}

.res-feature-card__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.res-feature-card__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.42) 0%,
    rgba(0, 0, 0, 0.12) 45%,
    rgba(0, 0, 0, 0.38) 100%
  );
  opacity: 0.55;
  transition: opacity 0.55s var(--res-ease);
  z-index: 1;
}

.res-feature-card:hover .res-feature-card__shade {
  opacity: 0.45;
}

.res-feature-card__body {
  position: relative;
  z-index: 4;
  display: flex;
  min-height: 0;
  overflow: hidden;
  flex-direction: column;
  padding: 28px 26px 30px;
}

@media (min-width: 768px) {
  .res-feature-card__body {
    padding: 34px 32px 36px;
  }
}

.res-read-link {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--res-twilight);
}

.res-insights-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .res-insights-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: minmax(120px, auto);
    gap: 18px;
  }

  .res-placeholder--wide {
    grid-column: span 7;
    grid-row: span 2;
  }

  .res-placeholder--tall {
    grid-column: span 5;
    grid-row: span 2;
  }

  .res-placeholder--medium {
    grid-column: span 6;
  }

  .res-placeholder--compact {
    grid-column: span 6;
  }

  .res-insights-grid .res-placeholder:nth-child(4) {
    grid-column: 1 / 5;
  }

  .res-insights-grid .res-placeholder:nth-child(5) {
    grid-column: 5 / 9;
  }

  .res-insights-grid .res-placeholder:nth-child(6) {
    grid-column: 9 / 13;
  }
}

.res-placeholder {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid rgba(140, 45, 96, 0.08);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 18px 44px -36px rgba(140, 45, 96, 0.16);
}

.res-placeholder__thumb {
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: flex-end;
  padding: 16px 18px;
}

.res-placeholder--wide .res-placeholder__thumb {
  min-height: 200px;
}

.res-placeholder--tall .res-placeholder__thumb {
  min-height: 180px;
}

.res-placeholder__soon {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(140, 45, 96, 0.55);
}

.res-placeholder__body {
  padding: 20px 22px 24px;
}

.res-topic-pill {
  cursor: default;
  border-radius: 999px;
  border: 1px solid rgba(140, 45, 96, 0.12);
  background: rgba(255, 255, 255, 0.78);
  padding: 11px 18px;
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #1c1c1c;
  transition:
    transform 0.45s var(--res-ease),
    background 0.45s var(--res-ease),
    border-color 0.45s var(--res-ease),
    box-shadow 0.45s var(--res-ease);
}

.res-topic-pill:hover {
  transform: translateY(-2px);
  background: var(--res-blush);
  border-color: rgba(140, 45, 96, 0.22);
  box-shadow: 0 14px 36px -24px rgba(140, 45, 96, 0.35);
}

/* -------- home: what we do grid -------- */
.wwd-bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .wwd-bento {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .wwd-bento {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.wwd-bento__cell {
  min-height: 0;
  height: 100%;
  display: flex;
}

.wwd-bento__cell > * {
  flex: 1;
  width: 100%;
  min-height: 0;
}

.wwd-card__media {
  position: relative;
  flex: 0 0 192px;
  height: 192px;
  width: 100%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
}

.wwd-card__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.9s cubic-bezier(0.16, 0.8, 0.24, 1);
}

@media (min-width: 768px) {
  .wwd-card__media {
    flex: 0 0 208px;
    height: 208px;
  }
}

.wwd-card__body {
  flex: 1 1 auto;
}

.wwd-card:hover .wwd-card__media img {
  transform: scale(1.06);
}

@media (prefers-reduced-motion: reduce) {
  .res-hero-texture::before {
    animation: none;
  }

  .res-feature-card:hover,
  .grain-card--lift:hover,
  .surface-card--lift:hover,
  .wwd-card:hover .wwd-card__media img {
    transform: none;
  }

  .ow-stats-band-track {
    animation: none;
  }

  .hp-hero__scroll-line,
  .hp-hero__scroll-icon,
  .hp-vision__motion {
    animation: none;
  }

  .hp-tile__media:hover .hp-tile__video,
  .hp-tile__media:hover .hp-tile__image,
  .hp-focus__card:hover .hp-focus__video,
  .hp-proof__card:hover .hp-proof__media {
    transform: none;
  }
}

/* -------- home: premium video-forward layout -------- */
.hp-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  padding: 14px 26px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
  background: linear-gradient(135deg, var(--plum-deep) 0%, var(--plum) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 16px 36px -18px rgba(140, 40, 96, 0.55);
  transition:
    transform 350ms ease,
    box-shadow 350ms ease,
    border-color 350ms ease;
}

.hp-cta-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 22px 44px -16px rgba(140, 40, 96, 0.62);
}

.hp-cta-btn--inverted {
  color: var(--plum-deep);
  border-color: rgba(255, 255, 255, 0.85);
  background: #fff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 18px 40px -18px rgba(0, 0, 0, 0.35);
}

.hp-cta-btn--inverted:hover {
  border-color: #fff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 1),
    0 24px 48px -16px rgba(0, 0, 0, 0.42);
}

.hp-cta-btn--nav-transparent {
  padding: 10px 18px;
  font-size: 12.5px;
}

.hp-hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: #120810;
}

.hp-hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hp-hero__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(115deg, rgba(74, 20, 52, 0.58) 0%, rgba(74, 20, 52, 0.42) 38%, rgba(20, 8, 16, 0.52) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.08) 42%, rgba(0, 0, 0, 0.34) 100%);
}

.hp-hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 100svh;
  max-width: 1600px;
  flex-direction: column;
  justify-content: center;
  padding: 120px 24px 96px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .hp-hero__content {
    padding-left: 40px;
    padding-right: 40px;
  }
}

@media (min-width: 1024px) {
  .hp-hero__content {
    padding-left: 64px;
    padding-right: 64px;
  }
}

.hp-hero__headline {
  max-width: 14ch;
  font-size: clamp(2.35rem, 5.4vw, 4.6rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: #fff;
}

.hp-hero__subhead {
  margin-top: 1.35rem;
  max-width: 34rem;
  font-size: clamp(1rem, 1.55vw, 1.2rem);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
}

.hp-hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 28px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.72);
  transition: color 350ms ease;
}

.hp-hero__scroll:hover {
  color: #fff;
}

.hp-hero__scroll-line {
  display: block;
  width: 1px;
  height: 42px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.72));
  animation: hp-scroll-pulse 2.4s ease-in-out infinite;
}

.hp-hero__scroll-icon {
  width: 18px;
  height: 18px;
  animation: hp-scroll-bob 2.4s ease-in-out infinite;
}

@keyframes hp-scroll-pulse {
  0%, 100% { opacity: 0.45; transform: scaleY(0.82); }
  50% { opacity: 1; transform: scaleY(1); }
}

@keyframes hp-scroll-bob {
  0%, 100% { transform: translateY(0); opacity: 0.55; }
  50% { transform: translateY(4px); opacity: 1; }
}

.hp-section-inner {
  max-width: 1500px;
  margin: 0 auto;
  padding: 96px 24px;
}

@media (min-width: 768px) {
  .hp-section-inner {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.hp-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.42);
}

.hp-section-head {
  max-width: 34rem;
  margin-bottom: 2.75rem;
}

.hp-section-head--narrow {
  max-width: 30rem;
}

.hp-section-title {
  margin-top: 0.85rem;
  font-size: clamp(2rem, 3.4vw, 3rem);
  line-height: 1.04;
  letter-spacing: -0.03em;
  color: #111;
}

.hp-why {
  background: #fff;
  padding: 112px 24px 120px;
}

@media (min-width: 768px) {
  .hp-why {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.hp-why__statement {
  max-width: 920px;
  margin: 0 auto;
  font-size: clamp(1.85rem, 3.5vw, 3rem);
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: #111;
}

.hp-capabilities {
  background: #faf7f5;
}

.hp-bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 768px) {
  .hp-bento {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: minmax(160px, auto);
  }
}

.hp-bento__cell {
  min-height: 0;
}

@media (min-width: 768px) {
  .hp-bento__cell--lg {
    grid-column: span 6;
    grid-row: span 2;
  }

  .hp-bento__cell--md {
    grid-column: span 6;
  }

  .hp-bento__cell--sm {
    grid-column: span 6;
  }
}

@media (min-width: 1024px) {
  .hp-bento__cell--md {
    grid-column: span 4;
  }

  .hp-bento__cell--sm {
    grid-column: span 3;
  }
}

.hp-bento__tile {
  display: block;
  height: 100%;
  min-height: 220px;
  border-radius: 18px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hp-bento__cell--lg .hp-bento__tile {
    min-height: 360px;
  }

  .hp-bento__cell--md .hp-bento__tile {
    min-height: 240px;
  }

  .hp-bento__cell--sm .hp-bento__tile {
    min-height: 200px;
  }
}

.hp-tile__media {
  position: relative;
  height: 100%;
  min-height: inherit;
  overflow: hidden;
  background: #1a1018;
}

.hp-tile__video,
.hp-tile__image,
.hp-tile__gradient {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 350ms ease;
}

.hp-tile__media:hover .hp-tile__video,
.hp-tile__media:hover .hp-tile__image {
  transform: scale(1.04);
}

.hp-tile__play {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  display: inline-flex;
  height: 52px;
  width: 52px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(0, 0, 0, 0.28);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 350ms ease;
}

.hp-tile__media:hover .hp-tile__play {
  opacity: 1;
}

.hp-tile__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.08) 20%, rgba(0, 0, 0, 0.62) 100%);
  transition: background 350ms ease;
}

.hp-tile__media:hover .hp-tile__scrim {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.04) 18%, rgba(0, 0, 0, 0.48) 100%);
}

.hp-tile__title {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;
  z-index: 2;
  font-size: clamp(1.15rem, 1.8vw, 1.55rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.92);
  transition: color 350ms ease;
}

.hp-tile__media:hover .hp-tile__title {
  color: #fff;
}

.hp-secondary-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--plum-deep);
  transition: opacity 350ms ease;
}

.hp-secondary-link:hover {
  opacity: 0.72;
}

.hp-focus {
  background: #fff;
}

.hp-focus__grid {
  display: grid;
  gap: 12px;
}

@media (min-width: 900px) {
  .hp-focus__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.hp-focus__cell {
  min-height: 0;
}

.hp-focus__card {
  position: relative;
  display: block;
  min-height: 420px;
  overflow: hidden;
  border-radius: 18px;
  background: #120810;
}

@media (min-width: 900px) {
  .hp-focus__card {
    min-height: 520px;
  }
}

.hp-focus__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 350ms ease;
}

.hp-focus__card:hover .hp-focus__video {
  transform: scale(1.04);
}

.hp-focus__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.06) 24%, rgba(74, 20, 52, 0.58) 100%);
}

.hp-focus__copy {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  z-index: 2;
}

.hp-focus__title {
  font-size: clamp(1.45rem, 2vw, 1.85rem);
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: #fff;
}

.hp-focus__line {
  margin-top: 0.55rem;
  max-width: 26ch;
  font-size: 14px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.78);
}

.hp-vision {
  position: relative;
  overflow: hidden;
  padding: 112px 24px;
  background: linear-gradient(135deg, var(--plum-deep) 0%, var(--plum) 52%, #7a3a66 100%);
}

@media (min-width: 768px) {
  .hp-vision {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.hp-vision__motion {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.12), transparent 42%),
    radial-gradient(circle at 78% 68%, rgba(255, 255, 255, 0.08), transparent 40%);
  opacity: 0.45;
  animation: hp-vision-shift 16s ease-in-out infinite;
}

@keyframes hp-vision-shift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(2%, -2%, 0) scale(1.04); }
}

.hp-vision__text {
  position: relative;
  z-index: 1;
  max-width: 980px;
  margin: 0 auto;
  text-align: center;
  font-size: clamp(1.75rem, 3.2vw, 2.85rem);
  line-height: 1.16;
  letter-spacing: -0.03em;
  color: #fff;
}

.hp-proof {
  background: #faf7f5;
}

.hp-proof__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 1.75rem;
}

.hp-proof__scroll-wrap {
  margin-inline: -24px;
  overflow-x: auto;
  padding: 4px 24px 8px;
  scrollbar-width: none;
}

.hp-proof__scroll-wrap::-webkit-scrollbar {
  display: none;
}

.hp-proof__track {
  display: flex;
  gap: 12px;
  width: max-content;
}

.hp-proof__card {
  position: relative;
  display: block;
  width: min(78vw, 320px);
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 16px;
  background: #1a1018;
}

@media (min-width: 768px) {
  .hp-proof__card {
    width: 280px;
  }
}

.hp-proof__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 350ms ease;
}

.hp-proof__card:hover .hp-proof__media {
  transform: scale(1.03);
}

.hp-proof__card-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, 0.62) 100%);
}

.hp-proof__card-label {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 1;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.92);
}

.hp-proof__trust {
  margin-top: 2.5rem;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.38);
}

.hp-proof__marks {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.hp-proof__mark {
  border-radius: 999px;
  border: 1px solid rgba(140, 45, 96, 0.12);
  background: rgba(255, 255, 255, 0.72);
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: rgba(0, 0, 0, 0.58);
}

.hp-close {
  background: #fff;
  padding: 112px 24px 128px;
  text-align: center;
}

@media (min-width: 768px) {
  .hp-close {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.hp-close__copy {
  margin: 0 auto;
  max-width: 18ch;
  font-size: clamp(1.85rem, 3vw, 2.6rem);
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: #111;
}

/* -------- our work: proof / case studies -------- */
.ow-page {
  --ow-berry: var(--manicure);
  --ow-plum: var(--plum);
  --ow-plum-deep: var(--plum-deep);
  --ow-blush: #faf7f5;
  --ow-border: rgba(140, 45, 96, 0.1);
  --ow-border-strong: rgba(140, 45, 96, 0.14);
  --ow-muted: rgba(0, 0, 0, 0.55);
  --ow-muted-soft: rgba(0, 0, 0, 0.45);
  --ow-shadow: 0 18px 40px -18px rgba(140, 40, 96, 0.14);
}

.ow-page-head {
  padding: 132px 0 40px;
}

.ow-page-head h1 {
  max-width: 720px;
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #000000;
}

.ow-stats-band {
  overflow: hidden;
  border-top: 1px solid var(--ow-border);
  border-bottom: 1px solid var(--ow-border);
  background: var(--ow-blush);
  padding: 22px 0;
}

.ow-stats-band-track {
  display: flex;
  gap: 56px;
  width: max-content;
  animation: ow-stats-marquee 28s linear infinite;
}

.ow-stats-band-item {
  display: flex;
  flex-shrink: 0;
  align-items: baseline;
  gap: 10px;
  white-space: nowrap;
}

.ow-stats-band-item::after {
  content: "·";
  margin-left: 46px;
  font-family: var(--font-display);
  font-size: 20px;
  color: rgba(140, 45, 96, 0.28);
}

.ow-stats-band-value {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 500;
  line-height: 1;
  color: var(--ow-berry);
}

.ow-stats-band-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--ow-muted-soft);
}

@keyframes ow-stats-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 760px) {
  .ow-page-head {
    padding: 120px 0 32px;
  }
}

.ow-section {
  padding: 64px 0;
}

#instagram.ow-section {
  padding-bottom: 16px;
  overflow: visible;
}

#websites.ow-section {
  padding-top: 16px;
  overflow: visible;
}

.ow-page .ow-case-card.grain-card {
  border-color: rgba(140, 40, 96, 0.24);
  background: linear-gradient(
    135deg,
    rgba(140, 40, 96, 0.34) 0%,
    rgba(155, 74, 128, 0.28) 48%,
    rgba(196, 132, 168, 0.32) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.42),
    0 18px 40px -18px rgba(140, 40, 96, 0.26);
}

.ow-page .ow-case-card.grain-card--lift:hover {
  border-color: rgba(140, 40, 96, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 22px 46px -16px rgba(140, 40, 96, 0.32);
}

.ow-section-head h2 {
  margin-top: 0;
  font-family: var(--font-display);
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 500;
  line-height: 1.14;
  letter-spacing: -0.015em;
  color: #000000;
}

.ow-section-desc {
  margin-top: 14px;
  max-width: 620px;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--ow-muted);
}

.ow-carousel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 8px;
}

.ow-carousel-head .ow-section-head {
  flex: 1;
  max-width: none;
  width: 100%;
}

.ow-carousel-controls {
  display: flex;
  gap: 8px;
}

.ow-section-head {
  max-width: 620px;
  margin-bottom: 8px;
}

.ow-section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.ow-section-title-row h2 {
  margin: 0;
  flex: 1;
  min-width: 0;
}

.ow-section-title-row .ow-carousel-controls {
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .ow-section-title-row {
    align-items: flex-start;
  }
}

.ow-carousel-btn {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--ow-border);
  border-radius: 50%;
  background: #ffffff;
  color: var(--ow-muted);
  cursor: pointer;
  transition:
    background 0.25s cubic-bezier(0.16, 0.8, 0.24, 1),
    border-color 0.25s cubic-bezier(0.16, 0.8, 0.24, 1),
    color 0.25s cubic-bezier(0.16, 0.8, 0.24, 1),
    transform 0.2s cubic-bezier(0.16, 0.8, 0.24, 1);
}

.ow-carousel-btn:hover {
  border-color: var(--ow-berry);
  background: var(--ow-berry);
  color: #ffffff;
  transform: translateY(-2px);
}

.ow-track {
  display: flex;
  gap: 22px;
  margin: 0 -24px;
  padding: 14px 24px 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.ow-track::-webkit-scrollbar {
  display: none;
}

.ow-ig-card,
.ow-web-card {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  overflow: hidden;
  border-radius: 22px;
  scroll-snap-align: start;
}

.ow-ig-card {
  width: 400px;
}

.ow-ig-carousel,
.ow-web-carousel {
  position: relative;
  margin-top: 4px;
  padding: 0 clamp(8px, 2vw, 24px);
}

.ow-ig-carousel-shell,
.ow-web-carousel-shell {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(8px, 2vw, 20px);
}

.ow-ig-carousel-side-btn,
.ow-web-carousel-side-btn {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--ow-border);
  border-radius: 50%;
  background: #ffffff;
  color: var(--ow-berry);
  cursor: pointer;
  box-shadow: 0 12px 28px -18px rgba(140, 40, 96, 0.28);
  transition:
    background 0.25s cubic-bezier(0.16, 0.8, 0.24, 1),
    border-color 0.25s cubic-bezier(0.16, 0.8, 0.24, 1),
    color 0.25s cubic-bezier(0.16, 0.8, 0.24, 1),
    transform 0.2s cubic-bezier(0.16, 0.8, 0.24, 1);
}

.ow-ig-carousel-side-btn:hover,
.ow-web-carousel-side-btn:hover {
  border-color: var(--ow-berry);
  background: var(--ow-berry);
  color: #ffffff;
  transform: translateY(-2px);
}

.ow-ig-carousel-stage {
  position: relative;
  min-height: 560px;
  overflow: hidden;
}

.ow-web-carousel-stage {
  position: relative;
  min-height: 640px;
  overflow: hidden;
}

.ow-ig-carousel-card,
.ow-web-carousel-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(380px, 68vw);
  margin: 0;
  opacity: 0.85;
  cursor: pointer;
  transform-origin: center center;
  transition:
    transform 0.55s cubic-bezier(0.16, 0.8, 0.24, 1),
    filter 0.55s cubic-bezier(0.16, 0.8, 0.24, 1),
    box-shadow 0.55s cubic-bezier(0.16, 0.8, 0.24, 1),
    opacity 0.55s cubic-bezier(0.16, 0.8, 0.24, 1);
  will-change: transform, filter;
}

.ow-ig-carousel-card.is-center,
.ow-web-carousel-card.is-center {
  transform: translate(-50%, -50%) scale(1.12);
  filter: blur(0);
  z-index: 10;
  cursor: default;
  opacity: 1;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.52),
    0 34px 68px -20px rgba(140, 40, 96, 0.38),
    0 48px 40px -32px rgba(140, 40, 96, 0.24);
}

.ow-ig-carousel-card.is-left,
.ow-web-carousel-card.is-left {
  transform: translate(calc(-50% - min(368px, 56vw)), -50%) scale(0.88);
  filter: blur(3px);
  z-index: 5;
}

.ow-ig-carousel-card.is-right,
.ow-web-carousel-card.is-right {
  transform: translate(calc(-50% + min(368px, 56vw)), -50%) scale(0.88);
  filter: blur(3px);
  z-index: 5;
}

.ow-page .ow-ig-carousel-card.is-center.grain-card,
.ow-page .ow-web-carousel-card.is-center.grain-card {
  background: linear-gradient(
    135deg,
    rgba(140, 40, 96, 0.65) 0%,
    rgba(155, 74, 128, 0.57) 48%,
    rgba(196, 132, 168, 0.61) 100%
  );
}

.ow-ig-carousel-card.is-center.grain-card::before,
.ow-web-carousel-card.is-center.grain-card::before {
  opacity: 0.43;
}

.ow-ig-carousel-card.is-center.grain-card::after,
.ow-web-carousel-card.is-center.grain-card::after {
  opacity: 0.63;
}

.ow-page .ow-ig-carousel-card.grain-card,
.ow-page .ow-web-carousel-card.grain-card {
  background: linear-gradient(
    135deg,
    rgba(140, 40, 96, 0.5) 0%,
    rgba(155, 74, 128, 0.42) 48%,
    rgba(196, 132, 168, 0.46) 100%
  );
}

.ow-ig-carousel-card.is-left:hover,
.ow-ig-carousel-card.is-right:hover,
.ow-web-carousel-card.is-left:hover,
.ow-web-carousel-card.is-right:hover {
  filter: blur(1.5px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.48),
    0 22px 48px -16px rgba(140, 40, 96, 0.28);
}

.ow-ig-carousel-dots,
.ow-web-carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}

.ow-ig-carousel-dot,
.ow-web-carousel-dot {
  width: 8px;
  height: 8px;
  border: none;
  border-radius: 50%;
  background: rgba(140, 40, 96, 0.2);
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.16, 0.8, 0.24, 1),
    background 0.25s cubic-bezier(0.16, 0.8, 0.24, 1);
}

.ow-ig-carousel-dot.is-active,
.ow-web-carousel-dot.is-active {
  background: var(--ow-berry);
  transform: scale(1.25);
}

@media (max-width: 640px) {
  .ow-ig-carousel-shell,
  .ow-web-carousel-shell {
    grid-template-columns: auto 1fr auto;
    gap: 6px;
  }

  .ow-ig-carousel-side-btn,
  .ow-web-carousel-side-btn {
    width: 38px;
    height: 38px;
  }

  .ow-ig-carousel-stage {
    min-height: 520px;
  }

  .ow-web-carousel-stage {
    min-height: 580px;
  }

  .ow-ig-carousel-card,
  .ow-web-carousel-card {
    width: min(300px, 62vw);
  }

  .ow-ig-carousel-card.is-center,
  .ow-web-carousel-card.is-center {
    transform: translate(-50%, -50%) scale(1.08);
  }

  .ow-ig-carousel-card.is-left,
  .ow-web-carousel-card.is-left {
    transform: translate(calc(-50% - min(258px, 46vw)), -50%) scale(0.88);
    filter: blur(2.5px);
  }

  .ow-ig-carousel-card.is-right,
  .ow-web-carousel-card.is-right {
    transform: translate(calc(-50% + min(258px, 46vw)), -50%) scale(0.88);
    filter: blur(2.5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ow-ig-carousel-card,
  .ow-web-carousel-card {
    transition: none;
  }
}

.ow-web-card {
  width: 400px;
}

.ow-ig-top {
  padding: 22px 22px 0;
}

.ow-ig-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ow-ig-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: conic-gradient(from 200deg, var(--ow-berry), var(--dust-pink), var(--ow-plum), var(--ow-berry));
}

.ow-ig-avatar span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--ow-blush);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--ow-berry);
}

.ow-ig-id {
  min-width: 0;
}

.ow-ig-name {
  overflow: hidden;
  font-size: 14.5px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ow-ig-field {
  overflow: hidden;
  font-size: 12.5px;
  color: var(--ow-muted-soft);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ow-ig-metrics {
  display: flex;
  margin-top: 20px;
  border-top: 1px solid var(--ow-border);
  border-bottom: 1px solid var(--ow-border);
}

.ow-ig-metrics div {
  flex: 1;
  padding: 14px 4px;
  border-left: 1px solid var(--ow-border);
  text-align: center;
}

.ow-ig-metrics div:first-child {
  border-left: none;
}

.ow-ig-metrics strong {
  display: block;
  font-family: var(--font-display);
  font-size: 19px;
}

.ow-ig-metrics span {
  font-size: 10.5px;
  font-weight: 500;
  color: var(--ow-muted-soft);
}

.ow-ig-growth {
  padding: 16px 22px 0;
}

.ow-ig-growth-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ow-ig-growth-nums {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ow-muted-soft);
}

.ow-ig-growth-nums b {
  font-weight: 700;
  color: #000000;
}

.ow-ig-growth-pill {
  padding: 4px 9px;
  border-radius: 100px;
  background: rgba(140, 40, 96, 0.1);
  font-size: 11px;
  font-weight: 700;
  color: var(--ow-berry);
}

.ow-ig-quote {
  flex: 1;
  margin: 16px 22px 22px;
  padding: 16px 16px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.72);
}

.ow-ig-quote p {
  font-family: var(--font-display);
  font-size: 14px;
  font-style: italic;
  line-height: 1.5;
  color: #111111;
}

.ow-ig-quote .ow-stars {
  margin-top: 10px;
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--ow-plum);
}

.ow-ig-quote .ow-src {
  margin-top: 4px;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--ow-muted-soft);
}

.ow-browser-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 11px 14px;
  border-bottom: 1px solid rgba(140, 45, 96, 0.14);
  background: rgba(255, 255, 255, 0.34);
}

.ow-browser-bar .ow-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(140, 45, 96, 0.12);
}

.ow-browser-bar .ow-addr {
  display: flex;
  flex: 1;
  align-items: center;
  height: 22px;
  margin-left: 8px;
  padding: 0 10px;
  overflow: hidden;
  border: 1px solid var(--ow-border);
  border-radius: 7px;
  background: #ffffff;
  font-size: 11px;
  font-weight: 500;
  color: var(--ow-muted-soft);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ow-web-photo {
  width: 100%;
  height: 190px;
  object-fit: cover;
  object-position: top center;
  background: var(--ow-blush);
}

.ow-web-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 18px 22px 22px;
}

.ow-web-name {
  font-size: 15.5px;
  font-weight: 700;
}

.ow-web-quote {
  margin-top: 0;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.36);
  border: 1px solid rgba(255, 255, 255, 0.42);
  font-family: var(--font-display);
  font-size: 14.5px;
  font-style: italic;
  line-height: 1.5;
}

.ow-web-tag {
  display: inline-block;
  width: fit-content;
  margin-bottom: 12px;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(140, 40, 96, 0.08);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--ow-berry);
}

.ow-web-field {
  margin-top: 2px;
  margin-bottom: 16px;
  font-size: 12.5px;
  color: var(--ow-muted-soft);
}

.ow-web-metrics {
  display: flex;
  gap: 22px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--ow-border);
}

.ow-web-metrics strong {
  display: block;
  font-family: var(--font-display);
  font-size: 21px;
  color: var(--ow-berry);
}

.ow-web-metrics span {
  font-size: 11px;
  color: var(--ow-muted-soft);
}

@media (max-width: 560px) {
  .ow-ig-card {
    width: min(360px, 88vw);
  }

  .ow-web-card {
    width: min(400px, 88vw);
  }
}

.ow-cta {
  position: relative;
  overflow: hidden;
  margin: 0 24px 24px;
  padding: 96px 60px;
  border-radius: 32px;
  background:
    radial-gradient(circle at 12% 88%, rgba(255, 220, 238, 0.22), transparent 42%),
    radial-gradient(ellipse 700px 400px at 80% 0%, var(--ow-plum) 0%, var(--ow-berry) 60%, var(--ow-plum-deep) 130%);
  color: #ffffff;
  text-align: center;
  box-shadow: 0 32px 70px -36px rgba(140, 40, 96, 0.45);
}

.ow-cta-dna {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}

.ow-cta-dna-svg {
  position: absolute;
  left: 50%;
  top: 54%;
  width: min(92%, 920px);
  height: auto;
  transform: translate(-36%, -42%) rotate(-16deg);
  opacity: 0.76;
}

.ow-cta::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 15% 90%, rgba(255, 255, 255, 0.14), transparent 55%),
    radial-gradient(circle at 88% 18%, rgba(255, 220, 238, 0.12), transparent 40%);
  pointer-events: none;
}

.ow-cta-content {
  position: relative;
  z-index: 2;
}

.ow-cta h2 {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
  font-family: var(--font-display);
  font-size: clamp(28px, 4.2vw, 50px);
  font-style: italic;
  font-weight: 500;
  line-height: 1.14;
  text-shadow: 0 2px 18px rgba(60, 10, 35, 0.22);
}

.ow-cta p {
  position: relative;
  max-width: 440px;
  margin: 18px auto 0;
  font-size: 15.5px;
  opacity: 0.9;
  text-shadow: 0 1px 12px rgba(60, 10, 35, 0.18);
}

.ow-cta-actions {
  position: relative;
  margin-top: 32px;
}

.ow-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  border-radius: 100px;
  background: #ffffff;
  color: var(--ow-berry);
  font-size: 14.5px;
  font-weight: 700;
  transition:
    transform 0.3s cubic-bezier(0.16, 0.8, 0.24, 1),
    box-shadow 0.3s cubic-bezier(0.16, 0.8, 0.24, 1);
}

.ow-cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 30px -10px rgba(0, 0, 0, 0.35);
}

@media (max-width: 600px) {
  .ow-cta {
    margin: 0 16px 16px;
    padding: 64px 26px;
  }

  .ow-cta-dna-svg {
    right: -28%;
    bottom: -18%;
    width: 120%;
    opacity: 0.62;
    transform: rotate(-14deg);
  }
}
```

